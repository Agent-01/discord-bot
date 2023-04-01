import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song\n跳過音樂");

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
    const currentSong = queue.songs[0];
    if (currentSong.member.id != interaction.user.id) {
        await interaction.reply("🚫 Unable to skip song not requested by you./無法跳過不是你請求的歌曲");
        return;
    }
    if (queue.songs.length == 1) {
        await queue.stop();
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`⏭️ ${currentSong.name} has been skipped!/已跳過！`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    } else {
        await queue.skip();
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`⏭️ ${currentSong.name} has been skipped!/已跳過！`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    }
}