// agentConfig.js

// 1. IMPORTA TUS PROMPTS
const prompt_0 = require("../prompts/prompt_agent_0");
const prompt_1 = require("../prompts/prompt_agent_1");
const prompt_2 = require("../prompts/prompt_agent_2");
const prompt_3 = require("../prompts/prompt_agent_3");
const prompt_4 = require("../prompts/prompt_agent_4");
const prompt_5 = require("../prompts/prompt_agent_5");
const prompt_6 = require("../prompts/prompt_agent_6");
const prompt_7 = require("../prompts/prompt_agent_7");
const prompt_8 = require("../prompts/prompt_agent_8");
const prompt_9 = require("../prompts/prompt_agent_9");
const prompt_10 = require("../prompts/prompt_agent_10");
const prompt_11 = require("../prompts/prompt_agent_11");
const prompt_12 = require("../prompts/prompt_agent_12");
const prompt_13 = require("../prompts/prompt_agent_13");
const prompt_14 = require("../prompts/prompt_agent_14");
const prompt_15 = require("../prompts/prompt_agent_15");
const prompt_16 = require("../prompts/prompt_agent_16");

// 2. FUNCIÓN FACTORÍA PARA CREAR CONFIGURACIONES
const createAgentConfig = (country, service, prompt) => ({
  instructions: prompt,
  country: country,
  servicio: service,
  pdfType: ["propuesta", "presupuesto"], 
  model: "gpt-4o-mini-2024-07-18",
  temperature: 0.2
});

// 3. EXPORTA TODOS TUS AGENTES
module.exports = agents = {
  // AGENTE DE INFO GENERAL (tal como lo tenías)
  agent_info_general: {
    instructions: prompt_0,
    country: "General",
    servicio: "info_general",
    pdfType: "propuesta",
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0
  },

  // EJEMPLOS URUGUAY (como ya lo tenías)
  agent_uruguay_bariatrica:createAgentConfig("Uruguay", "Cirugía Bariátrica",     prompt_1),
  agent_uruguay_aumento_mamario:createAgentConfig("Uruguay", "Aumento Mamario",        prompt_2),
  agent_uruguay_levantamiento_mamario: createAgentConfig("Uruguay", "Levantamiento Mamario",  prompt_3),
  agent_uruguay_reduccion_mamaria:   createAgentConfig("Uruguay", "Reducción Mamaria",      prompt_4),

  // NUEVOS EJEMPLOS PARA CHILE
  agent_chile_bariatrica:            createAgentConfig("Chile",   "Cirugía Bariátrica",     prompt_5),
  agent_chile_aumento_mamario:       createAgentConfig("Chile",   "Cumento Mamario",        prompt_6),
  agent_chile_levantamiento_mamario: createAgentConfig("Chile",   "Cevantamiento Mamario",  prompt_7),
  agent_chile_reduccion_mamaria:     createAgentConfig("Chile",   "Ceducción Mamaria",      prompt_8),

  // NUEVOS EJEMPLOS PARA BOLIVIA
  agent_bolivia_bariatrica:            createAgentConfig("Bolivia",   "Cirugía Bariátrica",     prompt_9),
  agent_bolivia_aumento_mamario:       createAgentConfig("Bolivia",   "Aumento Mamario",        prompt_10),
  agent_bolivia_levantamiento_mamario: createAgentConfig("Bolivia",   "Levantamiento Mamario",  prompt_11),
  agent_bolivia_reduccion_mamaria:     createAgentConfig("Bolivia",   "Reducción Mamaria",      prompt_12),

  // NUEVOS EJEMPLOS PARA PARAGUAY
  agent_paraguay_bariatrica:            createAgentConfig("Paraguay",   "Cirugía Bariátrica",     prompt_13),
  agent_paraguay_aumento_mamario:       createAgentConfig("Paraguay",   "Aumento Mamario",        prompt_14),
  agent_paraguay_levantamiento_mamario: createAgentConfig("Paraguay",   "Levantamiento Mamario",  prompt_15),
  agent_paraguay_reduccion_mamaria:     createAgentConfig("Paraguay",   "Reducción Mamaria",      prompt_16),
};
