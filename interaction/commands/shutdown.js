import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { user_ids } from "../../json/user_ids.js";

export const data = new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("You don't need to know this :)");

export async function execute(interaction, client) {
    if (user_ids.includes(interaction.user.id)) {
        const Embed = new EmbedBuilder()
            .setTitle("Shuting down.../正在關閉..")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed] });
        client.destroy();
        process.exit(255);
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