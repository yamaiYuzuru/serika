let {
  Client,
  Message,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
let { API } = require("nhentai");
let nhentai = new API();

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  if (!args[0]) {
    nhentai.randomDoujin().then(async (doujin) => {
      let pg = 0;
      let images = doujin.pages;
      let embed = new MessageEmbed();
      embed.setTitle(doujin.titles.english);
      embed.setImage(images[pg].url);
      embed.setFooter({
        text: `Tags: ${doujin.tags.tags.map((t) => t.name).join(", ")} | Page ${
          pg + 1
        }/${images.length}`,
      });
      embed.setURL(doujin.url);
      let nextButton = new MessageButton()
        .setCustomId("cmd_nhentai_+")
        .setStyle("PRIMARY")
        .setLabel("▶");
      let beforeButton = new MessageButton()
        .setCustomId("cmd_nhentai_-")
        .setStyle("SECONDARY")
        .setLabel("◀");
      let actionRow = new MessageActionRow({
        components: [beforeButton, nextButton],
      });
      await msg
        .reply({ embeds: [embed], components: [actionRow] })
        .then((m) => {
          let nextFilter = (interaction) =>
            interaction.customId === "cmd_nhentai_+" &&
            interaction.user.id === msg.author.id;
          let beforeFilter = (interaction) =>
            interaction.customId === "cmd_nhentai_-" &&
            interaction.user.id === msg.author.id;
          let next = m.createMessageComponentCollector({ filter: nextFilter });
          let before = m.createMessageComponentCollector({
            filter: beforeFilter,
          });
          next.on("collect", async (i) => {
            if (!images[pg + 1]) {
              pg = pg;
            } else {
              pg = pg + 1;
            }
            embed = new MessageEmbed();
            embed.setTitle(doujin.titles.english);
            embed.setImage(images[pg].url);
            embed.setFooter({
              text: `Tags: ${doujin.tags.tags
                .map((t) => t.name)
                .join(", ")} | Page ${pg + 1}/${images.length}`,
            });
            await i.update({ embeds: [embed] });
          });
          before.on("collect", async (i) => {
            if (!images[pg - 1]) {
              pg = pg;
            } else {
              pg = pg - 1;
            }
            embed = new MessageEmbed();
            embed.setTitle(doujin.titles.english);
            embed.setImage(images[pg].url);
            embed.setFooter({
              text: `Tags: ${doujin.tags.tags
                .map((t) => t.name)
                .join(", ")} | Page ${pg - 1}/${images.length}`,
            });
            embed.setURL(doujin.url);
            await i.update({ embeds: [embed] });
          });
        })
        .catch(() => msg.channel.send("Something went wrong try again"));
    });
  } else {
    nhentai
      .fetchDoujin(args[0])
      .then(async (doujin) => {
        let pg = 0;
        let images = doujin.pages;
        let embed = new MessageEmbed();
        embed.setTitle(doujin.titles.english);
        embed.setImage(images[pg].url);
        embed.setFooter({
          text: `Tags: ${doujin.tags.tags
            .map((t) => t.name)
            .join(", ")} | Page ${pg + 1}/${images.length}`,
        });
        embed.setURL(doujin.url);
        let nextButton = new MessageButton()
          .setCustomId("cmd_nhentai_+")
          .setStyle("PRIMARY")
          .setLabel("▶");
        let beforeButton = new MessageButton()
          .setCustomId("cmd_nhentai_-")
          .setStyle("SECONDARY")
          .setLabel("◀");
        let actionRow = new MessageActionRow({
          components: [beforeButton, nextButton],
        });
        await msg
          .reply({ embeds: [embed], components: [actionRow] })
          .then((m) => {
            let nextFilter = (interaction) =>
              interaction.customId === "cmd_nhentai_+" &&
              interaction.user.id === msg.author.id;
            let beforeFilter = (interaction) =>
              interaction.customId === "cmd_nhentai_-" &&
              interaction.user.id === msg.author.id;
            let next = m.createMessageComponentCollector({
              filter: nextFilter,
            });
            let before = m.createMessageComponentCollector({
              filter: beforeFilter,
            });
            next.on("collect", async (i) => {
              if (!images[pg + 1]) {
                pg = pg;
              } else {
                pg = pg + 1;
              }
              embed = new MessageEmbed();
              embed.setTitle(doujin.titles.english);
              embed.setImage(images[pg].url);
              embed.setFooter({
                text: `Tags: ${doujin.tags.tags
                  .map((t) => t.name)
                  .join(", ")} | Page ${pg + 1}/${images.length}`,
              });
              embed.setURL(doujin.url);
              await i.update({ embeds: [embed] });
            });
            before.on("collect", async (i) => {
              if (!images[pg - 1]) {
                pg = pg;
              } else {
                pg = pg - 1;
              }
              embed = new MessageEmbed();
              embed.setTitle(doujin.titles.english);
              embed.setImage(images[pg].url);
              embed.setFooter({
                text: `Tags: ${doujin.tags.tags
                  .map((t) => t.name)
                  .join(", ")} | Page ${pg - 1}/${images.length}`,
              });
              embed.setURL(doujin.url);
              await i.update({ embeds: [embed] });
            });
          });
      })
      .catch(() => msg.channel.send("Something went wrong."));
  }
};

exports.info = {
  description: "Read an doujin",
  usage: "s!nhentai [doujinID]",
  aliases: ["nh"],
};
