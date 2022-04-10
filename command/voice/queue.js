let { Client, Message, MessageEmbed } = require("discord.js");
let { music } = require("../../main");

/**
 * @param {Client} client
 * @param {Message} msg
 */
exports.run = async (client, msg) => {
  let player = music.get(msg.guild.id);

  if (!player) return msg.reply("There is no player for this guild.");

  let queue = player.queue;

  let embed = new MessageEmbed().setTitle("Queue");

  let multiple = 10;
  let page = 1;
  let end = page * multiple;
  let start = end - multiple;

  let tracks = queue.slice(start, end);
  if (queue.current)
    embed.addFiled("Current", `[${queue.current.title}](${queue.current.uri})`);

  if (!tracks.length) {
    embed.setDescription(
      `No tracks in ${page > 1 ? `page ${page}` : "the queue."}`
    );
  } else {
    embed.setDescription(
      tracks
        .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
        .join("\n")
    );
  }
  let maxPages = Math.ceil(queue.length / multiple);

  embed.setFooter({
    text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
  });

  msg.reply({ embeds: [embed] });
};
