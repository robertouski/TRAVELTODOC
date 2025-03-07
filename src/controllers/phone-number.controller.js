const  PhoneNumberService  = require('../services/phone-number.service');

const getPhoneNumberCountry = async (req, res) => {
  try {
    console.log(req.body);
    const { phoneNumber } = req.body;
    
    if (!phoneNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Número de teléfono requerido en formato internacional (+593...)'
      });
    }

    const country = PhoneNumberService.getCountryFromPhoneNumber(phoneNumber);
    
    if (!country) {
      return res.status(422).json({ 
        success: false,
        message: 'Formato de número inválido o país no soportado'
      });
    }

    res.json({
      success: true,
      data: { phoneNumber, country }
    });
    
  } catch (error) {
    console.error('Error en controlador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al procesar el número'
    });
  }
};

module.exports = getPhoneNumberCountry