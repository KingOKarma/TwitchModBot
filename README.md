# TwitchModBot

This is a twitch bot which can auto moderate multiple channels

Commands can be found at
https://github.com/KingOKarma/TwitchModBot/tree/main/src/commands#readme

---

### Setup

- Copy `example.config.yml` as `config.yml` and fill in the gaps, all info is in the file

- Rename `example.storage.yml` to `storage.yml` and dont touch anything else there

---

### Running

###### Locally/Testing

`npm run start` or `yarn start`

###### pm2

Make sure to use `tsc` then run `pm2 start build/bot.js`

###### Just using node

`tsc` first to build then run `node build/bot.js`

---

##### Required User scope:

- `user:edit:broadcast`

Login to your account and go here:
Redirect link referance:
https://id.twitch.tv/oauth2/authorize?client_id=[CLIENTID]&redirect_uri=[OneOfTheLinksFromYourRedirectURL]&response_type=token&scope=user:edit:broadcast

Replace `CLIENTID` and `OneOfTheLinksFromYourRedirectURL`

---

##### Required Bot scopes

- `chat:read`
- `chat:edit`
- `channel:moderate`
- `whispers:read`
- `whispers:edit`

Login to your bot account and go here:
Redirect link referance:
https://id.twitch.tv/oauth2/authorize?client_id=[CLIENTID]&redirect_uri=[OneOfTheLinksFromYourRedirectURL]&response_type=token&scope=chat:read%20chat:edit%20channel:moderate%20whispers:read%20whispers:edit

Replace `CLIENTID` and `OneOfTheLinksFromYourRedirectURL`
