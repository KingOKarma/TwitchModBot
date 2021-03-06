import Config from "./config";
import Storage from "./storage";
import Token from "./token";

export const CONFIG = Config.getConfig();

export const STORAGE = Storage.getConfig();

export const TOKEN = Token.getConfig();

export const commandList = [
    // System CMDs
    { group: "System", name: "join" },
    { aliases: ["leave"], group: "System", name: "part" },
    { aliases: ["pong"], group: "System", name: "ping" },

    // Custom command CMDs
    { aliases: ["addcc", "ccadd", "customadd"], group: "CustomCommands", name: "addcustom" },
    { aliases: ["removecc",
        "ccremove",
        "customremove",
        "deletecustom",
        "customdelete",
        "ccdelete",
        "deletecc"], group: "CustomCommands", name: "removecustom" },
    { aliases: ["listcc", "cclist", "customlist"], group: "CustomCommands", name: "listcustom" },

    // Mod CMDs
    { aliases: ["streamtitle"], group: "Mod", name: "title" },
    { aliases: ["gamename"], group: "Mod", name: "game" },
    { aliases: ["permission", "entitle"], group: "Mod", name: "permit" },
    { aliases: ["punish"], group: "Mod", name: "warn" },
    { aliases: ["modlogs"], group: "Mod", name: "warnings" },
    { aliases: ["clearlogs", "wipe"], group: "Mod", name: "clearwarns" },
    { aliases: ["event"], group: "Mod", name: "events" },

    // Automod CMDs
    { aliases: ["wordadd"], group: "Automod", name: "addword" },
    { aliases: ["wordremove", "deleteword", "worddelete"], group: "Automod", name: "removeword" },
    { aliases: ["wordslist", "wordlist", "listword"], group: "Automod", name: "listwords" },

    // Counter CMDs
    { group: "Counter", name: "count" },
    { aliases: ["editcount"], group: "Counter", name: "countedit" },
    { aliases: ["addcount"], group: "Counter", name: "countadd" },
    { aliases: ["resetcount"], group: "Counter", name: "countreset" },

    // Help CMDs
    { aliases: ["command", "commands"], group: "System", name: "help" }


];
