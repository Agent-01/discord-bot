import { SlashCommandBuilder, ActivityType } from "discord.js";
import { user_ids } from "../../json/user_ids.js";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("A command only for testing")
    .addStringOption(option=>
        option.setName("option")
            .setDescription("A option")
            .setRequired(true));

export async function execute(interaction,client) {
    if (!user_ids.includes(interaction.user.id)) {
        await interaction.reply({content:"This command is only for testing!",ephemeral:true});
        return;
    } else {
        await interaction.deferReply();
        await interaction.editReply("Testing");
        try {
            await client.user.setActivity("Bot is under maintenance", { type: ActivityType.Custom });
            await interaction.editReply("hmmm success?");
        } catch (e) {
            await interaction.editReply("failed");
        }
    }
}