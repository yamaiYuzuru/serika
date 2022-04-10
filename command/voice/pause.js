let { Client, Message } = require("discord.js");
let { music } = require("../../main.js");

/**
 * @param {Client} client
 * @param {Message} msg
 */
exports.run = async (client, msg) => {
  if (!msg.member.voice) return;

  let player = music.get(msg.guild.id);
  if (
    !player.queue.current ||
    player.state !== "CONNECTED" ||
    msg.member.voice.channel !== player.voiceChannel
  )
    return msg.reply({
      content:
        "There are no songs in the queue or I'm not connected to a voice channel or you are not in the same voice channel with me",
      allowedMentions: { repliedUser: false },
    });

  if (player.paused) {
    player.pause(false);
    await msg.reply({
      content: `Continue song ${player.queue[0].title}`,
      allowedMentions: { repliedUser: false },
    });
  } else {
    player.pause(true);
    await msg.reply({
      content: "Paused player.",
      allowedMentions: { repliedUser: false },
    });
  }
};

exports.info = {
  description: "Paused the current player.",
};
