let { Client, Message, MessageEmbed } = require("discord.js");
let snek = require("snekfetch");
/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  const data = snek
    .get("https://api.adviceslip.com/advice")
    .end((res) => res.json());

  const embed = new MessageEmbed();
  embed.setDescription(data.slip.advice);
  embed.setColor("RANDOM");
  await msg.reply({ embeds: [embed] });
};

exports.info = {
  description: "Get an advice",
};
