let {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
let {
  guildSchema,
  guildSettingsSchema,
  moderationSchema,
} = require("../../models");
let { generate } = require("shortid");

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

  let guild = await guildSchema.findOne({ guildID: msg.guild.id });
  let guildSettings = await guildSettingsSchema.findOne({
    guildID: msg.guild.id,
  });

  let member =
    msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();
  if (!member)
    return msg.reply({
      embeds: [errorEmbed.setDescription("I can't find this member.")],
      allowedMentions: { repliedUser: false },
    });

  let warnButton = new MessageButton()
    .setLabel("Warn")
    .setStyle("PRIMARY")
    .setCustomId("cmd_warn");
  let exitButton = new MessageButton()
    .setLabel("Exit")
    .setStyle("SECONDARY")
    .setCustomId("cmd_exit");

  let actionRow = new MessageActionRow({
    components: [warnButton, exitButton],
  });

  let reason = args.slice(1).join(" ") || "Not given";

  await msg
    .reply({
      embeds: [
        embed.setDescription(`Are you sure to warn ${member.user.tag}?`),
      ],
      components: [actionRow],
    })
    .then(async (m) => {
      let filter = (interaction) => interaction.user.id === msg.author.id;

      let collector = m.createMessageComponentCollector({
        filter: filter,
        componentType: "BUTTON",
        time: 5e3,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "cmd_warn") {
          let docs = await moderationSchema.find({
            userID: member.user.id,
            guildID: msg.guild.id,
          });
          if (guildSettings.wtk && docs.lenght === guild.warnsToKick) {
            member.kick("Auto Mod - Kick, too many warnings.");
          }
          if (guildSettings.wtb && docs.lenght === guild.warnsToBan) {
            member.ban({
              reason: "Auto Mod - Ban, too many warnings.",
              days: 14,
            });
          }

          let doc = await moderationSchema.create({
            userID: member.user.id,
            guildID: msg.guild.id,
            moderator: msg.author.id,
            id: generate(),
            reason: reason,
          });
          await doc.save();

          i.update({
            embeds: [
              embed.setDescription(
                `${member.user.tag} has been warned by ${msg.author.tag}.\n\nReason:\n\`\`\`${reason}\`\`\``
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

exports.info = {
  description: "Warn a member.",
  usage: "s!warn <userID/@user> [reason]",
};
