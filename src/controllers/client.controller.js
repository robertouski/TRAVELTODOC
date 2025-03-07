const Client = require('../../src/supabase/models/client.model');
const PhoneNumberService = require('../services/phone-number.service');

class ClientController {
  // Crear nuevo cliente
  static async createClient(req, res) {
    try {
      const { user_name, phone_number, surgery } = req.body;

      // Validación de campos requeridos
      if (!user_name || !phone_number) {
        return res.status(400).json({
          success: false,
          error: "Nombre de usuario y número telefónico son requeridos"
        });
      }

      // Validación de formato de teléfono
      const country = PhoneNumberService.getCountryFromPhoneNumber(phone_number);
      if (!country) {
        return res.status(400).json({
          success: false,
          error: "Formato de teléfono inválido"
        });
      }

      // Verificar si el cliente ya existe
      const existingClient = await Client.findByPhoneNumber(phone_number);
      if (existingClient) {
        return res.status(409).json({
          success: false,
          error: "El cliente ya está registrado"
        });
      }

      // Crear nuevo cliente
      const newClient = await Client.create({
        user_name,
        phone_number,
        surgery: surgery || false
      });

      res.status(201).json({
        success: true,
        data: newClient
      });

    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Obtener cliente por teléfono
  static async getClient(req, res) {
    try {
      const { phone } = req.params;
      
      const client = await Client.findByPhoneNumber(phone);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Cliente no encontrado"
        });
      }

      res.json({
        success: true,
        data: client
      });
      
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Agregar mensaje a la conversación
  static async addMessage(req, res) {
    try {
      const { phone } = req.params;
      const { role, content, agent_id } = req.body;
      
      // Validar rol del mensaje
      if (!['user', 'assistant'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Rol inválido (debe ser 'user' o 'assistant')"
        });
      }

      const client = await Client.findByPhoneNumber(phone);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Cliente no encontrado"
        });
      }

      // Crear nuevo mensaje
      const newMessage = {
        id: `msg_${Math.random().toString(36).slice(2, 11)}`, // ID único
        role,
        content,
        agent_id: agent_id || null,
        created_at: new Date().toISOString()
      };

      // Actualizar cliente
      const updatedClient = await client.update({
        messages: [...client.messages, newMessage],
        pending_consult: role === 'user' ? content : client.pending_consult
      });

      res.json({
        success: true,
        data: updatedClient
      });
      
    } catch (error) {
      console.error('Error al agregar mensaje:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Actualizar tipo de cirugía
  static async updateSurgery(req, res) {
    try {
      const { phone } = req.params;
      const { surgery } = req.body;
      
      const client = await Client.findByPhoneNumber(phone);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Cliente no encontrado"
        });
      }

      const updatedClient = await client.update({
        surgery,
        updated_at: new Date().toISOString()
      });
      
      res.json({
        success: true,
        data: updatedClient
      });
      
    } catch (error) {
      console.error('Error al actualizar cirugía:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Transferir a nuevo agente
  static async transferAgent(req, res) {
    try {
      const { phone } = req.params;
      const { new_agent_id, previous_agent_id } = req.body;
      
      const client = await Client.findByPhoneNumber(phone);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Cliente no encontrado"
        });
      }

      // Filtrar mensajes del agente anterior
      const contextMessages = client.messages
        .filter(msg => msg.agent_id === previous_agent_id)
        .slice(-3);

      // Crear mensaje de sistema con contexto
      const transferMessage = {
        id: `sys_${Math.random().toString(36).slice(2, 11)}`,
        role: 'system',
        content: `Contexto transferido del agente ${previous_agent_id}: ${JSON.stringify(contextMessages)}`,
        agent_id: new_agent_id,
        created_at: new Date().toISOString()
      };

      // Actualizar cliente
      const updatedClient = await client.update({
        agent_id: new_agent_id,
        messages: [...client.messages, transferMessage]
      });

      res.json({
        success: true,
        data: {
          new_agent: new_agent_id,
          transferred_context: contextMessages,
          client: updatedClient
        }
      });
      
    } catch (error) {
      console.error('Error en transferencia de agente:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

// Exportación para CommonJS
module.exports = ClientController;