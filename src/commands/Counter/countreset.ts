/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import Storage, { ChannelCommand, CustomCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";
import { checkPerms } from "../../utils/events";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {


    const author = msg.userInfo.displayName;
    const perms = checkPerms(msg);
    if (!perms) return chatClient.say(channel, `@${author} Sorry this command can only be used by staff`);

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];


        userCommands.counter.count = 0;
    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin", args[0]],
            channelName: broadcaster,
            commands: [{}],
            counter: { count: 0, counterName: "No count set, you can use {count} as a variable and use countedit to make your counter!" },
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

    }

    Storage.saveConfig();

    return chatClient.say(channel, `@${author} I have reset the channel counter for @${channel.slice(1)}!`);
};