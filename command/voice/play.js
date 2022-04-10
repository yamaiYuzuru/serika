let {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
let { music } = require("../../main.js");

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

  if (!msg.member.voice || !args[0])
    return msg.reply({
      embeds: [
        errorEmbed.setDescription(
          "You must join in to a Voice or give me an search input or a url."
        ),
      ],
      allowedMentions: { repliedUser: false },
    });

  let player = music.create({
    guild: msg.guild.id,
    voiceChannel: msg.member.voice.channel.id,
    textChannel: msg.channel.id,
  });

  if (player.state !== "CONNECTED") player.connect();

  let res;

  try {
    res = await player.search(args.join(" "), msg.author);
    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.length) player.disconnect();
      throw res.exception;
    }
  } catch (error) {
    await msg.reply({
      embeds: [
        errorEmbed.setDescription(
          `Something went wrong while searching: ${error.message}`
        ),
      ],
      allowedMentions: { repliedUser: false },
    });
  }

  switch (res.loadType) {
    case "NO_MATCHES":
      if (!player.queue.current) player.destroy();
      return msg.reply({
        embeds: [errorEmbed.setDescription("There were no results found.")],
        allowedMentions: { repliedUser: false },
      });
    case "TRACK_LOADED":
      player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      return msg.reply({
        embeds: [embed.setDescription(`Enqueuing \`${res.tracks[0].title}\`.`)],
      });
    case "PLAYLIST_LOADED":
      player.queue.add(res.tracks);

      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      )
        player.play();
      return msg.reply({
        embeds: [
          embed.setDescription(
            `Enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`
          ),
        ],
        allowedMentions: { repliedUser: false },
      });
    case "SEARCH_RESULT":
      let max = 5,
        collected,
        filter = (m) =>
          m.author.id === msg.author.id && /^(\d+|end)$/i.test(m.content);
      if (res.tracks.length < max) max = res.tracks.length;

      const results = res.tracks
        .slice(0, max)
        .map((track, index) => `${++index} - \`${track.title}\``)
        .join("\n");

      msg.channel.send({
        embeds: [
          embed.setDescription(
            results + "\n\nPlease select one of them above."
          ),
        ],
      });

      try {
        collected = await msg.channel.awaitMessages({
          filter: filter,
          max: 1,
          time: 30e3,
          errors: ["time"],
        });
      } catch (e) {
        if (!player.queue.current) player.destroy();
        return msg.reply({
          embeds: [
            errorEmbed.setDescription("You didn't provide a selection."),
          ],
          allowedMentions: { repliedUser: false },
        });
      }

      const first = collected.first().content;

      if (first.toLowerCase() === "end") {
        if (!player.queue.current) player.destroy();
        return msg.channel.send("Cancelled selection.");
      }

      const index = Number(first) - 1;
      if (index < 0 || index > max - 1)
        return msg.reply({
          embeds: [
            errorEmbed.setDescription(
              `The number you provided too small or too big (1-${max}).`
            ),
          ],
          allowedMentions: { repliedUser: false },
        });

      const track = res.tracks[index];
      player.queue.add(track);

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      return msg.reply({
        embeds: [embed.setDescription(`Enqueuing \`${track.title}\`.`)],
        allowedMentions: { repliedUser: false },
      });
  }
};
exports.info = {
  description: "Play a song or add songs to the queue",
  usage: "s!play <search input/url>",
};
