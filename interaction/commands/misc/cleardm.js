import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { sleep } from "../../../utils/sleep.js";

export const data = new SlashCommandBuilder()
    .setName("cleardm")
    .setDescription("Clear the messages in your dm by the bot\n清除機器人傳送的訊息")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction, client) {
    const Embed = new EmbedBuilder()
        .setTitle("Fetching your dms/正在獲取機器人發送的訊息")
        .setColor(0x00FFFF)
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    await interaction.reply({ embeds: [Embed], ephemerals: interaction.options.getBoolean("ephemeral") == null ? true : interaction.options.getBoolean("ephemeral") });
    let bypass_msg = await interaction.fetchReply();
    client.users.fetch(interaction.user.id)
        .then(u => {
            u.createDM()
                .then(async dmchannel => {
                    dmchannel.messages.fetch({ limit: 100 })
                        .then(async messages => {
                            let c = messages.size;
                            messages = messages.filter(m => m.author.id == client.user.id||m.id==bypass_msg.id);
                            c = messages.size;
                            const Embed = new EmbedBuilder()
                                .setTitle(`Deleting ${c} DMs/正在刪除${c}個訊息`)
                                .setColor(0x00FFFF)
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                            await interaction.editReply({ embeds: [Embed] });
                            messages.forEach(async msg => {
                                await msg.delete()
                                    .then(async () => {
                                        c--;
                                        if (c == 0) {
                                            const Embed = new EmbedBuilder()
                                                .setTitle("DMs deleted successfully./已成功刪除訊息")
                                                .setColor(0x00FFFF)
                                                .setTimestamp(Date.now())
                                                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                                            if (interaction.guild) {
                                                await interaction.editReply({ embeds: [Embed] });
                                                await sleep(2000);
                                                await interaction.deleteReply();
                                            }
                                            else {
                                                let dmreply = await interaction.user.send({ embeds: [Embed] });
                                                await sleep(2000);
                                                await dmreply.delete();
                                            }
                                        }
                                    }).catch(async err => {
                                        try {
                                            await interaction.editReply(`Error occurred while deleting DMs.\n${err}`);
                                        } catch (e) {
                                            await interaction.user.send(`Error occurred while deleting DMs.\n${err}`);
                                        }
                                    });
                            });
                        });
                });
        });
}