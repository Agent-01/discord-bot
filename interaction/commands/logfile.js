import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import Stream from "stream";
import { user_ids } from "../../json/user_ids.js";
import readline from "readline";
import path from "path";

const __dirname = path.resolve();

async function countLines(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let lineCount = 0;
    // eslint-disable-next-line no-unused-vars
    for await (const _ of rl) {
        lineCount++;
    }
    return lineCount;
}

export const data = new SlashCommandBuilder()
    .setName("logfile")
    .setDescription("Get the log file")
    .addIntegerOption(option=>
        option.setName("lines")
            .setDescription("Get last number of lines")
            .setRequired(true)
            .setMinValue(1))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    if (user_ids.includes(interaction.user.id)) {
        let log_lines = await countLines("./logs/Latest.log");
        let linecount = 0;
        let inStream = fs.createReadStream("./logs/Latest.log");
        let outStream = new Stream;
        let waitforpromise = new Promise((resolve, reject)=> {
            let rl = readline.createInterface(inStream, outStream);
            let Lines = "";
            rl.on("line", function (line) {
                linecount++;
                if (linecount > log_lines-interaction.options.getInteger("lines")) {
                    Lines += line+"\n";
                }
            });
            rl.on("error", reject);
            rl.on("close", function () {
                resolve(Lines);
            });
        });
        waitforpromise.then(async lines=> {
            if ((`-------------Last ${interaction.options.getInteger("lines")} lines-------------\n`+lines).length<2000) interaction.reply({content:`-------------Last ${interaction.options.getInteger("lines")} lines-------------\n`+lines,ephemeral: interaction.options.getBoolean("ephemeral")==null?true:interaction.options.getBoolean("ephemeral")});
            else {
                const Embed = new EmbedBuilder()
                    .setTitle("Log file is sent through private message.")
                    .setColor(0xFFD700)
                    .setTimestamp(Date.now())
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({embeds:[Embed],ephemeral: interaction.options.getBoolean("ephemeral")==null?false:interaction.options.getBoolean("ephemeral")});
                await interaction.user.send({files:[{attachment:`${__dirname}/logs/Latest.log`}]});
            }
        });
    } else {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        if (interaction.guild != null) await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
        else await interaction.reply({ content: "", embeds: [Embed] });
    }
}