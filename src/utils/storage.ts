import { dump, load } from "js-yaml";
import { STORAGE } from "./globals";
import fs from "fs";

/**
 * This represents the storage.yml
 * @class Storage
 * @property {string[]} channels

 */
export default class Storage {
    private static readonly _configLocation = "./storage.yml";

    public channels: string[];

    private constructor() {
        this.channels = [""];

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