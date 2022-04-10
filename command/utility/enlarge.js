let { Client, Message, MessageEmbed, Util } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  if (!args[0]) return msg.reply("You must give me an emoji");
  let emoji = Util.parseEmoji(args[0]);
  let embed = new MessageEmbed();
  embed.setTitle("Enlarge emoji " + emoji.name);
  embed.setImage(
    `https://cdn.discordapp.com/emojis/${emoji.id}.${
      emoji.animated ? "gif" : "png"
    }`
  );
  await msg.reply({ embeds: [embed] });
};

exports.info = {
  description: "Enlarge an emoji",
  usage: "s!enlarge <emoji>",
  requiredVote: true,
};
