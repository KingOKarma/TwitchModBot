import { ClientCredentialsAuthProvider, StaticAuthProvider } from "twitch-auth";
import { ApiClient } from "twitch";
import { CONFIG } from "../utils/globals";
import { ChatClient } from "twitch-chat-client";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

// Config consts
const { clientID } = CONFIG;
const { clientSecret } = CONFIG;
const { botAccessToken } = CONFIG;
const { accessToken } = CONFIG;
const { prefix } = CONFIG;

// Auth Consts
const authProvider = new ClientCredentialsAuthProvider(clientID, clientSecret);
const authChatProvider = new StaticAuthProvider(clientID, botAccessToken);
const authUserChatProvider = new StaticAuthProvider(clientID, accessToken);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiClient = new ApiClient({ authProvider });
export let userMod = false;
export let userVIP = false;

export async function intiChatClient(): Promise<void> {

    const chatClient = new ChatClient(authChatProvider, { channels: [CONFIG.twitchUsername] });
    const userChatClient = new ChatClient(authUserChatProvider,
        { channels: [CONFIG.twitchUsername]
            // , logger: { minLevel: "debug" }
        });
    // Listen to more events...
    await chatClient.connect().then(void console.log("Sucessfully connected bot client!"));
    await userChatClient.connect().then(void console.log("Sucessfully connected user client!"));

    chatClient.onMessageFailed(async (channel: string, reason: string) => {
        console.log(`Cannot send message in ${channel} beacuse of \n\n ${reason}`);
    });

    chatClient.onMessageRatelimit(async (channel: string, message: string) => {
        console.log(`Cannot send message in ${channel} beacuse of it was rate limited \n msg: ${message}`);
    });

    chatClient.onMessage(async (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => {
        if (user === CONFIG.botUsername) return;

        if (msg.userInfo.isMod || msg.userInfo.isBroadcaster) {
            userMod = true;
            userVIP = true;
        } else {
            userMod = false;
            userVIP = false;
        }
        if (msg.userInfo.isVip || userMod) {
            userVIP = true;
        } else userVIP = false;

        const { displayName } = msg.userInfo;

        if (message.match(/(https?:\/\/[^\s]+)/g) && !userVIP) {
            chatClient.say(channel, `@${displayName} Please don't send links! That's only for Mods and VIPs`)
                .catch(console.error);
            chatClient.timeout(channel, user, 120, "Sending links").catch(console.error);
            return;
        }

        const args = message.slice(prefix.length).trim().split(/ +/g);

        const cmd = args.shift()?.toLowerCase();

        const bannedWords = ["simp", "incel", "virgin"];
        const isUsingBadWord = bannedWords.some((bannedWord) => {
            const badword = new RegExp(bannedWord, "g");
            return badword.exec(message);
        });

        if (isUsingBadWord && !userMod) {
            chatClient.timeout(channel, user, 120, "Saying slurs").catch(console.error);
            return chatClient.say(channel, `${displayName} Please do not say slurs!`).catch(console.error);
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commandFile = require(`../commands/${cmd}.js`);
            commandFile.run(chatClient, channel, user, message, msg, args);

        } catch (err) {

        }

    });

}