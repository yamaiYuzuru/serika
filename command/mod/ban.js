let {
  Client,
  Message,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");

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

  if (!msg.member.permissions.has("BAN_MEMBERS"))
    return msg.reply({
      embeds: [errorEmbed.setDescription("You don't have permissions to ban")],
      allowedMentions: { repliedUser: false },
    });

  let member =
    msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

  if (!member)
    return msg.reply({
      embeds: [errorEmbed.setDescription("Can't find this member.")],
      allowedMentions: { repliedUser: false },
    });

  if (!member.bannable || msg.member.roles.highest <= member.roles.highest)
    return msg.reply({
      embeds: [errorEmbed.setDescription("I can't ban this member.")],
      allowedMentions: { repliedUser: false },
    });

  let reason = args.slice(1).join(" ") || `Banned by ${msg.author.tag}.`;

  let banButton = new MessageButton()
    .setLabel("Ban")
    .setCustomId("cmd_ban")
    .setStyle("SECONDARY");
  let exitButton = new MessageButton()
    .setLabel("Stop")
    .setStyle("SECONDARY")
    .setCustomId("cmd_exit");

  let actionRow = new MessageActionRow({ components: [banButton, exitButton] });

  msg
    .reply({
      embeds: [
        embed.setDescription(
          "Are you sure to ban %member%?".replace("%member%", member.user.tag)
        ),
      ],
      components: [actionRow],
      allowedMentions: { repliedUser: false },
    })
    .then(async (m) => {
      let filter = (interaction) => interaction.user.id === msg.author.id;

      let collect = m.createMessageComponentCollector({ filter: filter });

      collect.on("collect", async (i) => {
        if (i.customId === "cmd_ban") {
          member.ban({
            reason: reason + ` | Banned by ${msg.author.tag}`,
            days: 14,
          });
          i.update({
            embeds: [
              embed.setDescription(
                `${member.user.tag} was banned by ${msg.author.tag} for reason ${reason}`
              ),
            ],
            components: [],
          });
        }
        if (i.customId === "cmd_exit") {
          i.update({
            embeds: [embed.setDescription("Process was canceled.")],
            components: [],
          });
        }
      });
    });
};
