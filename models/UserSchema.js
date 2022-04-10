let { Schema, model } = require("mongoose");

let UserSchema = Schema({
  userID: { type: String, required: true },
  prefixes: { type: [String], default: ["s!"] },
  joinedDate: { type: Date, default: Date.now() },
});

module.exports = model("user", UserSchema);
