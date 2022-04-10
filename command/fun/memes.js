let { Client, Message, MessageEmbed } = require("discord.js");
let puppy = require("random-puppy");
/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  await puppy("memes").then((url) => {
    let embed = new MessageEmbed();
    embed.setTitle("Meeeeeems");
    embed.setURL(url);
    embed.setTimestamp(Date.now());
    embed.setImage(url);
    embed.setFooter({
      text: `Requested by ${msg.author.tag}`,
      iconURL: msg.author.avatarURL(),
    });
    msg.reply({ embeds: [embed] });
  });
};

exports.info = {
  description: "Get some memes",
};
