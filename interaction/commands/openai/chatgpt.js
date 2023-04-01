import { TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Chat with the bot!");

export async function execute(interaction,client) {
    for (let i = 0; i < client.chatgptlist.length; i++) {
        if (client.chatgptlist[i][0] == interaction.user.id && client.chatgptlist[i][1] > 0 || client.chatgptlist[i][0] == interaction.user.id && client.chatgptlist[i][2] > 0) {
            await interaction.reply({ content: `⛔ This command is on cooldown, please retry in ${client.chatgptlist[i][1]} min(s) ${client.chatgptlist[i][2]} second(s)\n這個指令還有${client.chatgptlist[i][1]}分 ${client.chatgptlist[i][2]}秒 的冷卻`, ephemeral: true });
            return;
        }
    }
    const modal = new ModalBuilder()
        .setCustomId("chatgpt_modal")
        .setTitle("ChatGPT");
    const questionInput = new TextInputBuilder()
        .setCustomId("questionInput")
        .setLabel("The question or message that sends to the bot")
        .setStyle(TextInputStyle.Paragraph);
    const row1 = new ActionRowBuilder().addComponents(questionInput);
    modal.addComponents(row1);
    await interaction.showModal(modal);
}