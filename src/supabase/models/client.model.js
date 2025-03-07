const supabase = require('../config/db');

class Client {
  constructor({
    user_id,
    user_name,
    phone_number,
    surgery = false,
    pending_consult = null,
    messages = [],
    created_at = new Date().toISOString(),
    updated_at = new Date().toISOString()
  }) {
    this.user_id = user_id || supabase.uuid(); // Generar UUID si no existe
    this.user_name = user_name;
    this.phone_number = phone_number;
    this.surgery = surgery;
    this.pending_consult = pending_consult;
    this.messages = messages;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método para crear nuevo cliente
  static async create(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_name: clientData.user_name,
        phone_number: clientData.phone_number,
        surgery: clientData.surgery || false,
        pending_consult: clientData.pending_consult,
        messages: clientData.messages || []
      }])
      .select();

    if (error) throw new Error(`Error creating client: ${error.message}`);
    return new Client(data[0]);
  }

  // Obtener cliente por número de teléfono
  static async findByPhoneNumber(phone) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (error) return null;
    return new Client(data);
  }

  // Actualizar información del cliente
  async update(updateData) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', this.user_id)
      .select();

    if (error) throw new Error(`Error updating client: ${error.message}`);
    return new Client(data[0]);
  }

  // Método especializado para agregar mensajes
  async addMessage(newMessage) {
    const updatedMessages = [...this.messages, {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`, // ID único simple
      role: newMessage.role, // 'user' o 'assistant'
      content: newMessage.content,
      created_at: new Date().toISOString(),
      agent_id: newMessage.agent_id || null
    }];

    return this.update({
      messages: updatedMessages,
      pending_consult: newMessage.role === 'user' ? newMessage.content : this.pending_consult,
      surgery: newMessage.surgery_update || this.surgery
    });
  }

  // Método para actualizar tipo de cirugía
  async updateSurgery(surgeryType) {
    return this.update({
      surgery: surgeryType,
      updated_at: new Date().toISOString()
    });
  }
}

module.exports = Client;