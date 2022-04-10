let { Client, Message, MessageEmbed } = require("discord.js");
let { moderationSchema } = require("../../models");
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

  let errorEmbed = new MessageEmbed()
    .setTitle("Error")
    .setColor("RED")
    .setFooter({
      text: `Requested by ${msg.author.tag}`,
      iconURL: msg.author.displayAvatarURL({ dynamic: true }),
    });
  let embed = new MessageEmbed().setColor("#9c63ff").setFooter({
    text: `Requested by ${msg.author.tag}`,
    iconURL: msg.author.displayAvatarURL({ dynamic: true }),
  });

  if (!msg.member.permissions.has("KICK_MEMBERS"))
    return msg.reply({
      embeds: [
        errorEmbed.setDescription(
          "You don't have permission to use this command."
        ),
      ],
      allowedMentions: { repliedUser: false },
    });

  let doc = await moderationSchema.find({
    userID: member.user.id,
    guildID: msg.guild.id,
  });

  if (doc.length < 0)
    return msg.reply({
      embeds: [
        errorEmbed.setDescription("This member doesn't have any warnings."),
      ],
      allowedMentions: { repliedUser: false },
    });

  embed.setTitle(`Warnings of ${member.user.tag}`);
  doc.forEach((res) => {
    let mod = msg.guild.members.cache.get(res.moderator);
    let date = new Date(res.date);

    embed.addField(
      `Warn ID: ${res.id}`,
      `**Moderator:** ${mod}\n**Grund:** ${
        res.reason
      }\n**Datum:** ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
    );
  });
  msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
