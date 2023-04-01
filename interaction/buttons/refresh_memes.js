import axios from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import { log } from "../../utils/Log.js";

export const customId = "refresh_memes";

export async function execute(interaction) {
    const meme1 = await axios.get("https://www.reddit.com/r/ProgrammerHumor/random.json");
    const meme1embed = new EmbedBuilder()
        .setTitle(meme1.data[0].data.children[0].data.title)
        .setDescription("Daily memes of programming!")
        .setColor(0x117306)
        .setTimestamp(Date.now())
        .setImage(meme1.data[0].data.children[0].data.url);
    const meme2 = await axios.get("https://www.reddit.com/r/programmingmemes/random.json");
    const meme2embed = new EmbedBuilder()
        .setTitle(meme2.data[0].data.children[0].data.title)
        .setDescription("Daily memes of programming!")
        .setColor(0x117306)
        .setTimestamp(Date.now())
        .setImage(meme2.data[0].data.children[0].data.url);
    log(`Refreshing daily meme ${meme1.data[0].data.children[0].data.url}`);
    log(`Refreshing daily meme ${meme2.data[0].data.children[0].data.url}`);
    await interaction.message.edit({ embeds: [meme1embed,meme2embed],components:[] });
}