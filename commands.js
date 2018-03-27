const config = require("./config.json");
const figlet = require('figlet');
var fs = require("fs");
var db = require("./db.json");
module.exports.db = db;
var Discord = require("discord.js");
var swears = ["fuck","shit","cunt","ass","arse","nigga","nigger","twat","bastard","bitch","penis","willy","dick","vagina","pussy","clit","sex","orgasm","anal","oral","aural","piss","fanny","wank","faggot","boob","kike","coon","minge"]

setInterval(() => {
  fs.readFile('db.json', function (err, data) {
    if (err) throw err;
    db = JSON.parse(data);
  });
}, 5000);

module.exports.runCommand = function(message, client) {
  if(db[message.guild.id] != undefined && db[message.guild.id].swearing == "block")
    checkSwears(message);
  var args = message.content.substring(config.prefix.length).split(" ").slice(0);
  var command = args[0];
  args = args.join(" ").substring(command.length + 1).split(" ");
  executeCommand(command, message, args, client)
}

function executeCommand(command, message, args, client) {
  if(commands[command] != undefined)
    commands[command].execute(message, args, client);
}

module.exports.setDb = function(data, value) {
  db[value] = data;
  fs.writeFile("db.json", JSON.stringify(db), function() {console.log("saved")});
}

var commands = 
{
  "help": {
    "description": "Lists commands and descriptions",
    "execute": function(message, args) {
      var cmds = Object.keys(commands).map(function(k) { return commands[k] })
      var cmdsFormat = "";
      for(var i = 0; i < cmds.length; i++)
        cmdsFormat = cmdsFormat+"**p#"+Object.keys(commands)[i] + "** - "+cmds[i].description + "\n";
      message.channel.send({embed: {title: "__Help__", description: cmdsFormat, color:6788150}});
    }
  },
  "settings": {
    "description": "Change PadLok's settings for the current server",
    "execute": function(message, args) {
      var settings = ["swearing", "automod"];
      if(settings.indexOf(args[0].toLowerCase()) == 0) {
        if(args[1] == undefined)
          return message.channel.send("That isn't a valid option");
        if(args[1].toLowerCase() == "allow" || args[1].toLowerCase() == "block") {
          message.channel.send("Swearing is now "+args[1].toLowerCase()+"ed");
          if(db[message.guild.id] == undefined)
            db[message.guild.id] = {};
          db[message.guild.id].swearing = args[1].toLowerCase();
          return fs.writeFile("db.json", JSON.stringify(db), function() {console.log("saved")});
        }
        else
          return message.channel.send("That isn't a valid option");
      }
      if(settings.indexOf(args[0].toLowerCase()) == 1) {
        if(args[1] == undefined)
          return message.channel.send("That isn't a valid option");
        if(args[1].toLowerCase() == "on" || args[1].toLowerCase() == "off") {
          message.channel.send("AutoMod is now "+args[1].toLowerCase());
          if(db[message.guild.id] == undefined)
            db[message.guild.id] = {};
          db[message.guild.id].automod = args[1].toLowerCase();
          return fs.writeFile("db.json", JSON.stringify(db), function() {console.log("saved")});
        }
        else
          return message.channel.send("That isn't a valid option");
      }
      message.channel.send("That isn't a valid setting");
    }
  },
  "announce": {
    "execute": function(message, args) {
      message.guild.channels.map(function(chan) {
        if(chan.type == "text")
          chan.send("@everyone "+args.join(" "));
      });
    },
    "description": "Send an announcement to the whole server"
  }
}

module.exports.commands = commands;

function checkSwears(message) {
  for (var i = 0; i < swears.length; i++) { 
     if (message.content.toLowerCase().includes(swears[i])) {
       message.channel.send("Swearing has been blocked on this server. If you think this is an error please contact a server administrator.");
       return setTimeout(() => {message.delete()}, 100);
     }
  }
}