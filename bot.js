const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./bot.js');
const client = new Discord.Client();
const config = require("./config.json");
const commands = require("./commands.js");
var figlet = require('figlet');
const fs = require("fs");

client.on("ready", () => {
  console.log(` On ${client.guilds.size} servers, with ${client.users.size} users.`)
  client.user.setPresence({game:{name:`out for ${client.users.size} members`, type: "WATCHING"}});
  setTimeout(() => {client.user.setPresence({game:{name:`out for ${client.guilds.size} servers`, type: "WATCHING"}});}, 60000);
  setInterval(() => {
    client.user.setPresence({game:{name:`out for ${client.users.size} members`, type: "WATCHING"}});
    setTimeout(() => {client.user.setPresence({game:{name:`out for ${client.guilds.size} servers`, type: "WATCHING"}});}, 60000);
  }, 120000);
});

client.on("message", message => {
  if(message.content == "<@"+client.user.id+">") {
    var args = message.content.split(" ").slice(0);
    var command = "help";
    commands.commands.help.execute(message, args, client);
    return;
  }
  if(!message.author.bot)
    commands.runCommand(message, client);
});

client.login(process.env.TOKEN);