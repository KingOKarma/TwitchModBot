import { dump, load } from "js-yaml";
import { STORAGE } from "./globals";
import fs from "fs";

export interface ChannelCommand {
    accessToken: string;
    bannedWords: string[];
    channelName: string;
    commands: [CustomCommand];
    counter: Counter;
    eventsStrings: EventStrings;
    lurkResponse: string;
    permitted: boolean;
    warnings: number;
}

export interface CustomCommand {
    commandName?: string;
    response?: string;
}

export interface Counter {
    count: number;
    counterName: string;
}

export interface EventStrings {
    communitySub: string;
    hosted: string;
    raided: string;
    reSub: string;
    subGifted: string;
    subed: string;
}

/**
 * This represents the storage.yml
 * @class Storage
 * @property {string[]} channels
 * @property {ChannelCommand[]} customCommand

 */
export default class Storage {
    private static readonly _configLocation = "./storage.yml";

    public channels: string[];

    public customCommand: ChannelCommand[];

    private constructor() {
        this.channels = [""];
        this.customCommand =
         [{ accessToken: "",
             bannedWords: [""],
             channelName: "",
             commands: [
                 {
                     commandName: "",
                     response: ""
                 }
             ],

             counter: {
                 count: 0,
                 counterName: "" },

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
             warnings: 0 }
         ];

    }

    /**
       *  Call getConfig instead of constructor
       */
    public static getConfig(): Storage {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!fs.existsSync(Storage._configLocation)) {
            throw new Error("Please create a config.yml");
        }
        const fileContents = fs.readFileSync(
            Storage._configLocation,
            "utf-8"
        );
        const casted = load(fileContents) as Storage;

        return casted;
    }

    /**
   *  Safe the config to the storage.yml default location
   */
    public static saveConfig(): void {
        fs.writeFileSync(Storage._configLocation, dump(STORAGE));
    }
}