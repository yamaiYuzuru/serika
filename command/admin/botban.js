let { Client, Message, MessageEmbed } = require("discord.js");
let { serikaSchema } = require("../../models");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let clientUser = await serikaSchema.findOne({ clientID: client.user.id });
  let embed = new MessageEmbed();
  embed.setDescription(
    `${clientUser.botBannedUsers.join(", ") || "No one was banned"}`
  );
  embed.setTitle("Bot Ban");
  switch (args[0]) {
    case "ban":
      require("../../settings/botban/ban").execute(client, msg, args);
      break;
    case "unban":
      require("../../settings/botban/unban").execute(client, msg, args);
      break;
    default:
      await msg.reply({ embeds: [embed] });
      break;
  }
};

exports.info = {
  description: "Ban or unban an user from Serika",
};
