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


    const perms = checkPerms(msg);
    if (!perms) return chatClient.say(channel, "Sorry this command can only be used by staff");

    const ccName = args.shift();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ccName === undefined) {
        return chatClient.say(channel, "Please provide a command name from the list to remove from. "
        + "EG: \"!removecustom hello\" (!addcustom <ccName>)");
    }

    const userExists = STORAGE.customCommand.some((command) => command.channelName === user);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === user);
        const userCommands = STORAGE.customCommand[userIndex];
        const commandExists = userCommands.commands.some((command) => command.commandName === ccName);

        if (!commandExists) {
            return chatClient.say(channel, `@${msg.userInfo.displayName} The command ${ccName} doesn't exist!`);
        }
        const commandIndex = userCommands.commands.findIndex((command) => command.commandName === ccName);
        userCommands.commands.splice(commandIndex, 1);

        // UserCommands.commands.push({ commandName: ccName, response: commandResposne });
    } else {
        return chatClient.say(channel, "This channel doesn't have any custom commands!"
        + " You can add some with !addcustom <ccName> <ccResponse>");

    }

    Storage.saveConfig();

    return chatClient.say(channel, `I have removed! the command ${ccName} from @${channel.slice(1)}!`);
};