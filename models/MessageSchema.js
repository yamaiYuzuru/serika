let { Schema, model } = require("mongoose");

let MessageSchema = new Schema({
  guildID: { type: String, required: true },
  messageId: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = model("message", MessageSchema);
