import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets the bot's volume\n設置音量")
    .addIntegerOption(option =>
        option.setName("volume")
            .setDescription("The volume to be set/音量 (default 25%/默認25%)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100));

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ You need to be in the same voice channel!/你必須在一樣的語音頻道！");
        return;
    }
    const queue = client.DisTube.getQueue(interaction.guild);
    if (!queue) {
        await interaction.reply("⛔ There are no songs in the queue/目前沒有任何歌曲正在播放");
        return;
    }
    queue.setVolume(interaction.options.getInteger("volume"));
    await interaction.reply(`✅ Volume has been set to \`${interaction.options.getInteger("volume")}%\`\n音量已設至\`${interaction.options.getInteger("volume")}%\``);
    if (interaction.options.getInteger("volume") == 0) await interaction.followUp("So why don't you just pause it or quit it or skip it🤨");
}