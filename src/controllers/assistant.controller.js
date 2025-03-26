// Desc: Controller for assistant management routes
require('dotenv').config();

const AiService = require('../ai/ai.class');

const apikey = process.env.OPENAI_API_KEY;
exports.findOrCreateAssistant = async (req, res) => {
  try {
    const ai = new AiService(apikey);
    const assistantName = req.body.assistantName; 
    const assistantId = await ai.findOrCreateAssistant(assistantName);
    res.status(200).json({ assistantId });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controlador para obtener información de un asistente
exports.getAssistantInfo = async (req, res) => {
  try {
    const assistantId = req.params.assistantId;
    const ai = new AiService(apikey);
    const assistantInfo = await ai.getAssistantInfo(assistantId);
    res.status(200).json(assistantInfo);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
