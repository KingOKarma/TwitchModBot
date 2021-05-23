/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import Storage, { ChannelCommand, CustomCommand } from "../../utils/storage";
import { ChatClient } from "twitch-chat-client/lib";
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
    if (!perms) return chatClient.say(channel, `@${author} Sorry this command can only be used by staff`);

    const ccName = args.shift();
    const commandResposne = args.join(" ");

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ccName === undefined || args[0] === undefined) {
        return chatClient.say(channel, `@${author} Please provide a command name and response. `
        + "EG: \"!addcustom hello Hi how are you!\" (!addcustom <ccName> <ccResponse>)");
    }

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];

        const commandExists = userCommands.commands.some((command) => command.commandName === ccName);

        if (commandExists) {
            return chatClient.say(channel, `@${msg.userInfo.displayName} The command ${ccName} already exists!`);
        }

        userCommands.commands.push({ commandName: ccName, response: commandResposne });
    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin"],
            channelName: broadcaster,
            commands: [{
                commandName: ccName,
                response: commandResposne
            }],
            counter: { count: 0, counterName: "" },
            eventsStrings: {
                communitySub: "",
                hosted: "",
                raided: "",
                reSub: "",
                subGifted: "",
                subed: ""
            },
            lurkResponse: "",
            permitted: false,
            warnings: 0
        };

        STORAGE.customCommand.push(newCommand);

    }

    Storage.saveConfig();

    return chatClient.say(channel, `@${author} I have added! the command ${ccName} to @${channel.slice(1)}!`);
};