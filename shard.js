let { ShardingManager } = require("discord.js");
require("dotenv").config();

let shard = new ShardingManager("./main.js", {
  mode: "process",
  token: process.env.TOKEN,
  totalShards: "auto",
  respawn: true,
  shardList: "auto",
});

(async () => {
  await shard
    .spawn({ amount: "auto" })
    .then(() => console.log("[Shard] SharingManager was successful started"));
})();
