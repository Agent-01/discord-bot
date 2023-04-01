import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Let the bot join the voice channel which you are currently in\n讓機器人加入你所在的頻道");

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ The bot has already playing music in another voice channel/機器人已在其他語音頻道中播放音樂");
        return;
    }
    if (!interaction.member.voice.channel.joinable) {
        const Embed = new EmbedBuilder()
            .setTitle("🚫 The bot don't have the required permissions to join the channel!/機器人沒有權限加入語言頻道")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [Embed] });
        return;
    }
    await client.DisTube.voices.join(interaction.member.voice.channel);
    await interaction.reply("✅Joined!/已加入！");
}