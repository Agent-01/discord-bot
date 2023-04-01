import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or a playlist or search for a song\n播放音樂透過鏈接或關鍵詞")
    .addStringOption(option =>
        option.setName("song")
            .setDescription("A link of the song or playlist or a keyword/音樂的鏈接或關鍵詞")
            .setDescriptionLocalization("en-US","A link of the song or playlist or a keyword")
            .setDescriptionLocalization("zh-TW","音樂的鏈接或關鍵詞")
            .setRequired(true))
    .setDMPermission(false)
    .setDescriptionLocalization("zh-TW","播放音樂透過鏈接或關鍵詞")
    .setDescriptionLocalization("en-US","Plays a song or a playlist or search for a song");

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You must be in a voice channel in order to listen the music!/你必須在語音頻道裏才能聼音樂！");
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
    client.DisTube.play(interaction.member.voice.channel, interaction.options.getString("song"), { textChannel: interaction.channel, member: interaction.member });
    await interaction.reply("🎶Request received!/請求已接收");
}