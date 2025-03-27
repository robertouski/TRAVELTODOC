const Services = require("../supabase/models/services.model");
const services = new Services();
const axios = require("axios");
const tmp = require("tmp");
const fs = require("fs");
const EventEmitter = require("events");
const { OpenAI, toFile } = require("openai");
const agentConfig = require("./config/agentConfig");

const IMessages = [];
class EmployeesAddon extends EventEmitter {
  constructor(apiKey) {
    super();
    this.openai = new OpenAI({ apiKey, timeout: 60000, maxRetries: 3 });
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPEN_AI_KEY is missing");
    }
    this.chatHistory = new Map(IMessages);
  }

  tempFile = () =>
    new Promise((resolve, reject) => {
      tmp.file({ postfix: ".pdf" }, (err, path, fd, cleanup) => {
        if (err) reject(err);
        resolve({ path, cleanup });
      });
    });

  async findOrCreateAssistant(assistantName) {
    let tempFiles = [];
    try {
      const config = agentConfig[assistantName];
      if (!config)
        throw new Error(`Configuración no encontrada para ${assistantName}`);

      const assistants = await this.openai.beta.assistants.list();
      const existingAssistant = assistants.data.find(
        (a) => a.name === assistantName
      );
      if (existingAssistant) {
        console.log(
          `✅ Asistente existente encontrado: ${assistantName} (ID: ${existingAssistant.id})`
        );
        return existingAssistant.id;
      }

      const pdfTypes = Array.isArray(config.pdfType)
        ? config.pdfType
        : [config.pdfType];
      console.log(
        `🔍 Buscando ${pdfTypes.length} PDF(s) para ${assistantName}...`
      );

      const pdfUrls = await Promise.all(
        pdfTypes.map(async (type) => {
          const servicios = await services.getByCountryAndService(
            config.country,
            config.servicio
          );
          if (!servicios?.length) throw new Error("Servicio no encontrado");
          const pdfKey = `${type}_pdf`;
          const pdfUrl = servicios[0][pdfKey];
          if (!pdfUrl) throw new Error(`URL no encontrada para ${type}`);
          console.log(`📄 URL obtenida (${type}): ${pdfUrl}`);
          return { type, url: pdfUrl };
        })
      );

      console.log(`🛠️ Creando nuevo asistente: ${assistantName}`);
      const newAssistant = await this.openai.beta.assistants.create({
        instructions: config.instructions,
        name: assistantName,
        tools: [{ type: "file_search" }],
        model: config.model,
        temperature: config.temperature,
      });
      console.log(`🎉 Asistente creado: ${newAssistant.id}`);

      console.log(`📦 Creando vector store para ${assistantName}...`);
      const vectorStore = await this.openai.beta.vectorStores.create({
        name: `${assistantName} Document Store`,
      });
      console.log(`🆔 Vector Store ID: ${vectorStore.id}`);

      const fileIds = await Promise.all(
        pdfUrls.map(async ({ type, url }) => {
          const { path: tempPath, cleanup } = await this.tempFile();
          tempFiles.push({ path: tempPath, cleanup });

          const response = await axios({
            method: "get",
            url: url,
            responseType: "stream",
          });
          const writer = fs.createWriteStream(tempPath);
          response.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          const readStream = fs.createReadStream(tempPath);
          const fileForOpenAI = await toFile(readStream);

          const fileData = await this.openai.files.create({
            file: fileForOpenAI,
            purpose: "assistants",
            metadata: {
              /* ... */
            },
          });

          return fileData.id;
        })
      );

      console.log(
        `🔗 Vinculando ${fileIds.length} archivos al Vector Store...`
      );
      const batch =
        await this.openai.beta.vectorStores.fileBatches.createAndPoll(
          vectorStore.id,
          { file_ids: fileIds }
        );
      console.log(`📦 Estado del batch: ${batch.status}`);
      console.log(`📊 Estadísticas: 
        - Archivos exitosos: ${batch.file_counts.succeeded}
        - Archivos fallidos: ${batch.file_counts.failed}
      `);

      console.log(`🤝 Asociando Vector Store al asistente...`);
      const updatedAssistant = await this.openai.beta.assistants.update(
        newAssistant.id,
        {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStore.id] },
          },
        }
      );
      console.log(
        `✅ Configuración finalizada. Vector Stores asociados: ${updatedAssistant.tool_resources.file_search.vector_store_ids}`
      );

      return newAssistant.id;
    } catch (error) {
      console.error("❌ Error en findOrCreateAssistant:", error);
      throw error;
    } finally {
      console.log(`🧹 Limpiando ${tempFiles.length} archivos temporales...`);
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

module.exports = EmployeesAddon;
