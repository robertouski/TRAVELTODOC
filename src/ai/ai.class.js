const Services = require("../supabase/models/services.model");
const services = new Services();
const axios = require("axios");
const tmp = require("tmp");
const fs = require("fs");
const EventEmitter = require("events");
const { OpenAI, toFile } = require("openai");
const agentConfig = require("./config/agentConfig"); // Archivo de configuración con la lista de agentes

class EmployeesAddon extends EventEmitter {
  constructor(apiKey) {
    super();
    this.openai = new OpenAI({ apiKey, timeout: 60000, maxRetries: 3 });
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPEN_AI_KEY is missing");
    }
    this.chatHistory = new Map();
  }

  // Método auxiliar para crear un archivo temporal que se usará para los PDFs
  tempFile = () =>
    new Promise((resolve, reject) => {
      tmp.file({ postfix: ".pdf" }, (err, path, fd, cleanup) => {
        if (err) return reject(err);
        resolve({ path, cleanup });
      });
    });

    async retry(fn, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err) {
          console.warn(`⚠️ Reintento ${i + 1} tras error:`, err.message);
          if (i === retries - 1) throw err;
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    

  /**
   * Método: findAssistant()
   * Búsqueda de asistente según el nombre recibido.
   * Si lo encuentra, retorna su ID.
   * De lo contrario, lanza un error con el mensaje "No assistant found".
   */
  async findAssistant(assistantName) {
    try {
      console.log("🔍 Buscando asistente:", assistantName);
      const assistants = await this.openai.beta.assistants.list();
      // Se busca el asistente por nombre
      const existingAssistant = assistants.data.find(
        (a) => a.name === assistantName
      );
      if (existingAssistant) {
        console.log(
          `✅ Asistente encontrado: ${assistantName} (ID: ${existingAssistant.id})`
        );
        return existingAssistant.id;
      } else {
        console.error(`❌ No assistant found with name: ${assistantName}`);
        throw new Error("No assistant found");
      }
    } catch (error) {
      console.error("❌ Error en findAssistant:", error);
      throw error;
    }
  }

  /**
   * Método: createAssistant()
   * Recorre la lista de agentes definida en agentConfig y para cada uno:
   *  - Crea el asistente utilizando su configuración.
   *  - Crea la base de datos vectorial (Vector Store) asociada.
   *  - Descarga los PDF(s) indicados (por país y servicio) y los sube a OpenAI.
   *  - Vincula los archivos subidos a la base de datos vectorial.
   *  - Asocia el vector store al asistente mediante la herramienta "file_search".
   */
  async createAssistant() {
    const agentNames = Object.keys(agentConfig);
    for (const assistantName of agentNames) {
      let tempFiles = [];
      const config = agentConfig[assistantName];
      console.log(`\n🛠️  Creando nuevo asistente: ${assistantName}`);
      try {
        const newAssistant = await this.openai.beta.assistants.create({
          instructions: config.instructions,
          name: assistantName,
          tools: [{ type: "file_search" }],
          model: config.model,
          temperature: config.temperature,
        });
        console.log(`🎉 Asistente creado: ${newAssistant.id}`);
  
        const vectorStore = await this.openai.beta.vectorStores.create({
          name: `${assistantName} Document Store`,
        });
        console.log(`🆔 Vector Store ID: ${vectorStore.id}`);
  
        const pdfTypes = Array.isArray(config.pdfType)
          ? config.pdfType
          : [config.pdfType];
        console.log(`🔍 Buscando ${pdfTypes.length} PDF(s) para ${assistantName}...`);
  
        const fileIds = [];
  
        for (const type of pdfTypes) {
          const servicios = await services.getByCountryAndService(config.country, config.servicio);
          if (!servicios?.length) throw new Error("Servicio no encontrado");
  
          const pdfKey = `${type}_pdf`;
          const pdfUrl = servicios[0][pdfKey];
          if (!pdfUrl) throw new Error(`URL no encontrada para ${type}`);
          console.log(`📄 URL obtenida (${type}): ${pdfUrl}`);
  
          const { path: tempPath, cleanup } = await this.tempFile();
          tempFiles.push({ path: tempPath, cleanup });
  
          const response = await retry(() => axios({
            method: "get",
            url: pdfUrl,
            responseType: "stream",
            timeout: 10000,
          }));
  
          const writer = fs.createWriteStream(tempPath);
          response.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
  
          const readStream = fs.createReadStream(tempPath);
          const fileForOpenAI = await toFile(readStream);
  
          const fileData = await retry(() => this.openai.files.create({
            file: fileForOpenAI,
            purpose: "assistants",
          }));
  
          console.log(`📤 Archivo subido (${type}): ${fileData.id}`);
          fileIds.push(fileData.id);
        }
  
        console.log(`🔗 Vinculando ${fileIds.length} archivos al Vector Store...`);
        const batch = await this.openai.beta.vectorStores.fileBatches.createAndPoll(
          vectorStore.id,
          { file_ids: fileIds }
        );
        console.log(`📦 Estado del batch: ${batch.status}`);
        console.log(`📊 Estadísticas:
          - Archivos exitosos: ${batch.file_counts.succeeded}
          - Archivos fallidos: ${batch.file_counts.failed}
        `);
  
        await this.openai.beta.assistants.update(newAssistant.id, {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStore.id] },
          },
        });
  
        console.log(`✅ Asistente ${assistantName} completado. ID: ${newAssistant.id}`);
      } catch (error) {
        console.error(`❌ Error al crear el asistente ${assistantName}:`, error);
      } finally {
        console.log(`🧹 Limpiando ${tempFiles.length} archivos temporales para ${assistantName}...`);
        tempFiles.forEach(({ cleanup }) => {
          try {
            cleanup();
          } catch (err) {
            console.error("⚠️ Error limpiando archivo temporal:", err);
          }
        });
      }
    }
  }
  /**
 * Función: deleteAssistants()
 * Recorre todos los nombres definidos en agentConfig y elimina el asistente
 * correspondiente en OpenAI, si existe.
 */
async deleteAssistants() {
  // Obtener el listado de nombres de agentes del objeto agentConfig
  const agentNames = Object.keys(agentConfig);
  
  // Iterar uno por uno para eliminar el asistente
  for (const assistantName of agentNames) {
    try {
      // Se usa findAssistant para obtener el ID del asistente (o lanzar un error si no existe)
      const assistantId = await this.findAssistant(assistantName);
      console.log(`🗑️  Borrando asistente: ${assistantName} (ID: ${assistantId})`);
      
      // Se supone que el API de OpenAI tiene un método delete para borrar el asistente
      await this.openai.beta.assistants.del(assistantId);
      console.log(`✅ Asistente ${assistantName} borrado exitosamente.`);
    } catch (error) {
      // En caso de no encontrar el asistente u otro error, se informa y se continúa con el siguiente
      console.error(`❌ No se pudo borrar el asistente ${assistantName}: ${error.message}`);
    }
  }
}

}

module.exports = EmployeesAddon;
