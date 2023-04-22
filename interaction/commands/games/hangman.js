import { SlashCommandBuilder } from "discord.js";
import fs from "fs";

export const data = new SlashCommandBuilder()
    .setName("hangman")
    .setDescription("Starts a new hangman game");

export const guild = true;

export async function execute(interaction, client) {
    if (client.hangman[interaction.guild.id]) {
        await interaction.reply({content:"Another game is in progress.",ephemeral: true});
        return;
    }
    let word_list = JSON.parse(fs.readFileSync("./json/word_list.json"));
    if (word_list.length==0) {
        await interaction.channel.send("WOW! Congrats! @everyone have learned Oxford 3000!");
        word_list = fs.readFileSync("./source/word_list.json");
        fs.writeFileSync("./json/word_list.json",word_list);
        word_list = JSON.parse(word_list);
    }
    const index = Math.floor(Math.random()*word_list.length);
    client.hangman[interaction.guild.id] = {
        word: word_list[index],
        shown: "_".repeat(word_list[index].length),
        timeout: 60*5,
        hangman: "``` \n"+
                    "         ----------\n"+
                    "         |        |\n"+
                    "                  |\n"+
                    "                  |\n"+
                    "                  |\n"+
                    "__________________|____\n"+
                    "```",
        phrase: 0,
        wrong: []
    };
    client.hangman[interaction.guild.id].message = await interaction.reply({content:"The word is: "+"\\_".repeat(word_list[index].length)+"\n"+client.hangman[interaction.guild.id].hangman});
    word_list.splice(index, 1);
    fs.writeFileSync("./json/word_list.json",JSON.stringify(word_list,null,4));
}