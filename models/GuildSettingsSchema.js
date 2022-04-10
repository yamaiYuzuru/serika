let { Schema, model } = require("mongoose");

let GuildSettingsSchema = new Schema({
  guildID: { type: String, required: true },
  logging: { type: Boolean, default: false },
  wtk: { type: Boolean, default: false },
  wtb: { type: Boolean, default: false },
});

module.exports = model("guildsettings", GuildSettingsSchema);
