module.exports = function(text) {
  const str = typeof text === "string" ? text : String(text || "");
  const regexMail = /[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/;
  const coincidence = str.match(regexMail);
  return coincidence ? coincidence[0] : "";
}