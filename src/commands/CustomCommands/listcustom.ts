/* eslint-disable @typescript-eslint/no-unused-vars */
import Storage, { ChannelCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
import { STORAGE } from "../../utils/globals";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

exports.run = async (chatClient: ChatClient,
    channel: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {

    const broadcaster = channel.slice(1);

    const channelIndex = STORAGE.customCommand.findIndex((chan) => chan.channelName === broadcaster);

    if (channelIndex === -1) {
        return chatClient.say(channel, "This channel doesn't have any custom commands!"
        + " You can add some with !addcustom <ccName> <ccResponse>");
    }

    const foundChannel = STORAGE.customCommand[channelIndex];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (foundChannel.commands.length < 1) {
        return chatClient.say(channel, "This channel doesn't have any custom commands!"
        + " You can add some with !addcustom <ccName> <ccResponse>");
    }

    const commands = foundChannel.commands.map((command) => command.commandName);


    return chatClient.say(channel, `List of commands: ${commands.join(", ")}`);
};