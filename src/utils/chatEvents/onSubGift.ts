/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../globals";
import { ChatClient, ChatSubGiftInfo, UserNotice } from "twitch-chat-client/lib";
import Storage, { ChannelCommand } from "../storage";

export async function onSubGift(
    channel: string,
    user: string,
    subInfo: ChatSubGiftInfo,
    msg: UserNotice,
    chatClient: ChatClient
): Promise<void> {
    const giftCounts = new Map<string | undefined, number>();
    const giftingUser = subInfo.gifter;
    let subPlan = "Tier Prime";

    const previousGiftCount = giftCounts.get(giftingUser) ?? 0;
    if (previousGiftCount > 0) {
        giftCounts.set(giftingUser, previousGiftCount - 1);
    } else {
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
            let response = userCommands.eventsStrings.subGifted;

            if (response === "") {
                return;
            }


            if (response.includes("{user}")) {
                const replace = new RegExp("{user}", "g");
                if (subInfo.gifterDisplayName !== undefined) {
                    response = response.replace(replace, subInfo.gifterDisplayName);

                }
            }

            if (response.includes("{gifted}")) {
                const replace = new RegExp("{gifted}", "g");
                response = response.replace(replace, subInfo.displayName);
            }

            if (response.includes("{tier}")) {
                const replace = new RegExp("{tier}", "g");
                response = response.replace(replace, subPlan);
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
}
