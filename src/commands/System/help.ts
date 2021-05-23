/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatClient } from "twitch-chat-client/lib";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {
    const author = msg.userInfo.displayName;

    return chatClient.say(channel, `@${author} You can head over to`
    + " https://github.com/KingOKarma/TwitchModBot/blob/main/src/commands/README.md for info on all the commands!");

};
