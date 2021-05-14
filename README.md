# TwitchModBot

This is a twitch bot which can auto moderate multiple channels

## Todo

#### Counter

eg:

- `!deaths`

  - Ask the count (anyone)
  - Response example “Demon has died (count) times... Type F in chat to pay respects”

- `!deathadd`

  - Add to the count (VIPs+Mods)
  - Response example “Welp Demon died... again, new total is (count) “

- `!deathreset`
  - Reset the count (VIPs+Mods)
  - Response example “ $(user) has brought Demon back from the dead, Goodluck this time bud “

**(Option to change it per channel for example if they don’t want a death command being able to change it too a burp or something**

- Ask the count (anyone)

- Add to the count (VIPs+Mods)

- Reset the count (VIPs+Mods)

#### Lurk

- Work off of !lurk and lurk, lurking (maybe able to change to add more or a different response per channel)

`!lurk` or `(RegEx “lurk” or “lurking”)`

- Response example “Don’t be like Grandpa Demon and get some rest Zzz! Don’t forget to mute the tab not the stream to still earn points!”

#### Game

- `!game (Change game to this)`
  changes the game of the stream

#### Title

- `!title (changes the title to this)`
- changes the title of the stream

#### Permit

- `!permit @thisperson`
- Can post links without getting timed out for 2 Minutes (anyone permitted, by a Mod or the Streamer)

##### Timeouts (120seconds)

- Anyone who posts a link without being permitted (exclude VIPs + Mods ) ✅
- Blacklisted words (editable) for now we can just put incel, simp, virgin ✅(Simple version setup)

#### Ban

- Anyone that gets timed out by the bot more than 3 times

#### Join Channel

A command or ability to join a channel and store commands for that specific channel ✅ (also a `!part` So if they don't want the bot they can get rid of it)
(Make sure to mod the bot so it has perms!)

#### Custom commands/per channel

For example / but very editable (accepts RegEx) semi done!

- !excuse Sorry, Dero burps a lot and forgots manners sometimes
