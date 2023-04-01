import { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } from "discord.js";
import { log } from "../../../utils/Log.js";

export const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear Clear numbers of messages defaults to 1\n刪除一些訊息 默認為一")
    .addIntegerOption(option =>
        option.setName("number")
            .setDescription("The number of messages you want to delete./你需要刪除多少訊息的數值")
            .setRequired(false));

export async function execute(interaction) {
    try {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            if (interaction.options.getInteger("number") <= 0&&interaction.options.getInteger("number")!=null) {
                await interaction.reply("Invalid number.");
                setTimeout(() => interaction.deleteReply(), 1000 * 5);
                return;
            }
            let n = interaction.options.getInteger("number");
            if (n == undefined) {
                n = 2;
            } else {
                n++;
            }
            let o = n - 1;
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`clear ${n} ${interaction.user.id}`)
                        .setLabel("Yes")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("clear_cancel")
                        .setLabel("No")
                        .setStyle(ButtonStyle.Danger)
                );
            const Embed = new EmbedBuilder()
                .setTitle(`Are you sure you want to remove ${o} message(s)?\n你確定你要移除${o}個訊息嗎?`)
                .setColor(0xff9634)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [Embed], components: [row] });
        } else if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const Embed = new EmbedBuilder()
                .setTitle("I don't have the required permissions to run this command./機器人沒有需要的權限運行此指令")
                .setColor(0x00FFFF)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [Embed] });
        } else {
            const Embed = new EmbedBuilder()
                .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
                .setColor(0x00FFFF)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [Embed], ephemeral: true });
        }
    } catch (e) {
        console.error(e);
        log(`\n\n ${String(e)}`);
    }
}