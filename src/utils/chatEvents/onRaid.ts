/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatClient, ChatRaidInfo, UserNotice } from "twitch-chat-client/lib";
import Storage, { ChannelCommand } from "../storage";
import { STORAGE } from "../globals";

export async function onRaid(
    channel: string,
    user: string,
    raidInfo: ChatRaidInfo,
    msg: UserNotice,
    chatClient: ChatClient
): Promise<void> {
    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        let response = userCommands.eventsStrings.raided;

        if (response === "") {
            return;
        }

        if (response.includes("{user}")) {
            const replace = new RegExp("{user}", "g");
            response = response.replace(replace, raidInfo.displayName);
        }

        if (response.includes("{raidCount}")) {
            const replace = new RegExp("{raidCount}", "g");
            response = response.replace(replace, raidInfo.viewerCount.toString());
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