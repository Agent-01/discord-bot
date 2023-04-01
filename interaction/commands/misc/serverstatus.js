import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import fs from "fs";

export const data = new SlashCommandBuilder()
    .setName("serverstatus")
    .setDescription("Get the server status of Lost Ark Shandi Server\n取得Lost Ark伺服器的狀態")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
    let r = (await axios.get("https://www.playlostark.com/en-gb/support/server-status")).data;
    let shandi_at = r.indexOf("Shandi");
    let shandi_status_at = r.indexOf("ags-ServerStatus-content-responses-response-server-status ags-ServerStatus-content-responses-response-server-status--", shandi_at) + 117;
    let shandi_status_end = r.indexOf("\"", shandi_status_at);
    let temp = "";
    for (let i = shandi_status_at; i < shandi_status_end; i++) temp += r[i];
    let colour = 0x00FFFF;
    fs.readFile("./json/Config.json", "utf8", async function readFileCallback(err, data) {
        if (err) {
            await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${err}`);
            return;
        } else {
            let obj = JSON.parse(data);
            if (temp == "maintenance" || temp == "busy" || temp == "good" || temp == "full") {
                let new_status = obj["Current Status"];
                if (temp != new_status) {
                    obj["Lost Ark"]["Last Status"] = new_status;
                    obj["Lost Ark"]["Current Status"] = temp;
                    let json = JSON.stringify(obj,null,4);
                    fs.writeFile("./json/Config.json", json, "utf8", (err) => {
                        if (err) throw err;
                    });
                }
            }
            temp = obj["Lost Ark"]["Current Status"];
            let last_state = obj["Lost Ark"]["Last Status"];
            if (temp == "maintenance") colour = 0x4F699D;
            else if (temp == "busy") colour = 0xEAC04B;
            else if (temp == "good") colour = 0x4CBF8E;
            else if (temp == "full") colour = 0xB53435;
            const Embed = new EmbedBuilder()
                .setColor(colour)
                .setTimestamp(Date.now())
                .setAuthor({
                    iconURL: "https://cdn.discordapp.com/attachments/931826601405063208/953941303606018118/9k.png",
                    url: "https://www.playlostark.com/en-gb/support/server-status",
                    name: "Lost Ark server status/伺服器狀態"
                })
                .addFields({
                    name: "The status of server Shandi/Shandi 伺服器狀態",
                    value: `The status of the server/目前伺服器狀態: ${temp}\n Last status/上一次伺服器狀態更改: ${last_state}`
                })
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.editReply({ embeds: [Embed] });
        }
    });
}