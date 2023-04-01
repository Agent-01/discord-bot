import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mcutil from "minecraft-server-util";

export const data = new SlashCommandBuilder()
    .setName("get_minecraft_server")
    .setDescription("Get info about the Minecraft server\n取得Minecraft伺服器的資訊")
    .addStringOption(option =>
        option.setName("ip")
            .setDescription("The ip address of the Minecraft server/Minecraft伺服器的ip")
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName("port")
            .setDescription("The port of the minecraft server default: 25565/Minecraft伺服器的通訊埠")
            .setRequired(false));

export async function execute(interaction) {
    let port = interaction.options.getInteger("port") || 25565;
    mcutil.status(interaction.options.getString("ip"), port).then(async (response) => {
        let des = response.motd.raw.replace(/^\s+|\s+$/g, "");
        let newdes = "";
        let arr = [];
        for (let i = 0; i < des.length; i++) {
            if (des[i] == "*" || des[i] == "~~") {
                newdes += "\\";
            }
            if (des[i] == "§") {
                if (des[i + 1] == "l") {
                    newdes += "**";
                    arr.push("**");
                } else if (des[i + 1] == "o") {
                    newdes += "*";
                    arr.push("*");
                } else if (des[i + 1] == "m") {
                    newdes += "~~";
                    arr.push("~~");
                } else if (des[i + 1] != "n" && des[i + 1] != "k") {
                    arr.forEach(code => {
                        newdes += code;
                    });
                    arr = [];
                }
            } else if (des[i - 1] != "§") {
                newdes += des[i];
            }
        }
        arr.forEach(code => {
            newdes += code;
        });
        arr = [];
        let vers = response.version.name.trim();
        let newvers = "";
        for (let i = 0; i < vers.length; i++) {
            if (vers[i] == "*" || vers[i] == "~~") {
                newvers += "\\";
            }
            if (vers[i] == "§") {
                if (vers[i + 1] == "l") {
                    newvers += "**";
                    arr.push("**");
                } else if (vers[i + 1] == "o") {
                    newvers += "*";
                    arr.push("*");
                } else if (vers[i + 1] == "m") {
                    newvers += "~~";
                    arr.push("~~");
                } else if (vers[i + 1] != "n" && vers[i + 1] != "k") {
                    arr.forEach(code => {
                        newvers += code;
                    });
                    arr = [];
                }
            } else {
                newvers += vers[i];
            }
        }
        arr.forEach(code => {
            newvers += code;
        });
        arr = [];
        const Embed = new EmbedBuilder()
            .setTitle(`Displaying information of ${interaction.options.getString("ip")}:${port} 的資訊`)
            .setDescription(newdes)
            .addFields({ name: "Online Players/綫上玩家", value: `${response.players.online}`, inline: true }, { name: "Max Players/最大玩家數量", value: `${response.players.max}`, inline: true }, { name: "Version/版本", value: newvers })
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral") });
    }).catch(async () => {
        try {
            await interaction.reply({content:`Cannot find minecraft server hosted on ${interaction.options.getString("ip")}:${port}\n找不到在${interaction.options.getString("ip")}:${port}架設的伺服器`, ephemeral: true});
        } catch (e) {
            console.error(e);
        }
    });
}