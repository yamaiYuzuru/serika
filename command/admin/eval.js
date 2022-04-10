let { Client, Message, MessageEmbed } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let embed = new MessageEmbed();
  try {
    let evaluted = eval(args.join(" "));
    embed.addField("Input", `\`\`\`js\n${args.join(" ")}\`\`\``);
    embed.addField("Output", `\`\`\`js\n${evaluted}\`\`\``);
    msg.reply({ embeds: [embed] });
  } catch (error) {
    embed.addField("Input", `\`\`\`js\n${args.join(" ")}\`\`\``);
    embed.addField("Output", `\`\`\`js\n${error}\`\`\``);
    msg.reply({ embeds: [embed] });
  }
};
