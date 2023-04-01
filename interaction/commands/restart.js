import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { user_ids } from "../../json/user_ids.js";
import fs from "fs";

export const data = new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restarts the bot")
    .addBooleanOption(option => 
        option.setName("full")
            .setDescription("Choose whether fully restart the bot")
            .setRequired(true));

export async function execute(interaction, client) {
    if (user_ids.includes(interaction.user.id) || interaction.user.id == interaction.guild.ownerId) {
        const Embed = new EmbedBuilder()
            .setTitle("Restarting.../正在重新啓動...")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed] });
        let mymsg = await interaction.fetchReply();
        let data = fs.readFileSync("./json/Config.json", "utf8");
        data = await JSON.parse(data);
        data["Restart"]["Time"] = Date.now();
        data["Restart"]["Message"] = `${mymsg.id}||${interaction.channelId}`;
        data = JSON.stringify(data, null, 4);
        fs.writeFileSync("./json/Config.json", data);
        data = JSON.parse(data);
        let m = data["Restart"]["Message"].split("||")[0];
        let c = data["Restart"]["Message"].split("||")[1];
        client.channels.fetch(c).then(async (channel) => {
            channel.messages.fetch(m).then(async (message) => {
                const Embed = new EmbedBuilder()
                    .setTitle("Exiting.../正在離開..")
                    .setColor(0x00FFFF)
                    .setTimestamp(Date.now())
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                await message.edit({ content: "", embeds: [Embed] }).then(()=>client.destroy()).finally(() => interaction.options.getBoolean("full")? process.exit(100):process.exit(0));
            });
        });
    } else {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        if (interaction.guild != null) await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
        else await interaction.reply({ content: "", embeds: [Embed], ephemeral: true});
    }
}