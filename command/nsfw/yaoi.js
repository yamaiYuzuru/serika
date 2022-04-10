let { Client, Message, MessageEmbed } = require("discord.js");
let booru = require("booru");
/**
 * @param {Client} client
 * @param {Message} msg
 */
exports.run = async (client, msg) => {
  let embed = new MessageEmbed()
    .setTitle("Hentai - Yaoi")
    .setFooter({ text: `Requested by ${msg.author.tag}` });

  booru
    .search("danbooru", ["rating:explict", "yaoi"], { random: true, limit: 1 })
    .then((result) => {
      for (let post of result.posts) {
        embed.setURL(post.postView);
        embed.setImage(post.fileUrl);
      }
      msg.reply({ embeds: [embed] });
    });
};
