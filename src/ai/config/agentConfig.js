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
  country: country.toLowerCase(),
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
  agent_uruguay_bariatrica:          createAgentConfig("uruguay", "cirugia bariatrica",     prompt_1),
  agent_uruguay_aumento_mamario:     createAgentConfig("uruguay", "aumento mamario",        prompt_2),
  agent_uruguay_levantamiento_mamario: createAgentConfig("uruguay", "levantamiento mamario",  prompt_3),
  agent_uruguay_reduccion_mamaria:   createAgentConfig("uruguay", "reduccion mamaria",      prompt_4),

  // NUEVOS EJEMPLOS PARA CHILE
  agent_chile_bariatrica:            createAgentConfig("chile",   "cirugia bariatrica",     prompt_5),
  agent_chile_aumento_mamario:       createAgentConfig("chile",   "aumento mamario",        prompt_6),
  agent_chile_levantamiento_mamario: createAgentConfig("chile",   "levantamiento mamario",  prompt_7),
  agent_chile_reduccion_mamaria:     createAgentConfig("chile",   "reduccion mamaria",      prompt_8),

  // NUEVOS EJEMPLOS PARA BOLIVIA
  agent_bolivia_bariatrica:            createAgentConfig("bolivia",   "cirugia bariatrica",     prompt_9),
  agent_bolivia_aumento_mamario:       createAgentConfig("bolivia",   "aumento mamario",        prompt_10),
  agent_bolivia_levantamiento_mamario: createAgentConfig("bolivia",   "levantamiento mamario",  prompt_11),
  agent_bolivia_reduccion_mamaria:     createAgentConfig("bolivia",   "reduccion mamaria",      prompt_12),

  // NUEVOS EJEMPLOS PARA PARAGUAY
  agent_paraguay_bariatrica:            createAgentConfig("paraguay",   "cirugia bariatrica",     prompt_13),
  agent_paraguay_aumento_mamario:       createAgentConfig("paraguay",   "aumento mamario",        prompt_14),
  agent_paraguay_levantamiento_mamario: createAgentConfig("paraguay",   "levantamiento mamario",  prompt_15),
  agent_paraguay_reduccion_mamaria:     createAgentConfig("paraguay",   "reduccion mamaria",      prompt_16),
};
