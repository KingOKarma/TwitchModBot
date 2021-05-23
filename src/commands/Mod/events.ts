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
    if (!perms) return chatClient.say(channel, `@${author} Sorry this command can only be used by staff`);

    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        console.log(args);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (args[0] === undefined) {
            return chatClient.say(channel, `@${author} Please specify either communitySub, raided,`
        + " subGift, reSub, sub and then type out the message you want to be sent when that event happens!"
        + " Example usage: !events sub Thank you {user} for subbing to {tier} ! PogChamp");
        }

        switch (args[0].toLowerCase()) {
            case "communitysub":
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (args[1] === undefined) {
                    return chatClient.say(channel, `@${author} With community subs you can use the variables {user} and {subsAmount}`);
                }
                args.shift();
                userCommands.eventsStrings.communitySub = args.join(" ");
                Storage.saveConfig();
                return chatClient.say(channel, `@${author} I have set the community subs message to "${userCommands.eventsStrings.communitySub}"`);

            case "raided":
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (args[1] === undefined) {
                    return chatClient.say(channel, `@${author} With raids you can use the variables {user} and {raidCount}`);
                }

                args.shift();
                userCommands.eventsStrings.raided = args.join(" ");
                Storage.saveConfig();
                console.log(args);
                return chatClient.say(channel, `@${author} I have set the raids message to "${userCommands.eventsStrings.raided}"`);

            case "subgift":
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (args[1] === undefined) {
                    return chatClient.say(channel, `@${author} With gifted subs you can use the variables {user} and {gifted} and {tier}`);
                }
                args.shift();
                userCommands.eventsStrings.subGifted = args.join(" ");
                Storage.saveConfig();
                return chatClient.say(channel, `@${author} I have set the gifted subs message to "${userCommands.eventsStrings.subGifted}"`);


            case "resub":
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (args[1] === undefined) {
                    return chatClient.say(channel, `@${author} With reSubs you can use the variables {user} and {tier} and months}`);
                }
                args.shift();
                userCommands.eventsStrings.reSub = args.join(" ");
                Storage.saveConfig();
                return chatClient.say(channel, `@${author} I have set the resub message to "${userCommands.eventsStrings.reSub}"`);


            case "sub":
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (args[1] === undefined) {
                    return chatClient.say(channel, `@${author} With subs you can use the variables {user} and {tier}`);
                }
                args.shift();
                userCommands.eventsStrings.subed = args.join(" ");
                Storage.saveConfig();
                return chatClient.say(channel, `@${author} I have set the subed message to "${userCommands.eventsStrings.subed}"`);


            default:
                return chatClient.say(channel, `@${author} Please specify either communitySub, raided,`
                + " subGift, reSub, sub and then type out the message you want to be sent when that event happens!"
                + " Example usage: !events sub Thank you {user} for subbing to {tier} ! PogChamp");
        }


    } else {
        const newCommand: ChannelCommand = {
            accessToken: "",
            bannedWords: ["simp", "incel", "virgin"],
            channelName: broadcaster,
            commands: [{}],
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
        Storage.saveConfig();
        return chatClient.say(channel, `@${author} Please specify either communitySub, raided,`
        + " subGift, reSub, sub and then type out the message you want to be sent when that event happens!"
        + " Example usage: !events sub Thank you {user} for subbing to {tier} ! PogChamp");

    }
};