/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../globals";
import { ChatClient, ChatSubInfo, UserNotice } from "twitch-chat-client/lib";
import Storage, { ChannelCommand } from "../storage";

export async function onReSub(
    channel: string,
    user: string,
    subInfo: ChatSubInfo,
    msg: UserNotice,
    chatClient: ChatClient
): Promise<void> {
    let subPlan = "Tier Prime";

    switch (subInfo.plan) {
        case "1000":
            subPlan = "Tier 1";
            break;


        case "2000":
            subPlan = "Tier 2";
            break;


        case "3000":
            subPlan = "Tier 3";
            break;
    }

    if (subInfo.isPrime) {
        subPlan = "Tier Prime";
    }


    const broadcaster = channel.slice(1);

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        let response = userCommands.eventsStrings.reSub;

        if (response === "") {
            return;
        }


        if (response.includes("{user}")) {
            const replace = new RegExp("{user}", "g");
            response = response.replace(replace, subInfo.displayName);

        }

        if (response.includes("{months}")) {
            const replace = new RegExp("{months}", "g");
            response = response.replace(replace, subInfo.months.toString());
        }

        if (response.includes("{tier}")) {
            const replace = new RegExp("{tier}", "g");
            response = response.replace(replace, subPlan);
        }

        return chatClient.say(channel, userCommands.eventsStrings.reSub);

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
