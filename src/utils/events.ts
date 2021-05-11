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
        console.log(userMod);
        console.log(userVIP);
        console.log(msg.userInfo.isMod || msg.userInfo.isBroadcaster);

        if (message.match(/(https?:\/\/[^\s]+)/g) && !userVIP) {
            chatClient.say(channel, `${displayName} Please don't send links! That's only for mods and VIPs`)
                .catch(console.error);
            chatClient.timeout(channel, msg.userInfo.userName, 120, "Sending links").catch(console.error);
            return;
        }


        const args = message.slice(prefix.length).trim().split(/ +/g);

        const cmd = args.shift()?.toLowerCase();

        if (message.toLowerCase() === "hello") {
            const owner = await apiClient.helix.users.getUserByName(CONFIG.twitchUsername);
            void chatClient.say(channel, `Heya! did you know ${owner?.displayName} is the owner of this bot`);
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commandFile = require(`../commands/${cmd}.js`);
            commandFile.run(chatClient, channel, user, message, msg, args);

        } catch (err) {

        }

    });

}