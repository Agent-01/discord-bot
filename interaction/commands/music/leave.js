import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Let the bot leave the voice channel\n讓機器人離開語音頻道");

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member.voice.channel) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    if (interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ You need to be in the same voice channel!/你必須在一樣的語音頻道！");
        return;
    }
    const queue = client.DisTube.getQueue(interaction.guild);
    if (queue) {
        for (let song of queue.songs) {
            if (song.member.id != interaction.user.id) {
                await interaction.reply("🚫 Cannot leave while songs are playing that is not requested by you");
                return;
            }
        }
        try {
            await queue.stop();
        } catch (e) {
            console.error(e);
        }
    }
    await client.DisTube.voices.leave(interaction.guild);
    await interaction.reply("Bot left voice channel sadly :(\n機器人傷心地離開了 :(");
}