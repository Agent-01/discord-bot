import { SlashCommandBuilder } from "discord.js";
import {sleep} from "../../../utils/sleep.js";

export const data = new SlashCommandBuilder()
    .setName("gpt4")
    .setDescription("A gpt4 command which is testing")
    .addStringOption(option=>
        option.setName("prompt")
            .setDescription("The question or message that sends to the bot")
            .setRequired(true));

export async function execute(interaction) {
    await interaction.deferReply();
    await sleep(Math.floor(Math.random()*5000));
    const response = await interaction.editReply("https://imgur.com/NQinKJB");
    await sleep(2000);
    const msg = await interaction.followUp("Today is 1st of April \\:)");
    await sleep(10000);
    await response.delete();
    await msg.delete();
}