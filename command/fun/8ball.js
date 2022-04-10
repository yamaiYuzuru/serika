let { Client, Message, MessageEmbed } = require("discord.js");

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
  if (!args[0])
    return msg.reply({
      embeds: [errorEmbed.setDescription("You give me a question.")],
      allowedMentions: { repliedUser: false },
    });

  let answers = ["Yes.", "No.", "Probably not.", "Probably yes.", "Maybe."];
  msg.reply({
    embeds: [
      embed
        .addField("Question", args.join(" "))
        .addField(
          "Answer",
          answers[Math.floor(Math.random() * answers.length)]
        ),
    ],
    allowedMentions: { repliedUser: false },
  });
};
