import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current song queue\n顯示目前音樂列表")
    .addIntegerOption(option =>
        option.setName("page")
            .setDescription("The page of the song queue/頁數")
            .setMinValue(1)
            .setRequired(true));

export const guild = true;

export async function execute(interaction, client) {
    await interaction.deferReply();
    const queue = client.DisTube.getQueue(interaction.guild);
    if (!queue) {
        await interaction.reply("⛔ There are no songs in the queue/目前沒有任何歌曲正在播放");
        return;
    }
    const totalpages = Math.ceil(queue.songs.length / 10) || 1;
    const page = (interaction.options.getInteger("page") || 1) - 1;
    if (page > totalpages) {
        await interaction.editReply(`🚫 Invalid page. There are only a total of ${totalpages} pages.\n無效的頁書，總共有${totalpages}頁`);
        return;
    }
    const queueString = queue.songs.slice(page * 10, page * 10 + 10).map((song, i) => {
        return `**${page * 10 + i + 1}.**\`[${song.formattedDuration}]\` ${song.name} -- <@${song.member.id}>`;
    }).join("\n");
    const currentSong = queue.songs[0];
    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription("🎶**Currently Playing/正在播放**\n" + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.name} -- <@${currentSong.member.id}>` : "None") +
                    `\n\n**Queue/歌曲列表**\n${queueString}`
                )
                .setFooter({ text: `Page ${page + 1} of ${totalpages}` })
                .setThumbnail(currentSong.thumbnail)
                .setTimestamp(Date.now())
        ]
    });
}