/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import Storage from "../../utils/storage";
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


    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channel, `@${author} Please provide a command name from the list to remove from. "
        + "EG: \"!removecustom hello\" (!addcustom <ccName>)`);
    }
    const findNumber = new RegExp(/^[0-9]+$/, "g");
    const isNumber = findNumber.exec(args[0]);

    if (!isNumber) {
        return chatClient.say(channel, `@${author} Please use ${CONFIG.prefix}listwords to find the number to remove`
        + " the desired word/phrase from the list EG: !removeword 5");
    }
    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        const wordIndex = Number(args[0]) - 1;
        const badWord = userCommands.bannedWords[wordIndex];
        const badWordIndex = userCommands.bannedWords.findIndex((word) => word === badWord);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (badWordIndex === -1) {
            return chatClient.say(channel, `@${author} That word/phrase doesn't exist! use ${CONFIG.prefix}listwords to`
            + " view what number you need to use!");
        }
        userCommands.bannedWords.splice(wordIndex, 1);
        Storage.saveConfig();

        const censored = badWord.split(" ").map((censWord) => {
            const half = censWord.trim().substring(censWord.length / 2);
            const replace = new RegExp(half, "g");
            const replaceWith = "****";
            const newword = censWord.replace(replace, replaceWith);
            return newword;

        });
        return chatClient.say(channel, `@${author} I have removed! the word/phrase "${censored.join(" ")}" from @${channel.slice(1)}!`);

    }
    return chatClient.say(channel, `@${author} This channel doesn't have any automod words!"
        + " You can add some with !addword <Word/Phrase>`);


};