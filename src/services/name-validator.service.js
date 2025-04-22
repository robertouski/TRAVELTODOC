exports.isValidateName = (req, res) => {
  const name = req.body.name?.trim();

  if (!name || name.toUpperCase() === '[NO_NAME]') {
    return res.status(404).json({ message: 'Nombre no válido: [NO_NAME]' });
  }

  const parts = name.split(/\s+/);

  if (parts.length < 2) {
    return res.status(404).json({ message: 'Se requiere al menos nombre y apellido.' });
  }

  const isValid = parts.every(part => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{3,}$/.test(part));

  if (!isValid) {
    return res.status(404).json({ message: 'Cada parte del nombre debe tener al menos 3 letras y no contener símbolos o números.' });
  }

  return res.status(200).json({ message: 'Nombre válido', fullName: name });
};
