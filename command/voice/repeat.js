let { Client, Message, MessageEmbed } = require("discord.js");
let { music } = require("../../main.js");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  if (!msg.member.voice) return;

  let player = music.get(msg.guild.id);
  if (
    !player.queue.current ||
    player.state !== "CONNECTED" ||
    msg.member.voice.channel.id !== player.voiceChannel
  )
    return msg.reply({
      content:
        "There are no songs in the queue or I'm not connected to a voice channel or you are not in the same voice channel with me",
      allowedMentions: { repliedUser: false },
    });

  switch (args[0]) {
    case "queue":
      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        await msg.reply({
          content: "Stoped queue repeat.",
          allowedMentions: { repliedUser: false },
        });
      } else {
        player.setQueueRepeat(true);
        await msg.reply({
          content: "Now repeating the queue",
          allowedMentions: { repliedUser: false },
        });
      }
      break;
    default:
      if (player.trackRepeat) {
        player.setTrackRepeat(false);
        await msg.reply({
          content: "Stoped repeating the current track.",
          allowedMentions: { repliedUser: false },
        });
      } else {
        player.setTrackRepeat(true);
        await msg.reply({
          content: "Repeatig the current track.",
          allowedMentions: { repliedUser: false },
        });
      }
      break;
  }
};
