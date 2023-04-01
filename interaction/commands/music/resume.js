import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the music\n繼續播放音樂");

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    const queue = client.DisTube.getQueue(interaction.guild);
    if (!queue) {
        await interaction.reply("⛔ There are no songs in the queue/目前沒有任何歌曲正在播放");
        return;
    }
    if (interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ You need to be in the same voice channel!/你必須在一樣的語音頻道！");
        return;
    }
    queue.resume(interaction.guild.members.me.voice.channel);
    await interaction.reply("Music has been resumed!/音樂正在繼續播放");
}