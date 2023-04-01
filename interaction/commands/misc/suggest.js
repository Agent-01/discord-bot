import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import {sleep} from "../../../utils/sleep.js";
import { config } from "dotenv";

config();

export const data = new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Give a or some suggestion(s) of the bot (cooldown 1h)\n提供關於機器人的一些建議(冷卻一小時)")
    .addStringOption(option =>
        option.setName("suggestion")
            .setDescription("The suggestion you want to give/建議")
            .setRequired(true));

export async function execute(interaction, client) {
    for (let i = 0; i < client.suggestcooldownlist.length; i++) {
        if (client.suggestcooldownlist[i][0] == interaction.user.id) {
            await interaction.reply({ content: `⛔ This command is on cooldown, please retry in ${client.suggestcooldownlist[i][1]} min(s) ${client.suggestcooldownlist[i][2]} second(s)\n這個指令還有${client.suggestcooldownlist[i][1]}分 ${client.suggestcooldownlist[i][2]}秒 的冷卻`, ephemeral: true });
            return;
        }
    }
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`suggestaccept||${interaction.user.id}||${interaction.options.getString("suggestion")}`)
                .setLabel("Yes")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`suggestnotaccept||${interaction.user.id}||${interaction.options.getString("suggestion")}`)
                .setLabel("No")
                .setStyle(ButtonStyle.Danger)
        );
    const Embed = new EmbedBuilder()
        .setTitle(`➡️Suggestion by ${interaction.user.tag}`)
        .setDescription(interaction.options.getString("suggestion"))
        .setColor(0x00FFFF)
        .setTimestamp(Date.now())
        .setFooter({ text: `By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    await interaction.reply({ content: "✅Your suggestion has been recorded, thank you!/你的建議已被記錄，謝謝！", ephemeral: true });
    client.suggestcooldownlist.push([interaction.user.id, 60, 0]);
    await client.users.cache.get(process.env.MyUserID).send({ embeds: [Embed], components: [row] });
    let temp_index = client.suggestcooldownlist.length - 1;
    while (client.suggestcooldownlist[temp_index][1] > 0 || client.suggestcooldownlist[temp_index][2] > 0) {
        if (client.suggestcooldownlist[temp_index][2] == 0) {
            client.suggestcooldownlist[temp_index][2] += 60;
            client.suggestcooldownlist[temp_index][1] -= 1;
        }
        client.suggestcooldownlist[temp_index][2]--;
        await sleep(1000);
    }
    client.suggestcooldownlist.splice(temp_index, 1);
}