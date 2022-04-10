let { Client, Message, MessageEmbed } = require("discord.js");
let { moderationSchema } = require("../../models");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
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
  if (!args[0])
    return msg.reply({
      embeds: [errorEmbed.setDescription("You must give me a warning id.")],
    });

  let doc = await moderationSchema.findOne({ id: args[0] });

  if (!doc)
    return msg.reply({
      embeds: [errorEmbed.setDescription("Can't find a warn with this ID.")],
      allowedmentions: { repliedUser: false },
    });

  let member =
    msg.guild.members.cache.get(doc.userID).user.tag || "Unknown User#0000";

  await moderationSchema.deleteOne({ id: args[0] });

  await msg.reply({
    embeds: [
      embed.setDescription(`The warn ${args[0]} of ${member} was remove.`),
    ],
    allowedMentions: { repliedUser: false },
  });
};

exports.info = {
  description: "Remove a warn of an user.",
  usage: "s!warnremove [warning ID]",
};
