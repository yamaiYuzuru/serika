let { Schema, model } = require("mongoose");

let GuildSchema = new Schema({
  guildID: { type: String, required: true },
  logChannel: { type: String },
  modLog: { type: String },
  warnsToKick: { type: Number },
  warnsToBan: { type: Number },
});

module.exports = model("guild", GuildSchema);
