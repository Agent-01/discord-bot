import { EmbedBuilder } from "discord.js";

export const customId = "suggestaccept";

export async function execute(interaction, client) {
    const button = interaction.customId;
    const Embed = new EmbedBuilder()
        .setTitle("Suggestion Accepted")
        .setDescription(`Suggestion:\n${button.split("||")[2]}`)
        .setColor(0x3ba55d)
        .setTimestamp(Date.now())
        .setFooter({ text: `Accepted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    await client.users.cache.get(button.split("||")[1]).send({ embeds: [Embed] });
    await interaction.update({ components: [] });
}