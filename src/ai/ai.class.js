const EventEmitter = require("events");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const agentConfig = require("./config/agentConfig");

const OPEN_AI_MODEL = process.env.OPEN_AI_MODEL || "gpt-4";

const IMessages = [];
class EmployeesAddon extends EventEmitter {
  constructor(apiKey) {
    super();
    this.openai = new OpenAI({ apiKey, timeout: 15000 });
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPEN_AI_KEY is missing");
    }
    this.chatHistory = new Map(IMessages);
  }

  async createChat(messages, model, temperature = 0) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model || OPEN_AI_MODEL,
        messages,
        temperature,
        max_tokens: 4096,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      this.emit("gas_token", {
        amount: completion.usage.total_tokens || 0,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "ERROR";
    }
  }

  //A partir de aqui es relacionado para encontrar y usar al asistente IA creado

  /**
   *
   * @param {string} assistantName Nombre de asistente que se desea buscar
   * @returns id del asistente por medio de su nombre
   */
  async findOrCreateAssistant(assistantName) {
    try {
      const config = agentConfig[assistantName];
      if (!config) {
        throw new Error(
          `No configuration found for assistant named ${assistantName}`
        );
      }
      const assistants = await this.openai.beta.assistants.list();
      const assistant = assistants.data.find(
        (assist) => assist.name === assistantName
      );
      let assistantId;
      if (assistant) {
        assistantId = assistant.id;
      } else {
        const newAssistant = await this.openai.beta.assistants.create({
          instructions: config.instructions,
          name: assistantName,
          tools: [{ type: "file_search" }],
          model: config.model,
          temperature: config.temperature,
        });
        assistantId = newAssistant.id;
        // Create vector store associated with this assistant
        const vectorStore = await this.openai.beta.vectorStores.create({
          name: `${assistantName} Document Store`,
        });
        // Upload files and get their IDs
        const fileIds = await Promise.all(
          config.files.map(async (file) => {
            const fileData = await this.openai.files.create({
              file: fs.createReadStream(path.resolve(__dirname, file)),
              purpose: "assistants",
            });
            return fileData.id;
          })
        );

        // Correctly use createAndPoll with file_ids
        await this.openai.beta.vectorStores.fileBatches.createAndPoll(
          vectorStore.id,
          {
            file_ids: fileIds,
          }
        );

        // Link the vector store to the assistant
        await this.openai.beta.assistants.update(assistantId, {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStore.id] },
          },
        });
      }

      return assistantId;
    } catch (error) {
      console.error("Error find or create agent:", error);
      throw error;
    }
  }

  async talkToAssistant(assistantId, message) {
    try {
      const filePathTxt = path.resolve(
        __dirname,
        "../../assets/LAVANDERIA_CHIC.txt"
      );
      const filePathPdf = path.resolve(
        __dirname,
        "../../assets/LISTA_PRECIOS.pdf"
      );

      const fileDataPdf = await this.openai.files.create({
        file: fs.createReadStream(filePathPdf),
        purpose: "assistants",
      });
      const fileDataTxt = await this.openai.files.create({
        file: fs.createReadStream(filePathTxt),
        purpose: "assistants",
      });

      // Crear un thread con el mensaje del usuario y los archivos adjuntos
      const thread = await this.openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text", // Agregar esta línea para especificar el tipo de contenido
                text: message,
              },
            ],
            attachments: [
              { file_id: fileDataTxt.id, tools: [{ type: "file_search" }] },
              { file_id: fileDataPdf.id, tools: [{ type: "file_search" }] },
            ],
          },
        ],
      });
      // Crear y ejecutar el run del asistente utilizando el ID específico
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      // Esperar a que el run complete
      let completedRun;
      do {
        completedRun = await this.openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
      } while (
        completedRun.status !== "completed" &&
        completedRun.status !== "failed"
      );

      // Si el run falla, manejar el error
      if (completedRun.status === "failed") {
        console.error("Run failed:", completedRun.last_error);
        return null;
      }

      // Recuperar los mensajes después de que el run haya completado
      const messages = await this.openai.beta.threads.messages.list(thread.id);
      const assistantMessages = messages.data.filter(
        (m) => m.role === "assistant"
      );
      const lastMessage = assistantMessages[assistantMessages.length - 1];
      return lastMessage
        ? lastMessage.content[0].text.value
        : "No response from assistant";
    } catch (error) {
      console.error("Error talking to assistant:", error);
      return null;
    }
  }
}

module.exports = EmployeesAddon;
