/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from "../globals";
import { ChatClient } from "twitch-chat-client/lib";

export async function onHosted(
    channel: string,
    byChannel: string,
    viewers: number | undefined,
    chatClient: ChatClient
): Promise<void> {
    // Const hostMsg = `${byChannel} has just hosted with ${viewers}`;

    // Return chatClient.say(channel, hostMsg);

}