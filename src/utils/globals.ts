import Config from "./config";
import Storage from "./storage";

export const CONFIG = Config.getConfig();

export const STORAGE = Storage.getConfig();

export const commandList = [
    { group: "System", name: "join" },
    { aliases: ["leave"], group: "System", name: "part" },
    { aliases: ["pong"], group: "System", name: "ping" },
    { aliases: ["addcc", "ccadd", "customadd"], group: "CustomCommands", name: "addcustom" },
    { aliases: ["removecc",
        "ccremove",
        "customremove",
        "deletecustom",
        "customdelete",
        "ccdelete",
        "deletecc"], group: "CustomCommands", name: "removecustom" }


];