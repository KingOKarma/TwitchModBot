/* eslint-disable @typescript-eslint/no-unused-vars */
import Storage, { ChannelCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
import { STORAGE } from "../../utils/globals";
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

    const word = args.join(" ");

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channel, `@${author} Please provide a message to set for the counter, You can use "{count}" `
        + "to represent the count as a variable");
    }

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];

        userCommands.counter.counterName = word;
    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin"],
            channelName: broadcaster,
            commands: [{}],
            counter: { count: 0, counterName: word },
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

    return chatClient.say(channel, `@${author} I have edited the counter response to "${word}" to @${channel.slice(1)}!`);
};