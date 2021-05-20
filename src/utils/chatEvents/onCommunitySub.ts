/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../globals";
import { ChatClient, ChatCommunitySubInfo, UserNotice } from "twitch-chat-client/lib";
import Storage, { ChannelCommand } from "../storage";

export async function onCommunitySub(
    channel: string,
    user: string,
    subInfo: ChatCommunitySubInfo,
    msg: UserNotice,
    chatClient: ChatClient
): Promise<void> {
    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        let response = userCommands.eventsStrings.subed;

        if (response === "") {
            return;
        }

        if (response.includes("{user}")) {
            const replace = new RegExp("{user}", "g");
            if (subInfo.gifterDisplayName !== undefined) {
                response = response.replace(replace, subInfo.gifterDisplayName);
            }
        }

        if (response.includes("{subsAmount}")) {
            const replace = new RegExp("{subsAmount}", "g");
            response = response.replace(replace, subInfo.count.toString());

        }

        return chatClient.say(channel, response);

    }
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

}