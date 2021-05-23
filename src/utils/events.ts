import { CONFIG, STORAGE, commandList } from "../utils/globals";
import { ChatClient, Whisper } from "twitch-chat-client";
import Storage, { ChannelCommand } from "./storage";
import { StaticAuthProvider } from "twitch-auth";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";
import { onCommunitySub } from "./chatEvents/onCommunitySub";
import { onHosted } from "./chatEvents/onHosted";
import { onRaid } from "./chatEvents/onRaid";
import { onReSub } from "./chatEvents/onReSub";
import { onSub } from "./chatEvents/onSub";
import { onSubGift } from "./chatEvents/onSubGift";

// Config consts
const { clientID } = CONFIG;
const { botAccessToken } = CONFIG;
// Const { accessToken } = CONFIG;
const { prefix } = CONFIG;

// Auth Consts
const authChatProvider = new StaticAuthProvider(clientID, botAccessToken);
// Const authUserChatProvider = new StaticAuthProvider(clientID, accessToken);

export let userMod = false;
export let userVIP = false;

export async function intiChatClient(): Promise<void> {

    const channels = [CONFIG.twitchUsername];

    const allChannels = STORAGE.channels.concat(channels);

    const chatClient = new ChatClient(authChatProvider, { botLevel: "known", channels: allChannels });
    // Const userChatClient = new ChatClient(authUserChatProvider, { channels: [CONFIG.twitchUsername] });


    // Listen to more events...
    await chatClient.connect().then(void console.log("Successfully connected bot client!"));
    // Await userChatClient.connect().then(void console.log("Successfully connected user client!"));


    chatClient.onMessageFailed(async (channel: string, reason: string) => {
        console.log(`Cannot send message in ${channel} because of \n\n ${reason}`);
    });

    chatClient.onMessageRatelimit(async (channel: string, message: string) => {
        console.log(`Cannot send message in ${channel} because of it was rate limited \n msg: ${message}`);
    });

    chatClient.onWhisper((user: string, message: string, msg: Whisper) => {
        if (message.startsWith("!ac")) {
            const args = message.split(" ");
            console.log(args);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (args[1] === undefined) {
                return chatClient.whisper(user, "Please type in an access token with the scope \"user:edit:broadcast\"");
            }

            const userExists = STORAGE.customCommand.some((command) => command.channelName === msg.userInfo.userName);

            if (userExists) {
                const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === msg.userInfo.userName);
                const userCommands = STORAGE.customCommand[userIndex];
                // eslint-disable-next-line prefer-destructuring
                userCommands.accessToken = args[1];
                Storage.saveConfig();

            } else {
                const newCommand: ChannelCommand = {
                    accessToken: args[0],
                    bannedWords: ["simp", "incel", "virgin"],
                    channelName: user,
                    commands: [{}],
                    counter: { count: 0, counterName: "" },
                    eventsStrings: {
                        communitySub: "",
                        hosted: "",
                        raided: "",
                        reSub: "",
                        subGifted: "",
                        subed: ""
                    },
                    lurkResponse: "",
                    permitted: false,
                    warnings: 0
                };

                STORAGE.customCommand.push(newCommand);
                Storage.saveConfig();
            }
            return chatClient.whisper(user, "Thank you! You can now use !game <game name> and !title <title> on your streams now!");

        }

    });

    chatClient.onMessage(async (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => {

        if (msg.userInfo.isMod || msg.userInfo.isBroadcaster) {
            userMod = true;
            userVIP = true;
        } else {
            userMod = false;
            userVIP = false;
        }
        if (msg.userInfo.isVip || msg.userInfo.isSubscriber || userMod) {
            userVIP = true;
        } else userVIP = false;


        const { displayName } = msg.userInfo;

        const args = message.slice(prefix.length).trim().split(/ +/g);

        const cmd = args.shift()?.toLowerCase();

        if (cmd === undefined) {
            return;
        }

        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === user);
        let foundUser = STORAGE.customCommand[userIndex];

        if (userIndex === -1) {

            const newCommand: ChannelCommand = {
                accessToken: args[0],
                bannedWords: ["simp", "incel", "virgin"],
                channelName: user,
                commands: [{}],
                counter: { count: 0, counterName: "" },
                eventsStrings: {
                    communitySub: "",
                    hosted: "",
                    raided: "",
                    reSub: "",
                    subGifted: "",
                    subed: ""
                },
                lurkResponse: "",
                permitted: false,
                warnings: 0
            };

            STORAGE.customCommand.push(newCommand);
            Storage.saveConfig();
            foundUser = newCommand;
        }

        if (message.match(/(https?:\/\/[^\s]+)/g) && !userVIP) {
            if (foundUser.permitted) return;
            if (foundUser.channelName === CONFIG.twitchUsername) return;

            foundUser.warnings += 1;
            Storage.saveConfig();
            if (foundUser.warnings > 3) {
                chatClient.ban(channel, user, "Sending links | Over 3 warns with automod").catch(console.error);
                foundUser.warnings = 0;
                Storage.saveConfig();
                return chatClient.say(channel, `@${displayName} Has been banned for having`
                + " Over 3 warns with automod in this channel!");

            }

            chatClient.say(channel, `@${displayName} Please don't send links! That's only for Mods and VIPs, You now have`
            + `${foundUser.warnings} warnings!`)
                .catch(console.error);
            chatClient.timeout(channel, user, 120, `Sending links | ${foundUser.warnings} total warnings`).catch(console.error);
            return;
        }


        const commandIndex = STORAGE.customCommand.findIndex((command) => command.channelName === channel.slice(1));
        const command = STORAGE.customCommand[commandIndex];
        if (commandIndex !== -1) {

            const { bannedWords } = command;
            const isUsingBadWord = bannedWords.some((bannedWord) => {
                const badword = new RegExp(bannedWord, "g");
                return badword.exec(message);
            });

            if (isUsingBadWord && !userMod) {
                if (foundUser.permitted) return;
                if (foundUser.channelName === CONFIG.twitchUsername) return;

                foundUser.warnings += 1;
                Storage.saveConfig();
                if (foundUser.warnings > 3) {
                    chatClient.ban(channel, user, "Saying slurs | Over 3 warns with automod").catch(console.error);
                    foundUser.warnings = 0;
                    Storage.saveConfig();
                    return chatClient.say(channel, `@${displayName} Has been banned for having`
                    + " Over 3 warns with automod in this channel!");
                }

                chatClient.timeout(channel, user, 120, `Saying slurs | ${foundUser.warnings} total warnings`).catch(console.error);
                return chatClient.say(channel, `@${displayName} Please do not say slurs!, You now have`
            + `${foundUser.warnings} warnings!`).catch(console.error);
            }
            let ranOnce = false;

            if (message.startsWith(CONFIG.prefix)) {
                command.commands.forEach((ccName) => {
                    if (ccName.commandName === undefined) return;
                    const findCMD = new RegExp(`^${ccName.commandName}$`, "g");


                    if (findCMD.exec(cmd)) {

                        if (ccName.response === undefined) {
                            return;
                        }
                        let { response } = ccName;

                        if (response.includes("{user}")) {
                            const replace = new RegExp("{user}", "g");
                            response = response.replace(replace, msg.userInfo.displayName);
                        }
                        return chatClient.say(channel, response);

                    }
                });
            } else {
                command.commands.forEach((ccName) => {
                    if (!message.startsWith(CONFIG.prefix)) {
                        if (ccName.commandName !== undefined && ccName.response !== undefined) {
                            const findCMD = new RegExp(`\\b${ccName.commandName}\\b`, "gi");
                            if (findCMD.exec(message)) {
                                if (!ranOnce) {
                                    let { response } = ccName;

                                    if (response.includes("{user}")) {
                                        const replace = new RegExp("{user}", "g");
                                        response = response.replace(replace, msg.userInfo.displayName);
                                    }
                                    ranOnce = true;
                                    return chatClient.say(channel, response);
                                }
                            }
                        }
                    }
                });
            }
        }

        const cmdIndex = commandList.findIndex((n) => {
            if (n.aliases === undefined) {
                return n.name === cmd;
            }
            return n.name === cmd || n.aliases.includes(cmd);

        });

        if (cmdIndex === -1) {
            return;
        }

        const foundcmd = commandList[cmdIndex];

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commandFile = require(`../commands/${foundcmd.group}/${foundcmd.name}.js`);
            commandFile.run(chatClient, channel, user, message, msg, args);

        } catch (err) {

        }

    });

    chatClient.onCommunitySub(async (
        channel,
        user,
        subInfo,
        msg
    ) => onCommunitySub(channel, user, subInfo, msg, chatClient));

    chatClient.onSubGift(async (
        channel,
        user,
        subInfo,
        msg
    ) => onSubGift(channel, user, subInfo, msg, chatClient));

    chatClient.onResub(async (
        channel,
        user,
        subInfo,
        msg
    ) => onReSub(channel, user, subInfo, msg, chatClient));

    chatClient.onSub(async (
        channel,
        user,
        subInfo,
        msg
    ) => onSub(channel, user, subInfo, msg, chatClient));

    chatClient.onHost(async (
        byChannel,
        channel,
        viewers
    ) => onHosted(channel, byChannel, viewers, chatClient));

    chatClient.onRaid(async (
        channel,
        user,
        raidInfo,
        msg
    ) => onRaid(channel, user, raidInfo, msg, chatClient));

}

/**
 * Checks if user has perms to use bot commands
   * @param {TwitchPrivateMessage} msg Message instance
 */
export function checkPerms(msg: TwitchPrivateMessage): boolean {
    let hasperms = false;

    if (msg.userInfo.isBroadcaster) {
        hasperms = true;
    }

    if (msg.userInfo.isMod) {
        hasperms = true;
    }

    return hasperms;

}
