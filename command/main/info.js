let { convertMS } = require("discordutility");
let { serikaSchema } = require("../../models");
let { Client, Message, MessageEmbed, version } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} msg
 */
exports.run = async (client, msg) => {
  let embed = new MessageEmbed();
  let clientUser = await serikaSchema.findOne({ clientID: client.user.id });
  embed.setTitle("Information about Serika");
  embed.addField("Name", client.user.username, true);
  embed.addField("Bot Version", String(client.modules.version), true);
  embed.addField("Library", `discord.js@${version}`, true);
  embed.addField("Guild count", `${client.guilds.cache.size}`, true);
  embed.addField("User count", `${client.users.cache.size}.`, true);
  embed.addField("Command count", `${client.commands.size}`, true);
  embed.addField("Aliases", `${client.aliases.size}`, true);
  embed.addField("Used commands", String(clientUser.usedCommands), true);
  embed.addField("Ping", "fetching...", true);
  embed.addField("Uptime", "fetching...", true);

  await msg.reply({ embeds: [embed] }).then(async (m) => {
    const latency = m.createdTimestamp - msg.createdTimestamp;
    let converted = convertMS(client.uptime);

    embed = new MessageEmbed();
    embed.setTitle("Information about Serika");
    embed.addField("Name", client.user.username, true);
    embed.addField("Bot Version", String(client.modules.version), true);
    embed.addField("Library", `discord.js@${version}`, true);
    embed.addField("Guild count", `${client.guilds.cache.size}`, true);
    embed.addField("User count", `${client.users.cache.size}.`, true);
    embed.addField("Command count", `${client.commands.size}`, true);
    embed.addField("Aliases", `${client.aliases.size}`, true);
    embed.addField("Used commands", String(clientUser.usedCommands), true);
    embed.addField(
      "Ping",
      `API: ${Math.floor(client.ws.ping)}ms / Bot: ${Math.round(latency)}`,
      true
    );
    embed.addField(
      "Uptime",
      `${converted.d} Days/${converted.h} Hours/${converted.m} Minutes`,
      true
    );
    m.edit({ embeds: [embed] });
  });
};

exports.info = {
  description: "Get some information about Serika",
};
