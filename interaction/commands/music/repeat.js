import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Repeats the song(s)\n重複")
    .addStringOption(option =>
        option.setName("type")
            .setDescription("The type of the repeat mode/重複模式")
            .setRequired(true)
            .addChoices({ name: "all/全部", value: "all" }, { name: "current/目前", value: "one" }, { name: "off/關閉", value: "off" }));

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
        await interaction.reply("⛔ You need to be in the same voice channel!");
        return;
    }
    const currentSong = queue.songs[0];
    if (interaction.options.getString("type") == "all") {
        queue.setRepeatMode(2);
        await interaction.reply(`🔁 Total of ${queue.songs.length} songs is looping!/${queue.songs.length}首歌正在重複播放！`);
    }
    else if (interaction.options.getString("type") == "one") {
        queue.setRepeatMode(1);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔂 **[${currentSong.name}](${currentSong.url})** is looping!/正在重複播放！`)
                    .setFooter({ text: `Duration: ${currentSong.formattedDuration}` })
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    } else if (interaction.options.getString("type") == "off") {
        queue.setRepeatMode(0);
        await interaction.reply("▶️ Repeat mode: off/重複音樂已關閉");
    }
}