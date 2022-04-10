let { Client, Message, MessageEmbed } = require("discord.js");
let booru = require("booru");
/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let embed = new MessageEmbed()
    .setTitle("Hentai")
    .setFooter({ text: `Requested by ${msg.author.tag}` });

  booru
    .search("danbooru", [`${args.join("_")}`, "rating:explict"], {
      random: true,
      limit: 1,
    })
    .then((result) => {
      for (let post of result.posts) {
        embed.setURL(post.postView);
        embed.setImage(post.fileUrl);
      }
      msg.reply({ embeds: [embed] });
    });
};
