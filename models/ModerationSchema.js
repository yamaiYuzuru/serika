let { Schema, model } = require("mongoose");

let ModerationSchema = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  id: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Number, default: Date.now() },
  moderator: { type: String, required: true },
});

module.exports = model("mod", ModerationSchema);
