let { Client, Message } = require("discord.js");
let { music } = require("../../main");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let player = music.get(msg.guild.id);

  if (!player)
    return msg.reply(
      "There is no player for this guild, start playing some musics."
    );
  if (!args[0]) return msg.reply(`The player volume is ${player.volume}%.`);

  if (
    !msg.member.voice.channel ||
    msg.activity.voice.channel.id !== player.voiceChannel
  )
    return msg.reply(
      "You are not in a voice channel or we are not in the same voice channel connected."
    );

  let volume = Number(args[0]);

  if (!volume || volume < 1 || volume > 100)
    return msg.reply("You must give me a volume between 1 and 100.");

  player.setVolume(volume);
  msg.reply(`The player volume is now on ${volume}%.`);
};
