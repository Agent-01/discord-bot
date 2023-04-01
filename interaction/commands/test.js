import { SlashCommandBuilder } from "discord.js";
import { user_ids } from "../../json/user_ids.js";
import { log } from "../../utils/Log.js";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("A command only for testing")
    .addStringOption(option=>
        option.setName("option")
            .setDescription("A option")
            .setRequired(true));

export async function execute(interaction,client) {
    log("test");
    if (!user_ids.includes(interaction.user.id)) {
        await interaction.reply({content:"This command is only for testing!",ephemeral:true});
        return;
    } else {
        await interaction.deferReply();
        await interaction.editReply("Testing");
        client.value = "Success!";
    }
}