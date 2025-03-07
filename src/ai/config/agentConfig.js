const path = require('path');
const prompt_0 = require('../prompts/prompt_agent_0');
const agents = {
    "agent_info_general": {
        instructions: prompt_0,
        files: [path.resolve(__dirname, '../../assets/Preguntas frecuentes general .pdf')],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    },
    "Marco": {
        instructions: `ESTE BOT AUN ESTA POR CREARCE, NO RESPONDE A PREGUNTAS POR AHORA.`,
        files: [],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0.5
    }
};

module.exports = agents;
