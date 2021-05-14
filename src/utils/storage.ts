import { dump, load } from "js-yaml";
import { STORAGE } from "./globals";
import fs from "fs";

export interface ChannelCommand {
    channelName: string;
    commands: [CustomCommand];
}

export interface CustomCommand {
    commandName: string;
    response: string;
}

/**
 * This represents the storage.yml
 * @class Storage
 * @property {string[]} channels
 * @property {CustomCommand[]} customCommand

 */
export default class Storage {
    private static readonly _configLocation = "./storage.yml";

    public channels: string[];

    public customCommand: ChannelCommand[];

    private constructor() {
        this.channels = [""];
        this.customCommand = [{ channelName: "", commands: [{ commandName: "", response: "" }] }];

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