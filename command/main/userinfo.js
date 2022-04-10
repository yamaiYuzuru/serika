let { Client, Message, MessageEmbed } = require("discord.js");
let { time } = require("@discordjs/builders");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let member =
    msg.mentions.members.first() ||
    msg.guild.members.cache.get(args[0]) ||
    msg.member;

  let type;
  if (member.user.bot) {
    type = "Bot";
  } else {
    type = "User";
  }

  let embed = new MessageEmbed();
  embed.setTitle("Userinfo");
  embed.setDescription(
    `• **Type**: ${type}\n• **Name**: ${
      member.user.username
    }\n• **Nickname**: ${member.nickname || "-"}\n• **Discriminator**: ${
      member.user.discriminator
    }\n• **User ID**: ${
      member.id
    }\n• **Avatar**: [Click me](${member.user.avatarURL({
      dynamic: true,
    })})\n• **Guild joined**: ${time(
      member.joinedAt
    )}\n• **Created at**: ${time(member.user.createdAt)}`
  );
  embed.setColor("#f5cad4");
  await msg.reply({ embeds: [embed] });
};
