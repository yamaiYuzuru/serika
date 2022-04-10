let { Client, Message } = require("discord.js");
let {
  serikaSchema,
  guildSchema,
  userSchema,
  messageSchema,
  guildSettingsSchema,
} = require("../models");

/**
 *
 * @param {Client} client
 * @param {Message} msg
 */
module.exports = async (client, msg) => {
  if (msg.author.bot || !msg.guild || msg.channel.type !== "GUILD_TEXT") return;

  let clientUser = await serikaSchema.findOne({ clientId: client.user.id });
  let user;
  let guild;
  let guildSettings = await guildSettingsSchema.findOne({
    guildId: msg.guild.id,
  });

  if (!(await userSchema.findOne({ userID: msg.author.id }))) {
    let newUser = await userSchema.create({ userID: msg.author.id });
    await newUser.save();

    user = newUser;
  } else {
    user = await userSchema.findOne({ userID: msg.author.id });
  }
  if (!(await guildSchema.findOne({ guildID: msg.guild.id }))) {
    let newGuild = await guildSchema.create({ guildID: msg.guild.id });
    await newGuild.save();
    guild = newGuild;
  } else {
    guild = guildSchema.findOne({ guildID: msg.guild.id });
  }

  if (!guildSettings) {
    let newGuildSettings = await guildSettingsSchema.create({
      guildID: msg.guild.id,
    });
    await newGuildSettings.save();
    guildSettingsSchema = newGuildSettings;
  }

  if (guildSettings.logging) {
    await messageSchema
      .create({
        guildID: msg.guild.id,
        messageId: msg.id,
        content: msg.content,
      })
      .save();
  }

  let prefixes = user.prefixes;
  if (prefixes.length === 0) return;
  const prefix = prefixes.find((p) => msg.content.startsWith(p));
  if (!prefix) return;

  /*
  if (clientUser.botBanned.includes(msg.author.id))
    return msg.reply({
      content: "Sorry! You are banned from Serika.",
      allowedMentions: { repliedUser: false },
    });*/
  let args = msg.content.slice(prefix.length).trim().split(" ");
  let command = args.shift().toLocaleLowerCase();
  let cmd = client.commands.get(command) || client.aliases.get(command);

  if (!cmd)
    return msg.reply({
      content:
        "I can't find this command.\nPlease check if you have written the command right",
      allowedMentions: { repliedUser: false },
    });

  if (cmd.info.category === "nsfw" && !msg.channel.nsfw)
    return msg.reply({
      content: "This command only works in NSFW marked channels.",
      allowedMentions: { repliedUser: false },
    });
  if (
    cmd.info.category === "admin" &&
    !client.config.admins.includes(msg.author.id)
  )
    return msg.reply({
      content: "You must be a admin of Serika to use this command.",
      allowedMentions: { repliedUser: false },
    });

  /*if (
    (cmd.info.requiredVote === true &&
      !(await client.modules.dbl.hasVoted(msg.author.id)))
  )
    return msg.reply({ embeds: [client.EmbedMaker.onlyVoters()] });*/

  try {
    await cmd.run(client, msg, args);
    clientUser.usedCommands++;
    await clientUser.save();
  } catch (error) {
    console.error(error);
    await msg.reply({
      content: "Something went wrong using this command.",
      allowedMentions: { repliedUser: false },
    });
  }
};
