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

  player.destroy();
  msg.reply(
    "Thank you for listening music with Serika. :D\n See ya next time. c:"
  );
};
