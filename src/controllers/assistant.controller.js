// Desc: Controller for assistant management routes
require('dotenv').config();

const AiService = require('../ai/ai.class');

const apikey = process.env.OPENAI_API_KEY;
const ai = new AiService(apikey);
exports.findAssistant = async (req, res) => {
  try {
    const assistantName = req.body.assistantName; 
    const assistantId = await ai.findAssistant(assistantName);
    res.status(200).json({ assistantId });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.createAssistant = async (req, res) => {
  try {
    await ai.createAssistant();
    res.status(200).json({ message: "Assistant created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAssistant = async (req, res) => {
  try {
    await ai.deleteAssistants();
    res.status(200).json({ message: "Assistant deleted successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

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
