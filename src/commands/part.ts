/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import Storage from "../utils/storage";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {


    if (user === CONFIG.twitchUsername.toLowerCase()) {
        return chatClient.say(channel, `@${msg.userInfo.displayName} You cannot part from me as I am bind to your account through a config file!`);
    }

    const isUserStored = !STORAGE.channels.includes(user);

    if (isUserStored) {
        return chatClient.say(channel, `@${msg.userInfo.displayName} I'm not even in your channel, you can use "${CONFIG.prefix}join" !`);
    }


    const channelIndex = STORAGE.channels.findIndex((channelName) => channelName === user);
    STORAGE.channels.splice(channelIndex, 1);

    chatClient.part(user);
    Storage.saveConfig();

    return chatClient.say(channel, `I just left the channel @${user}`);
};