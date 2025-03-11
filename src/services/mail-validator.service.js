module.exports = function(text) {
  const regexMail = /[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/;
  const coincidence = text.match(regexMail);
  return coincidence ? coincidence[0] : "";
}