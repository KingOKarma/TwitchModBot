/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiClient, StaticAuthProvider } from "twitch";
import { CONFIG, STORAGE } from "../../utils/globals";
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channel, `@${author} Please type in a title to change the strema to!`);
    }

    const broadcaster = channel.slice(1);

    let accessToken = "";

    const userExists = STORAGE.customCommand.some((command) => command.channelName === broadcaster);

    if (userExists) {
        const userIndex = STORAGE.customCommand.findIndex((command) => command.channelName === broadcaster);
        const userCommands = STORAGE.customCommand[userIndex];
        // eslint-disable-next-line prefer-destructuring
        accessToken = userCommands.accessToken;

    }

    if (broadcaster === CONFIG.twitchUsername) {
        // eslint-disable-next-line prefer-destructuring
        accessToken = CONFIG.accessToken;
    }

    const authProvider = new StaticAuthProvider(CONFIG.clientID, accessToken, ["user:edit:broadcast"]);

    const apiClient = new ApiClient({ authProvider });
    let succeeded = true;

    const channelName = await apiClient.helix.users.getUserByName(broadcaster);
    if (channelName === null) return;

    await apiClient.helix.channels.updateChannelInfo(channelName.id,
        { title: args.join(" ") } ).catch(async (err) => {
        console.log(err);
        succeeded = false;
        return chatClient.say(channel, `@${author} I do not have authorisation to change your stream title,`
        + ` please tell the broadcaster to go to https://id.twitch.tv/oauth2/authorize?client_id=${CONFIG.clientID}`
        + "&redirect_uri=https://redirect.bucketbot.dev&response_type=token&scope=user:edit:broadcast and then "
        + "whisper to me the access token with !ac <token>. EG: !ac a5asdsg36kvidnqw39vf23");
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!succeeded) {
        return;
    }

    return chatClient.say(channel, `I have changed the Stream title to "${args.join(" ")}" for @${channel.slice(1)}!`);
};
