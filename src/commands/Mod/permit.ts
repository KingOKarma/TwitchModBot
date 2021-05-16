/* eslint-disable @typescript-eslint/no-unused-vars */
import Storage, { ChannelCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
import { STORAGE } from "../../utils/globals";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";
import { checkPerms } from "../../utils/events";
import ms from "ms";

const timeOut = new Map();

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
        return chatClient.say(channel, `@${author} Please mention a user to permit for 2 minutes!`);
    }

    let targetUser = args[0].toLowerCase();

    if (targetUser.startsWith("@")) {
        targetUser = targetUser.slice(1);
    }

    const timeout = 120000;
    const key = `${targetUser}permit`;
    const found = timeOut.get(key);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === targetUser);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === targetUser);
        const userCommands = STORAGE.customCommand[userIndex];
        const isPermitted = userCommands.permitted;

        if (isPermitted) {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (found) {
                const timePassed = Date.now() - found;
                const timeLeft = timeout - timePassed;
                return chatClient.say(channel, `@${author}, @${targetUser}`
                + ` is still permitted for another ${ms(timeLeft, { long: true })}!`);
            }

            return chatClient.say(channel, `@${author} the user @${targetUser} is already permitted!`);
        }

        userCommands.permitted = true;
        timeOut.set(key, Date.now());

        setTimeout(() => {
            timeOut.delete(`${targetUser}permit`);
            userCommands.permitted = false;
            Storage.saveConfig();

        }, 120000);

    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin"],
            channelName: targetUser,
            commands: [{}],
            counter: { count: 0, counterName: "" },
            lurkResponse: "",
            permitted: false,
            warnings: 0
        };

        STORAGE.customCommand.push(newCommand);

    }
    Storage.saveConfig();

    return chatClient.say(channel, `@${author}, @${targetUser} has been permited 2 minutes!`);
};
