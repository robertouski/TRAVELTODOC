const path = require('path');
const prompt_0 = require('../prompts/prompt_agent_0');
const agents = {
    "agent_info_general": {
        instructions: prompt_0,
        files: [path.resolve(__dirname, '../../assets/Preguntas frecuentes general .pdf')],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    },
    // "agent_cir_bariatrica": {
    //     instructions: prompt_1,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.5
    // },
    // "agent_cir_aumento_mamario": {
    //     instructions: prompt_2,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.5
    // },
    // "agent_cir_reduccion_mamario": {
    //     instructions: prompt_3,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.5
    // },
    // "agent_cir_levantamiento_mamario": {
    //     instructions: prompt_4,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.5
    // },
    // "agent_coordinador_agendar": {
    //     instructions: prompt_5,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.3
    // },
    // "agent_coordinador_cancelar": {
    //     instructions: prompt_6,
    //     files: [],
    //     model: "gpt-4o-mini-2024-07-18",
    //     temperature: 0.3
    // }
};

module.exports = agents;
