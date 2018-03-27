
const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('./utils.js');
const router = express.Router();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('https://padlok.glitch.me/auth');
module.exports = router;

router.get('/auth', catchAsync(async (req, res) => {
  if (req.query.code) {
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });
    const json = await response.json();
    //res.send(json)
    res.redirect(`/auth?access_token=${json.access_token}`);
  }
  if(req.query.access_token) {
    const response = await fetch(`https://discordapp.com/api/users/@me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${req.query.access_token}`,
        },
      });
    const json = await response.json();
    //res.send("ok")
    res.redirect(`/dashboard?access_token=${req.query.access_token}&json=${JSON.stringify(json)}`);
  }
}));
router.get('/guilds', catchAsync(async (req, res) => {
  const response = await fetch(`https://discordapp.com/api/users/@me/guilds`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${req.query.access_token}`,
        },
      });
    const json = await response.json();
    //res.send("ok")
    res.redirect(`/dashboard?time=${Math.round((new Date()).getTime() / 1000)}&guilds=${JSON.stringify(json)}`);
}));