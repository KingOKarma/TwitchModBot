/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import Storage from "../../utils/storage";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {

    const author = msg.userInfo.displayName;
    if (STORAGE.channels.some((storedChannel) => storedChannel === user)) {
        return chatClient.say(channel, `@${author} I'm already in your channel!`);
    }

    if (user === CONFIG.twitchUsername.toLowerCase()) {
        return chatClient.say(channel, `@${author} Your channel is the default channel! so I'm here automatically!`);
    }
    STORAGE.channels.push(user);
    chatClient.join(user).catch(console.error);
    Storage.saveConfig();

    return chatClient.say(channel, `@${author} I just joined the channel @${user}`);
};