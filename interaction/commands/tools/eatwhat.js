import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import { log } from "../../../utils/Log.js";

export const data = new SlashCommandBuilder()
    .setName("eatwhat")
    .setDescription("Help you to decide what to eat today\n幫你決定今天吃什麽")
    .addSubcommand(subcommand =>
        subcommand.setName("add")
            .setDescription("Add a new food to the list that might be chosen for your meal/將食物添加到可能為你的餐點選擇的列表中")
            .addStringOption(option =>
                option.setName("food")
                    .setDescription("The name of the food(use , to separate names if more than one)/食物的名稱(如果添加多個名稱，使用,分隔名稱)")
                    .setRequired(true)
            )
            .addBooleanOption(option =>
                option.setName("ephemeral")
                    .setDescription("Only you can see this message")
                    .setRequired(false)))
    .addSubcommand(subcommand =>
        subcommand.setName("remove")
            .setDescription("Remove food from the list that might be chosen for your meal/從可能為您的餐點選擇的列表中刪除食物")
            .addStringOption(option =>
                option.setName("food")
                    .setDescription("The name of the food (use,to separate names or type all to remove all)/食物的名稱(使用,分隔名稱或輸入all移除所有食物)")
                    .setRequired(true))
            .addBooleanOption(option =>
                option.setName("ephemeral")
                    .setDescription("Only you can see this message/只有你能看得到此訊息")
                    .setRequired(false)))
    .addSubcommand(subcommand =>
        subcommand.setName("list")
            .setDescription("Show the list of the food you added/顯示你已添加的食物列表")
            .addBooleanOption(option =>
                option.setName("ephemeral")
                    .setDescription("Only you can see this message/只有你能看得到此訊息")
                    .setRequired(false)))
    .addSubcommand(subcommand =>
        subcommand.setName("run")
            .setDescription("Let the bot decide what to eat for you./讓機器人隨機選擇一個食物")
            .addBooleanOption(option =>
                option.setName("ephemeral")
                    .setDescription("Only you can see this message/只有你能看得到此訊息")
                    .setRequired(false)));

export const guild = true;

export async function execute(interaction) {
    if (interaction.options._subcommand == "list") {
        fs.readFile("./json/Config.json", "utf8", async function readFileCallback(err, data) {
            if (err) {
                await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${err}`);
                return;
            } else {
                try {
                    let obj = await JSON.parse(data);
                    for (let i = 0; i < obj["Choices"].length; i++) {
                        if (obj["Choices"][i]["id"] == interaction.user.id && obj["Choices"][i]["food"].length != 0) {
                            let foods = "";
                            for (let j = 0; j < obj["Choices"][i]["food"].length; j++) {
                                if (foods == "") {
                                    foods += obj["Choices"][i]["food"][j];
                                } else {
                                    foods += ", " + obj["Choices"][i]["food"][j];
                                }
                            }
                            await interaction.reply({ content: `These are the food you have added/你已添加以下食物: ${foods}`, ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? true : interaction.options.getBoolean("ephemeral") });
                            return;
                        }
                    }
                    const Embed = new EmbedBuilder()
                        .setTitle("You haven't add anything to the list/你還沒添加任何東西")
                        .setColor(0x00FFFF)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                    return;
                } catch (e) {
                    console.error(e);
                    log(`\n\n ${String(err)}`);
                }
            }
        });
    } else if (interaction.options._subcommand == "add") {
        let foods = interaction.options.getString("food");
        foods = foods.split(",");
        for (let i = 0; i < foods.length; i++) {
            foods[i] = foods[i].trim().toLowerCase();
        }
        fs.readFile("./json/Config.json", "utf8", async function readFileCallback(err, data) {
            if (err) {
                await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${err}`);
                return;
            } else {
                try {
                    let obj = await JSON.parse(data);
                    let idfound = false;
                    for (let i = 0; i < obj["Choices"].length; i++) {
                        if (obj["Choices"][i]["id"] == interaction.user.id) {
                            let lst = obj["Choices"][i]["food"];
                            for (let i = 0; i < foods.length; i++) {
                                lst.push(foods[i]);
                            }
                            obj["Choices"][i]["food"] = lst;
                            idfound = true;
                            break;
                        }
                    }
                    if (idfound == false) {
                        let newobj = `{"id":"${interaction.user.id}","food": [`;
                        foods.forEach((food) => {
                            newobj += `"${food}"`;
                        });
                        newobj += "]}";
                        newobj = JSON.parse(newobj);
                        obj["Choices"].push(newobj);
                    }
                    let json = JSON.stringify(obj, null, 4);
                    fs.writeFile("./json/Config.json", json, "utf8", async (err) => {
                        if (err) throw err;
                    });
                    const Embed = new EmbedBuilder()
                        .setTitle("The list of your food has been updated./你的食物清單已更新")
                        .setColor(0x00FFFF)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                } catch (e) {
                    try {
                        await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${e}`);
                    } catch (err) {
                        await interaction.followUp(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${e}`);
                    }
                }
            }
        });
    } else if (interaction.options._subcommand == "remove") {
        let foods = interaction.options.getString("food");
        foods = foods.split(",");
        for (let i = 0; i < foods.length; i++) {
            foods[i] = foods[i].trim().toLowerCase();
        }
        fs.readFile("./json/Config.json", "utf8", async function readFileCallback(err, data) {
            if (err) {
                await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${err}`);
                return;
            } else {
                try {
                    let obj = await JSON.parse(data);
                    let idfound = false;
                    for (let i = 0; i < obj["Choices"].length; i++) {
                        if (obj["Choices"][i]["id"] == interaction.user.id) {
                            if (interaction.options.getString("food").trim().toLowerCase() == "all") {
                                obj["Choices"][i]["food"] = [];
                            } else {
                                for (let j = 0; j < foods.length; j++) {
                                    let index = obj["Choices"][i]["food"].indexOf(foods[j]);
                                    if (index > -1) {
                                        await obj["Choices"][i]["food"].splice(index, 1);
                                    } else {
                                        await interaction.reply("Food not found, if you want to see what food you have added use command eatwhat list\n找不到食物，你可以使用/eatwhat list獲取你的食物清單");
                                        return;
                                    }
                                }
                            }
                            idfound = true;
                            break;
                        }
                    }
                    let json = JSON.stringify(obj, null, 4);
                    fs.writeFile("./json/Config.json", json, "utf8", async (err) => {
                        if (err) throw err;
                    });
                    if (idfound == true) {
                        const Embed = new EmbedBuilder()
                            .setTitle("The list of your food has been updated./你的食物清單已更新")
                            .setColor(0x00FFFF)
                            .setTimestamp(Date.now())
                            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                        await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                    } else {
                        const Embed = new EmbedBuilder()
                            .setTitle("You haven't add anything to the list/你還沒添加任何東西")
                            .setColor(0x00FFFF)
                            .setTimestamp(Date.now())
                            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                        await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                    }
                } catch (e) {
                    try {
                        await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${e}`);
                    } catch (err) {
                        await interaction.followUp(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${e}`);
                    }
                }
            }
        });
    } else if (interaction.options._subcommand == "run") {
        fs.readFile("./json/Config.json", "utf8", async function readFileCallback(err, data) {
            if (err) {
                await interaction.reply(`Something went wrong during execution of \`${interaction.commandName}\`.\nError: ${err}`);
                return;
            } else {
                try {
                    let obj = JSON.parse(data);
                    for (let i = 0; i < obj["Choices"].length; i++) {
                        if (obj["Choices"][i]["id"] == interaction.user.id && obj["Choices"][i]["food"].length != 0) {
                            let result = Math.random();
                            for (let j = 0; j < 100; j++) {
                                result = Math.random();
                            }
                            result *= obj["Choices"][i]["food"].length;
                            const Embed = new EmbedBuilder()
                                .setTitle(`The bot has decided you to eat **${obj["Choices"][i]["food"][Math.floor(result)]}** this time!\n機器人決定你這次吃**${obj["Choices"][i]["food"][Math.floor(result)]}**`)
                                .setColor(0xfcc603)
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                            await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? true : interaction.options.getBoolean("ephemeral") });
                            return;
                        }
                    }
                    const Embed = new EmbedBuilder()
                        .setTitle("You haven't add anything to the list/你還沒添加任何東西")
                        .setColor(0x00FFFF)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                } catch (e) {
                    const Embed = new EmbedBuilder()
                        .setTitle("You haven't add anything to the list/你還沒添加任何東西")
                        .setColor(0x00FFFF)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
                }
            }
        });
    }
}