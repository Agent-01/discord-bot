import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Let the bot say something specified\n讓機器人說指定的東西")
    .addStringOption(option =>
        option.setName("content")
            .setDescription("The message the bot will send/機器人會傳送的訊息")
            .setRequired(true));

export async function execute(interaction) {
    await interaction.reply(interaction.options.getString("content"));
}