import axios from "axios";
import { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";
import { log } from "./Log.js";

export async function memes(client) {
    let meme1 = await axios.get("https://www.reddit.com/r/ProgrammerHumor/random.json");
    while (meme1.data[0].data.children[0].data.title.length>=256) {
        meme1 = await axios.get("https://www.reddit.com/r/ProgrammerHumor/random.json");
        if (meme1.data[0].data.children[0].data.title.length<256) break;
    }
    const meme1embed = new EmbedBuilder()
        .setTitle(meme1.data[0].data.children[0].data.title)
        .setDescription("Daily memes of programming!")
        .setColor(0x117306)
        .setTimestamp(Date.now())
        .setImage(meme1.data[0].data.children[0].data.url);
    let meme2 = await axios.get("https://www.reddit.com/r/ProgrammerHumor/random.json");
    while (meme2.data[0].data.children[0].data.title.length>=256) {
        meme2 = await axios.get("https://www.reddit.com/r/ProgrammerHumor/random.json");
        if (meme2.data[0].data.children[0].data.title.length<256) break;
    }
    const meme2embed = new EmbedBuilder()
        .setTitle(meme2.data[0].data.children[0].data.title)
        .setDescription("Daily memes of programming!")
        .setColor(0x117306)
        .setTimestamp(Date.now())
        .setImage(meme2.data[0].data.children[0].data.url);
    log(`Sending daily meme ${meme1.data[0].data.children[0].data.url}`);
    log(`Sending daily meme ${meme2.data[0].data.children[0].data.url}`);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("refresh_memes")
                .setLabel("Regenerate")
                .setStyle(ButtonStyle.Primary)
        );
    await client.channels.fetch("959468252906541191").then(channel => channel.send({ embeds: [meme1embed,meme2embed],components:[row] }));
}