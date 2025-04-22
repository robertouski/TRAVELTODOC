exports.isValidateName = (req, res) => {
  const name = req.body.name?.trim();

  if (!name || name.toUpperCase() === '[NO_NAME]') {
    return res.status(404).json({ message: 'Nombre no válido: [NO_NAME]' });
  }

  const parts = name.split(/\s+/);

  // Al menos UNA palabra debe tener 3 letras o más
  const hasValidMainName = parts.some(part => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{3,}$/.test(part));

  // Todas las partes deben ser letras y no tener símbolos o números
  const allWordsAreLetters = parts.every(part => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/.test(part));

  if (!hasValidMainName || !allWordsAreLetters) {
    return res.status(404).json({ message: 'El nombre debe tener al menos una palabra principal válida (mínimo 3 letras), sin símbolos o números.' });
  }

  return res.status(200).json({ message: 'Nombre válido', fullName: name });
};
