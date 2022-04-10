let { Client, Message } = require("discord.js");
let owo = require("@zuzak/owo");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {String[]} args
 */
exports.run = async (client, msg, args) => {
  let channel = client.channels.cache.get(msg.channel.id);
  if (!args[0]) {
    msg.channel.messages
      .fetch({ limit: 2 }, { cache: true, force: true })
      .then((messages) => {
        let message = messages.last();
        channel.send(owo(message.cleanContent));
      });
  } else {
    channel.send(owo(args.join(" ")));
  }
};

exports.info = {
  description: "OwOfy some texts",
};
