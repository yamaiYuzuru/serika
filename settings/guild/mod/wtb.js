let { Client, Message } = require("discord.js");
let { guildSettingsSchema, guildSchema } = require("../../../models");

/**
 *
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.execute = async (client, msg, args) => {
  if (!args[1])
    return msg.reply(
      "You must give me an amount of warns to automatic ban the member.\n0 warns disable this function."
    );

  let guildSettings = await guildSettingsSchema.findOne({
    guildID: msg.guild.id,
  });
  let guild = await guildSchema.findOne({ guildID: msg.guild.id });

  if (args[1] === 0 && !guildSettings.wtb)
    return msg.reply("Warn to ban is already disabled.");

  if (args[1] === 0) {
    guildSettings.wtb = false;
    await guildSettings.save();
    guild.warnsToBan = 0;
    await guild.save();
    return msg.reply("Guild settings updated.");
  }

  if (!isNaN(args[1]))
    return msg.reply("The amount of warns must be a number.");

  guildSettings = true;
  guild.warnsToBan = args[1];
  await guild.save();
  await guildSettings.save();
  msg.reply("Guild settings updated.");
};
