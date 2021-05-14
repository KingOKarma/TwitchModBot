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

    return chatClient.say(channel, "PONG!");
};