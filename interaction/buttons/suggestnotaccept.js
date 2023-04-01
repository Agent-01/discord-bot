import { EmbedBuilder } from "discord.js";

export const customId = "suggestnotaccept";

export async function execute(interaction, client) {
    const button = interaction.customId;
    const Embed = new EmbedBuilder()
        .setTitle("Suggestion Rejected")
        .setDescription(`Suggestion:\n${button.split("||")[2]}`)
        .setColor(0xed4245)
        .setTimestamp(Date.now())
        .setFooter({ text: `Rejected by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    await client.users.cache.get(button.split("||")[1]).send({ embeds: [Embed] });
    await interaction.message.delete();
}