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


    const perms = checkPerms(msg);
    if (!perms) return chatClient.say(channel, "Sorry this command can only be used by staff");

    const word = args.join(" ");

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channel, "Please provide a word/phrase to add to the automod list!");
    }

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];

        const wordExists = userCommands.bannedWords.some((badWord) => badWord === word);

        if (wordExists) {
            return chatClient.say(channel, `@${msg.userInfo.displayName} The word/phrase is already on the list!`);
        }

        userCommands.bannedWords.push(word);
    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin", args[0]],
            channelName: broadcaster,
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

    }

    Storage.saveConfig();
    const censored = word.split(" ").map((censWord) => {
        const half = censWord.trim().substring(censWord.length / 2);
        const replace = new RegExp(half, "g");
        const replaceWith = "****";
        const newword = censWord.replace(replace, replaceWith);
        return newword;

    });

    return chatClient.say(channel, `I have added the word/phrase "${censored.join(" ")}" to @${channel.slice(1)}!`);
};