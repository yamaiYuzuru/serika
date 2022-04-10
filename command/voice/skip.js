let { Client, Message } = require("discord.js");
let { music } = require("../../main");

/**
 * @param {Client} client
 * @param {Message} msg
 */
exports.run = async (client, msg) => {
  let player = music.get(msg.guild.id);

  if (!player)
    return msg.reply(
      "There is no player for this guild, start playing some musics."
    );

  if (
    !msg.member.voice.channel ||
    msg.member.voice.channel.id !== player.voiceChannel
  )
    return msg.reply(
      "You are not connected to a voice channel or we are not in the same voice channel."
    );

  let { title } = player.queue.current;

  player.stop();
  msg.reply(`${title} was skipped.`);
};
