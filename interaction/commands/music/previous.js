import { SlashCommandBuilder } from "discord.js";
import { log } from "../../../utils/Log.js";

export const data = new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous music\n播放上一首音樂");

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    const queue = client.DisTube.getQueue(interaction.guild);
    if (interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ You need to be in the same voice channel!/你必須在一樣的語音頻道！");
        return;
    }
    try {
        await queue.previous();
        await interaction.reply("🎶Request received!");
    } catch (e) {
        if (e.errorCode == "NO_PREVIOUS") {
            await interaction.reply("🚫 There is no previous song in the queue/目前沒有任何歌曲正在播放");
        } else {
            console.error(e);
            log(`\n\n ${String(e)}`);
        }
    }
}