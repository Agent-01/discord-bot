import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("random_number")
    .setDescription("Get a random number by provided range(max min inclusive)\n取得一個數字在提供的範圍内(包含最大最小)")
    .addIntegerOption(option =>
        option.setName("min")
            .setDescription("The minimum number will be generated/最小的數字")
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName("max")
            .setDescription("The maximum number will be generated/最大的數字")
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    let min = interaction.options.getInteger("min");
    let max = interaction.options.getInteger("max");
    if (min >= max) {
        await interaction.reply("Invalid range.");
        return;
    }
    await interaction.reply({ content: `The number is/數字是: ${Math.floor(Math.random() * (max - min + 1)) + min}`, ephemeral: interaction.options.getBoolean("ephemeral") == null ? true : interaction.options.getBoolean("ephemeral")});
}