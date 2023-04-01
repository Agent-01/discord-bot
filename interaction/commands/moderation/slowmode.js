import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Sets the slowmode of current channel\n設置慢速模式")
    .addBooleanOption(option =>
        option.setName("state")
            .setDescription("turns on or off the slow mode (true = on, false = off)/true=開啓 false=關閉")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("time")
            .setDescription("The time of the slowmode/冷卻時長")
            .addChoices({ name: "5s", value: "5 s" }, { name: "10s", value: "10 s" }, { name: "15s", value: "15 s" }, { name: "30s", value: "30 s" }, { name: "1m", value: "1 m" }, { name: "2m", value: "2 m" }, { name: "5m", value: "5 m" }, { name: "10m", value: "10 m" }, { name: "15m", value: "15 m" }, { name: "30m", value: "30 m" }, { name: "1h", value: "1 h" }, { name: "2h", value: "2 h" }, { name: "6h", value: "6 h" })
            .setRequired(false))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export const guild = true;

export async function execute(interaction) {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        if (interaction.options.getBoolean("state") == true) {
            let time = interaction.options.getString("time");
            try {
                time = time.split(" ");
                if (time[1] == "s") {
                    await interaction.channel.edit({ rateLimitPerUser: parseInt(time[0]) });
                    await interaction.reply({ content: `✅ Channel has been updated with ${time[0]}${time[1]} slowmode.\n頻道發送訊息冷卻已設為${time[0]}${time[1]}`, ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
                } else if (time[1] == "m") {
                    await interaction.channel.edit({ rateLimitPerUser: parseInt(time[0]) * 60 });
                    await interaction.reply({ content: `✅ Channel has been updated with ${time[0]}${time[1]} slowmode.\n頻道發送訊息冷卻已設為${time[0]}${time[1]}`, ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
                } else if (time[1] == "h") {
                    await interaction.channel.edit({ rateLimitPerUser: parseInt(time[0]) * 60 * 60 });
                    await interaction.reply({ content: `✅ Channel has been updated with ${time[0]}${time[1]} slowmode.\n頻道發送訊息冷卻已設為${time[0]}${time[1]}`, ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
                } else {
                    await interaction.reply({ content: "🚫 You must provide a time for turning on slowmode/請選擇發送訊息的冷卻", ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
                }
            } catch (e) {
                await interaction.reply({ content: "You must provide a time for turning on slowmode", ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
            }
        } else if (interaction.options.getBoolean("state") == false) {
            await interaction.channel.edit({ rateLimitPerUser: 0 });
            await interaction.reply({ content: "✅ Channel has been updated without slowmode.\n頻道發送訊息冷卻已關閉", ephemeral: interaction.options.getBoolean("ephemeral") != null ? interaction.options.getBoolean("ephemeral") : true });
        }
    } else if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        const Embed = new EmbedBuilder()
            .setTitle("⛔ You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [Embed], ephemeral: true });
    } else if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        const Embed = new EmbedBuilder()
            .setTitle("🚫 I don't have the required permissions to run this command./機器人沒有需要的權限運行此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [Embed] });
    }
}