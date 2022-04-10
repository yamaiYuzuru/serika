let { Client, Collection } = require("discord.js");
let fs = require("fs");
let mongoose = require("mongoose");
let { API } = require("@top-gg/sdk");
require("dotenv").config();
let { Manager } = require("erela.js");
let { serikaSchema } = require("./models");

let client = new Client({
  intents: 5763,
  partials: ["MESSAGE", "REACTION", "USER"],
  allowedMentions: { repliedUser: false },
});

let command = (client.commands = new Collection());
let aliases = (client.aliases = new Collection());
let slash = (client.slash = new Collection());
let config = (client.config = require("./configs"));
client.modules = {
  version: require("./package.json").version,
  // api: new API(process.env.TOPGG_KEY)
};
let Music = new Manager({
  nodes: [
    { host: "192.168.178.25", port: 2333, password: "serika1" },
    { host: "192.168.178.25", port: 2334, password: "serika1" },
    { host: "192.168.178.25", port: 2335, password: "serika1" },
  ],
  send(id, payload) {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.on("raw", (d) => Music.updateVoiceState(d));

Music.on("nodeConnect", (node) =>
  console.log(`Node "${node.options.identifier}" connected.`)
);

Music.on("nodeError", (node, error) =>
  console.log(
    `Node "${node.options.identifier}" encountered an error: ${error.message}.`
  )
);

Music.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  channel.send(
    `Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`
  );
});

Music.on("queueEnd", (player) => {
  const channel = client.channels.cache.get(player.textChannel);
  channel.send("Queue has ended.");
  player.destroy();
});

client.on("ready", async () => {
  console.log(`[Client] Online as ${client.user.tag}`);
  client.guilds.cache.map((g) => g.members.fetch());

  let serika = await serikaSchema.findOne({ clientID: client.user.id });

  if (!serika) {
    let newSerika = await serikaSchema.create({ clientID: client.user.id });
    await newSerika.save();
  }

  Music.init(client.user.id);
});

(async () => {
  await client
    .login(process.env.TOKEN)
    .then(() => console.log(`[Client] Logged in as ${client.user.tag}`));

  let db;
  if (config.testing) {
    db = "serika_test";
  } else {
    db = "seika";
  }

  await mongoose
    .connect(process.env.MONGO_URI, {
      auth: {
        username: process.env.MONGO_USR,
        password: process.env.MONGO_PWD,
      },
      dbName: db,
    })
    .then(() =>
      console.log(`[Database] Successful connected to the Database.`)
    );
})();

fs.readdir("./events", (err, files) => {
  if (err) return console.log(err);

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;

    client.on(
      file.split(".")[0],
      require(`./events/${file}`).bind(null, client)
    );
  });
  console.log(
    `[EventHandler] It was loaded ${
      files.filter((f) => f.endsWith(".js")).length
    } events.`
  );
});

fs.readdir("./command", (err, folders) => {
  if (err) return console.log(err);

  folders.forEach((folder) => {
    fs.readdir(`./command/${folder}`, (err, files) => {
      if (err) return console.log(err);

      files.forEach((file) => {
        if (!file.endsWith(".js")) return;

        let cmd = require(`./command/${folder}/${file}`);

        if (!cmd.info) cmd.info = {};

        cmd.info.category = folder;
        cmd.info.name = file.split(".")[0];

        command.set(cmd.info.name, cmd);
        if (cmd.info.aliases)
          cmd.info.aliases.forEach((a) => aliases.set(a, cmd));
      });
      console.log(
        `[CommandHandler] It was loaded category ${folder} with ${
          files.filter((f) => f.endsWith(".js")).length
        } text commands.`
      );
    });
  });
});

exports.music = Music;
