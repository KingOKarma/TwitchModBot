/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatClient } from "twitch-chat-client/lib";
import { STORAGE } from "../../utils/globals";
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
    if (!perms) {
        if (!msg.userInfo.isVip) {
            return chatClient.say(channel, `@${author} Sorry this command can only be used by staff`);
        }
    }

    const word = args.join(" ");

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];

        if (userCommands.counter.counterName === "") {
            return chatClient.say(channel, `@${author} No count message has been setup! please use countedit with the {count} variable`);
        }

        userCommands.counter.count += 1;
        Storage.saveConfig();

        let response = userCommands.counter.counterName;

        if (response.includes("{count}")) {
            const replace = new RegExp("{count}", "g");
            response = response.replace(replace, userCommands.counter.count.toString());
        }

        return chatClient.say(channel, response);
    }

    return chatClient.say(channel, `@${author} No count message has been setup! please use countedit with the {count} variable`);
};