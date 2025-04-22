exports.isValidateName = (req, res) => {
  const name = req.body.name?.trim();

  if (!name || name.toUpperCase() === '[NO_NAME]') {
    return res.status(404).json({ message: 'Nombre no válido: [NO_NAME]' });
  }

  const parts = name.split(/\s+/);

  // Al menos una palabra válida
  const isValid = parts.every(part => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{3,}$/.test(part));

  if (!isValid) {
    return res.status(404).json({ message: 'El nombre debe tener solo letras y al menos 3 caracteres por palabra.' });
  }

  return res.status(200).json({ message: 'Nombre válido', fullName: name });
};
