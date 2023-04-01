import fs from "fs";

export async function log(content) {
    fs.appendFileSync("./logs/Latest.log", `${new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "")} `+String(content)+"\n");
}