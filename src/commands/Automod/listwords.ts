/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
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


    const broadcaster = channel.slice(1);

    const channelIndex = STORAGE.customCommand.findIndex((chan) => chan.channelName === broadcaster);

    if (channelIndex === -1) {
        return chatClient.say(channel, "This channel doesn't have any banned words!"
        + " You can add some with !addword <word/phrase>");
    }

    const foundChannel = STORAGE.customCommand[channelIndex];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (foundChannel.bannedWords.length < 1) {
        return chatClient.say(channel, "This channel doesn't have any banned words!"
        + " You can add some with !addword <word/phrase>");
    }

    const commands = foundChannel.bannedWords.map((command, index) => {

        const censored = command.split(" ").map((censWord) => {
            const half = censWord.trim().substring(censWord.length / 2);
            const replace = new RegExp(half, "g");
            const replaceWith = "****";
            const newword = censWord.replace(replace, replaceWith);
            return newword;

        });
        return `${index + 1} - ${censored.join(" ")}`;
    });


    return chatClient.say(channel, `List of words: ${commands.join(", ")}`);
};