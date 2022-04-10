let { Schema, model } = require("mongoose");

let SerikaSchema = new Schema({
  clientID: { type: String, required: true },
  botbanned: { type: [String], default: [] },
  usedCommands: { type: Number, default: 0 },
});

module.exports = model("serika", SerikaSchema, "serika");
