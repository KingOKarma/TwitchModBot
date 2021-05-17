/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {


    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];

        if (userCommands.counter.counterName === "") {
            return chatClient.say(channel, "No count message has been setup! please use countedit with the {count} variable");
        }

        let response = userCommands.counter.counterName;

        if (response.includes("{count}")) {
            const replace = new RegExp("{count}", "g");
            response = response.replace(replace, userCommands.counter.count.toString());
        }

        return chatClient.say(channel, response);


    }
    return chatClient.say(channel, "No count message has been setup! please use countedit with the {count} variable");

};