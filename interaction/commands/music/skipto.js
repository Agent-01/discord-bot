import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a specific track no.\n跳至指定歌曲")
    .addIntegerOption(option =>
        option.setName("tracknumber")
            .setDescription("The track to skip to/歌曲號碼")
            .setMinValue(1)
            .setRequired(true));

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在一樣的語音頻道！");
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
    const trackNum = interaction.options.getInteger("tracknumber");
    if (trackNum > queue.songs.length || trackNum <= 0) {
        await interaction.reply("🚫 Invalid track number/無效的歌曲號碼");
        return;
    }
    for (let i = 0; i < trackNum; i++) {
        if (queue.songs[i].member.id != interaction.user.id) {
            await interaction.reply("🚫 Unable to skip song(s) not requested by you./無法跳過不是你請求的歌曲");
            return;
        }
    }
    queue.jump(trackNum - 1);
    await interaction.reply(`Skipped to track number ${trackNum}/已跳至${trackNum}`);
}