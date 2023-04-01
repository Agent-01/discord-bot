import { SlashCommandBuilder } from "discord.js";
import fs from "fs";
import {GOOGLE_IMG_SCRAP} from "google-img-scrap";
import { log } from "../../../utils/Log.js";

const clean_string_list = function clean_stri(stri) {
    let cleaned_string = "";
    let cleaned_lst = [];
    stri = stri.toLowerCase();
    for (let i = 0; i < stri.length; i++) {
        if (stri[i] >= "a" && stri[i] <= "z") {
            cleaned_string += stri[i];
        } else {
            cleaned_lst.push(cleaned_string);
            cleaned_string = "";
        }
        if (i == stri.length - 1) {
            cleaned_lst.push(cleaned_string);
        }
    }
    return cleaned_lst;
};

const get_test_list = function test_list(lst) {
    let return_string = "";
    let return_list = [];
    for (let i = 0; i < lst.length; i++) {
        for (let j = i; j < lst.length; j++) {
            return_string += lst[j];
        }
        return_list.push(return_string);
        return_string = "";
    }
    for (let i = 0; i < lst.length; i++) {
        return_string += lst[i];
        return_list.push(return_string);
    }
    return return_list;
};

export const data = new SlashCommandBuilder()
    .setName("get_image")
    .setDescription("Get a image related to the specific topic\n取得一張和主題有關的照片")
    .addStringOption(option =>
        option.setName("topic")
            .setDescription("The topic you want the image related to/主題")
            .setRequired(true));

export async function execute(interaction) {
    await interaction.deferReply();
    let forbidden_words = JSON.parse(fs.readFileSync("./json/Forbidden_words.json"));
    let resolved = false;
    try {
        let please_wait = new Promise((resolve) => {
            let clean_word_array = clean_string_list(interaction.options.getString("topic"));
            let another_test_list = get_test_list(clean_word_array);
            for (let i = 0; i < forbidden_words.length; i++) {
                if (resolved == true) break;
                let word = forbidden_words[i];
                for (let j = 0; j < clean_word_array.length; j++) {
                    if (resolved == true) break;
                    if (clean_word_array[j] == word) {
                        let show_word = "";
                        for (let found = 0; found < word.length; found++) {
                            if (found % 2 == 1) {
                                show_word += "\\*";
                            } else {
                                show_word += forbidden_words[i][found];
                            }
                        }
                        interaction.editReply(`Topic contains forbidden word:${show_word}/偵測到被禁止的字:${show_word}`);
                        resolved = true;
                        resolve(true);
                        break;
                    }
                }
            }
            if (resolved == false) {
                for (let i = 0; i < forbidden_words.length; i++) {
                    if (resolved == true) break;
                    let word = forbidden_words[i];
                    for (let j = 0; j < another_test_list.length; j++) {
                        if (resolved == true) break;
                        if (another_test_list[j] == word) {
                            let show_word = "";
                            for (let found = 0; found < word.length; found++) {
                                if (found % 2 == 1) {
                                    show_word += "\\*";
                                } else {
                                    show_word += forbidden_words[i][found];
                                }
                            }
                            interaction.editReply(`Topic contains forbidden word:${show_word}/偵測到被禁止的字:${show_word}`);
                            resolved = true;
                            resolve(true);
                            break;
                        }
                    }
                }
            }
            if (resolved == false) {
                let bypass_words = [
                    "cucumber"
                ];
                let bypass_wordstxt = fs.readFileSync("./source/words.txt", "utf8").toLowerCase().split("\n");
                for (let i = 0; i < forbidden_words.length; i++) {
                    if (resolved == true) break;
                    let word = forbidden_words[i];
                    for (let j = 0; j < clean_word_array.length; j++) {
                        if (resolved == true) break;
                        if (clean_word_array[j].search(word) != -1 && bypass_words.includes(clean_word_array[j]) == false && bypass_wordstxt.includes(clean_word_array[j]) == false) {
                            let show_word = "";
                            for (let found = 0; found < word.length; found++) {
                                if (found % 2 == 1) {
                                    show_word += "\\*";
                                } else {
                                    show_word += forbidden_words[i][found];
                                }
                            }
                            interaction.editReply(`Topic contains forbidden word:${show_word}/偵測到被禁止的字:${show_word}\nIf you think this is an error, please use /suggest to allow this word.`);
                            resolved == true;
                            resolve(true);
                            break;
                        }
                    }
                }
            }
            if (resolved == false) resolve(false);
        });
        await please_wait.then(async (result) => {
            if (result == false) {
                const images = await GOOGLE_IMG_SCRAP({
                    search: interaction.options.getString("topic"),
                    limit: 20,
                    execute: function (element) {
                        if (!element.url.toLowerCase().endsWith("svg")) return element;
                    },
                });
                let file_extents = [
                    ".gif",
                    ".jpg",
                    ".jpeg",
                    ".jfif",
                    ".pjpeg",
                    ".pjp",
                    ".png",
                    ".webp",
                    ".apng",
                    ".avif"
                ];
                let location = Math.floor(Math.random() * images.result.length);
                log(`Image: ${images.result[location].url}`);
                if (file_extents.filter(x => images.result[location].url.toLowerCase().endsWith(x)).length == 0) {
                    await interaction.editReply(images.result[location].url);
                } else {
                    await interaction.editReply({ files: [{ attachment: images.result[location].url }] });
                }
            }
        });
    } catch (e) {
        await interaction.editReply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${e}`);
        console.error(e);
    }
}