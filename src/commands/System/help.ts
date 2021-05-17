/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE, commandList } from "../../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {

    return chatClient.say(channel, "You can head over to"
    + " https://github.com/KingOKarma/TwitchModBot/tree/main/src/commands#readme for info on all the commands!");

};
