import { SlashCommandBuilder } from "discord.js";
import { generateImage } from "../../../utils/OpenAi.js";

export const data = new SlashCommandBuilder()
    .setName("generate_image")
    .setDescription("This command uses OpenAi's api to generate a image accroding to the prompt.")
    .addStringOption(option=>
        option.setName("prompt")
            .setDescription("The description of the image.")
            .setRequired(true));

export async function execute(interaction) {
    await interaction.deferReply();
    await interaction.editReply({content:`${await generateImage(interaction.options.getString("prompt"))}`});
}