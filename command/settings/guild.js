let { Client, Message, MessageEmbed } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let embed = new MessageEmbed()
    .setColor("#9c63ff")
    .addField("wtk", "Set up the warnings to kick.")
    .addField("wtb", "Set up the warnings to ban.")
    .setFooter({
      text: `Requested by ${msg.author.tag}`,
      iconURL: msg.author.displayAvatarURL({ dynamic: true }),
    });

  if (!msg.member.permissions.has("ADMINISTRATOR", true))
    return msg.reply({
      content: "You don't have permission to use this command.",
    });

  switch (args[0]) {
    case "wtk":
      require("../../settings/guild/mod/wtk").execute(client, msg, args);
      break;
    case "wtb":
      require("../../settings/guild/mod/wtb").execute(client, msg, args);
      break;
    default:
      msg.reply({ embeds: [embed] });
  }
};
