/* eslint-disable @typescript-eslint/no-unused-vars */
import Storage, { ChannelCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
import { STORAGE } from "../../utils/globals";
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
    if (!perms) return chatClient.say(channel, "Sorry this command can only be used by staff");
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channel, `@${author} Please mention a user to warn!`);
    }

    let targetUser = args[0].toLowerCase();

    if (targetUser.startsWith("@")) {
        targetUser = targetUser.slice(1);
    }

    const userExists = STORAGE.customCommand.some((command) => command.channelName === targetUser);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === targetUser);
        const userCommands = STORAGE.customCommand[userIndex];
        userCommands.warnings += 1;
        Storage.saveConfig();

        return chatClient.say(channel, `@${targetUser} has been warned they now have ${userCommands.warnings} warnings!`);
    }
    const newCommand: ChannelCommand = {
        accessToken: "",
        bannedWords: ["simp", "incel", "virgin"],
        channelName: targetUser,
        commands: [{}],
        counter: { count: 0, counterName: "" },
        lurkResponse: "",
        permitted: false,
        warnings: 1
    };

    STORAGE.customCommand.push(newCommand);
    Storage.saveConfig();

    return chatClient.say(channel, `@${targetUser} has been warned! they now have 1 warning!`);
};