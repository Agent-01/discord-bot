import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import {sleep} from "../../../utils/sleep.js";
import { user_ids } from "../../../json/user_ids.js";


export const data = new SlashCommandBuilder()
    .setName("bot_status")
    .setDescription("Changes the bot's status (cooldown 30s)\n更改機器人的狀態(冷卻三十秒)")
    .addIntegerOption(option =>
        option.setName("type")
            .setDescription("Changes the bot's status to the following type")
            .addChoices({ name: "Online", value: 0 }, { name: "Idle", value: 1 }, { name: "Do not disturb", value: 2 }, { name: "Offline", value: 3 })
            .setRequired(true));

export const guild = true;

export async function execute(interaction, client) {
    if (!client.bot_s) {
        if (user_ids.includes(interaction.user.id) || interaction.user.id == interaction.guild.ownerId) {
            let lst = [
                "online",
                "idle",
                "dnd",
                "invisible"
            ];
            let lstshow = [
                "Online",
                "Idle",
                "Do not disturb",
                "Offline"
            ];
            let lstcolor = [
                0x3ba55d,
                0xfaa81a,
                0xed4245,
                0x747f8d
            ];
            client.user.setStatus(lst[interaction.options.getInteger("type")]);
            const Embed = new EmbedBuilder()
                .setTitle(`Status has changed to **${lstshow[interaction.options.getInteger("type")]}**`)
                .setColor(lstcolor[interaction.options.getInteger("type")])
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ content: "", embeds: [Embed] });
        } else {
            let lst = [
                "online",
                "idle",
                "dnd",
                "invisible"
            ];
            let lstshow = [
                "Online",
                "Idle",
                "Do not disturb",
                "Offline"
            ];
            let lstcolor = [
                0x3ba55d,
                0xfaa81a,
                0xed4245,
                0x747f8d
            ];
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`client.bot_status||${lst[interaction.options.getInteger("type")]}`)
                        .setLabel("Yes")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("client.bot_status no")
                        .setLabel("No")
                        .setStyle(ButtonStyle.Danger)
                );
            const Embed = new EmbedBuilder()
                .setColor(lstcolor[interaction.options.getInteger("type")])
                .setTitle("Change bot status")
                .addFields({ name: "Status", value: lstshow[interaction.options.getInteger("type")] })
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ content: "Waiting for approval", embeds: [Embed], components: [row] });
        }
        client.bot_s = true;
        client.bot_s_timeleft = 30;
        let masg = await interaction.followUp({ content: `Cooldown time left: ${client.bot_s_timeleft}` });
        while (client.bot_s_timeleft) {
            try {
                await sleep(1000);
                client.bot_s_timeleft -= 1;
                await masg.edit(`Cooldown time left: ${client.bot_s_timeleft}`);
            } catch (e) {
                try {
                    if (e.rawError.code == 10008) masg = await interaction.followUp({ content: `Cooldown time left: ${client.bot_s_timeleft}` });
                } catch (err) {
                    throw e;
                }
            }
        }
        client.bot_s = undefined;
        await masg.delete();
    } else {
        const Embed = new EmbedBuilder()
            .setTitle(`This command is on cooldown, please try again in ${client.bot_s_timeleft} second(s).`)
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed] });
    }
}