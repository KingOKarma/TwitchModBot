/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from "../globals";
import { ChatClient } from "twitch-chat-client/lib";

export async function onHosted(
    channel: string,
    byChannel: string,
    viewers: number | undefined,
    chatClient: ChatClient
): Promise<void> {
    // const hostMsg = `${byChannel} has just hosted with ${viewers}`;

    // return chatClient.say(channel, hostMsg);

}