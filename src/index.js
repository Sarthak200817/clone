const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  }
});

client.login("OTYzMzkwMTEyNDU5Mjg4NjM2.GGzO1s.GTkii_dCEEv1CKZl1PYieEPr98Qbm6HzK5OKN4");
