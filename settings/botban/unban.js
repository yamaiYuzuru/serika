let { Client, Message } = require("discord.js");
let { shirokoSchema } = require("../../models");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.execute = async (client, msg, args) => {
  let clientUser = await shirokoSchema.findOne({ clientID: client.user.id });
  if (!clientUser) return false;
  clientUser.botBannedUsers.pull(args[1]);
  await clientUser.save();
  await msg.reply(`${args[1]} was successful unbanned from Serika`);
};
