import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("unlockdown")
    .setDescription("You don't need to know this :)");

export async function execute(interaction, client) {
    client.lockdown = undefined;
    await interaction.reply("Unlocked!");
}