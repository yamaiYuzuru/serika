let { Client, Message } = require("discord.js");
let { userSchema } = requrie("../../models");
/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.execute = (client, msg, args) => {
  let user = await userSchema.findOne({ userID: msg.author.id });
  if (!args[1]) return msg.reply("You must enter a prefix");
  user.prefixes.pull(args[1]);
  await user.save();
  await msg.reply(`${args[1]} was successful removed`);
}
