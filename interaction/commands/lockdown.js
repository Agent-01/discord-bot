import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("You don't need to know this :)");

export async function execute(interaction, client) {
    client.lockdown = true;
    await interaction.reply("Locked down!");
}