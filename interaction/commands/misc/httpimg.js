import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("httpimg")
    .setDescription("Get an image of that http error code")
    .addIntegerOption(option=>
        option.setName("code")
            .setDescription("The error code of the http error")
            .setMaxValue(599)
            .setMinValue(0)
            .setRequired(true))
    .addStringOption(option=>
        option.setName("type")
            .setDescription("cat or dog?")
            .addChoices({
                name: "cat",
                value: "cat"
            },{
                name: "dog",
                value: "dog"
            })
            .setRequired(true));

export async function execute(interaction) {
    await interaction.reply(`https://http.${interaction.options.getString("type")}/${interaction.options.getInteger("code")}.jpg`);
}