### Twitch Mod Bot commands

---

Bot prefix is dependent on what the bot hoster/owner decides
~~In most cases it'll be `!`~~

List of All system commands:

#### System CMDs

- Command `join`

  - Group: System
    - Aliases: `None`

<br>

- Command `part`

  - Group: System
    - Aliases: `None`

<br>

- Command `ping`
  - Group: System
    - Aliases: `None`

---

#### Custom command CMDs

- Command `addcustom`

  - Group: CustomCommands
    - Aliases:
      `addcc`,
      `ccadd`,
      `customadd`

<br>

- Command `removecustom`

  - Group: CustomCommands
    - Aliases:
      `removecc`,
      `ccremove`,
      `customremove`,
      `deletecustom`,
      `customdelete`,
      `ccdelete`,
      `deletecc`

<br>

- Command `listcustom`

  - Group: CustomCommands
    - Aliases:
      `listcc`,
      `cclist`,
      `customlist`

---

#### Mod CMDs

- Command `title`

  - Group: Mod
    - Aliases:
      `streamtitle`

<br>

- Command `game`

  - Group: Mod
    - Aliases:
      `gamename`

<br>

- Command `permit`

  - Group: Mod
    - Aliases:
      `entitle`,
      `permission`

<br>

- Command `warn`

  - Group: Mod
    - Aliases:
      `punish`

<br>

- Command `warnings`

  - Group: Mod
    - Aliases:
      `modlogs`

<br>

- Command `clearwarns`

  - Group: Mod
    - Aliases:
      `wipe`.
      `clearlogs`

<br>

- Command `events`

  - Group: Mod

        - Aliases:
          `event`

    <br>

  **_Extra command info:_**
  example usage:
  `!events {eventType} {Event Response}`
  eg: `!events communitySub Thank you {user} for gifting the community {subsAmount} subs!`

  EventTypes:
  `communitySub`, `raided`, `reSub`, `subGifted`, `subed`

  You can make the event Response whatever you want eg:

Subs:

```
Thank you {user} for subbing with {tier} !
```

Or
Raids:

````
Thank you {user} for raiding with a party of {raidCount}  ```
````

Or
ReSubs

```
{user} has reSubbed to {tier} for {months}
```

---

#### Automod CMDs

- Command `addword`

  - Group: Automod
    - Aliases:
      `wordadd`

<br>

- Command `removeword`

  - Group: Automod
    - Aliases:
      `worddelete`,
      `deleteword`,
      `wordremove`

<br>

- Command `listwords`

  - Group: Automod
    - Aliases:
      `listword`,
      `wordlist`,
      `wordslist`

---

#### Counter CMDs

- Command `count`

  - Group: Counter
    - Aliases:
      `Counter`

<br>

- Command `countedit`

  - Group: Counter
    - Aliases:
      `editcount`

<br>

- Command `countadd`

  - Group: Counter
    - Aliases:
      `addcount`

<br>

- Command `countreset`

  - Group: Counter
    - Aliases:
      `resetcount`

---

#### Help CMDs

- Command `help`

  - Group: Counter
    - System:
      `commands`,
      `command`

---

##### Thank you for using the bot!

This code was made for a fiver commission over at
https://www.fiverr.com/kingofkarma

~~Make sure to go support my other github projects/commissions!~~
