const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./bot.js');
const client = new Discord.Client();
const config = require("./config.json");
client.login(process.env.TOKEN);
var figlet = require('figlet');
var fs = require('fs');
var commands = require("./commands");
var settings = require("./db.json");

client.on("ready", () => {
  var usersize = client.users.size;
  var guildsize = client.guilds.size;
  var guilds = client.guilds.size;
  var users = client.users.size;
  figlet('PadLok', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data.substring(0, data.length - 36)+" v0.0.1"+`\n Running on ${client.guilds.size} servers with ${getShards(client.guilds.size)} ${getShardsuffix()}\n`)
  })
  Manager.spawn(getShards(client.guilds.size)); // This will spawn n shards (n*2,500 guilds);
  client.destroy();
});

const http = require('http');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const btoa = require('btoa');

app.use(express.static('public'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get("/", (request, response) => response.sendFile(__dirname+"/views/index.html"));
app.get("/dashboard", (request, response) => response.sendFile(__dirname+"/views/dashboard.html"));

app.get("/onServer", (req, res) => {
  if(client.guilds.get(req.query.guild) != undefined)
    res.send("true");
  else
    res.send("false");
})

app.post("/changesettings", (req, res) => {
  console.log(req.body);
  var token = req.body.token;
  var guildId = req.body.guild;
  if(client.guilds.get(guildId) != undefined) {
    if(client.guilds.get(guildId).owner.id == req.body.user) {
      if(settings[guildId] == undefined)
        settings[guildId] = {};
      if(req.body.swearing == 'true')
        settings[guildId].swearing = "block";
      else
        settings[guildId].swearing = "allow";
    } 
  }
  //console.log(settings);
  commands.setDb(settings[guildId], guildId);
  res.send("Success");
});

setInterval(() => {
  fs.readFile('db.json', function (err, data) {
    if (err) throw err;
    settings = JSON.parse(data);
  });
}, 30000);

// Routes
app.use('/', require('./auth.js'));

app.listen(3000);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  console.log("...");
}, 280000);

function getShards(servers) {
   return Math.ceil((servers+100)/2500);
}
function getShardsuffix() {
  if(getShards(client.guilds.size) == 1) {return "shard."} else {return "shards."}
} 

module.exports.setDb = function(data) {
  settings = data;
  fs.writeFile("db.json", JSON.stringify(settings), function() {console.log("saved")});
}