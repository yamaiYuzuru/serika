let { Client, Guild } = require("discord.js");
let { guildSchema, guildSettingsSchema } = require("../models");

/**
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
  await guildSchema.create({ guildID: guild.id }).save();
  await guildSettingsSchema.create({ guildID: guild.id }).save();
};
