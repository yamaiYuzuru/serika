let { Client, Message, MessageEmbed } = require("discord.js");
let { userSchema } = require("../../models");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let user = await userSchema.findOne({ userID: msg.author.id });
  let embed = new MessageEmbed();
  embed.setTitle("Your prefixes");
  embed.setDescription(user.prefixes.join("\n"));
  embed.setFooter({ text: `${msg.author.tag}` });
  switch (args[0]) {
    case "add":
      require("../../settings/prefix/add").execute(client, msg, args);
      break;
    case "remove":
      require("../../settings/prefix/remove").execute(client, msg, args);
      break;
    default:
      await msg.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      break;
  }
};

exports.info = {
  description: "Add a prefix / Remove a prefix / shows your prefixes",
  usage: "s!prefix [add/remove] [prefix]",
};
