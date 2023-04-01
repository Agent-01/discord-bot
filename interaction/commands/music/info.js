import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays information of the queue\n顯示目前音樂列表的資訊");

export const guild = true;

export async function execute(interaction, client) {
    try {
        const queue = client.DisTube.getQueue(interaction.guild);
        if (!queue) {
            await interaction.reply("⛔ There are no songs in the queue/目前沒有任何歌曲正在播放");
            return;
        }
        const song = queue.songs[0];
        let embed = new EmbedBuilder()
            .setDescription(`🎶Currently playing/正在播放\n[${song.name}](${song.url})\n\n`)
            .setThumbnail(song.thumbnail)
            .addFields(
                { name: "Current Time", value: queue.formattedCurrentTime,inline:true},
                { name: "Song duration\n音樂時長", value: song.formattedDuration, inline:true },
                { name: "Total song duration\n總音樂時長", value: queue.formattedDuration, inline:true },
                { name: "Views/觀看次數", value: `${song.views}`, inline:true},
                { name: "Likes/讚數", value: `${song.likes}`,inline: true},
                { name: "Dislike/倒讚數", value: `${song.dislikes}`,inline:true},
                { name: "🔞", value: song.age_restricted? "Yes":"No", inline:true},
                { name: "Live?/直播?", value: song.isLive? "Yes":"No",inline:true},
                { name: "Uploader/上傳者", value: song.uploader.name, inline: true},
                { name: "User requested/請求用戶", value: `${song.user}`},
                { name: "Status/狀態", value:queue.paused?"Paused/已暫停":"Playing/正在播放"},
                { name: "Filters", value: `${queue.filters.names.length!=0?queue.filters.names.join(", "):"All off"}`},
                { name: "Volume/音量", value:`${queue.volume}%`}
            )
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });
    } catch (e) {
        console.error(e);
    }
}