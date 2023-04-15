"use strict";
let init_time = Date.now();
console.log("----------------------------\n|          status⚠️         |\n----------------------------");
import fs from "fs";
console.log("|  node  modules imported ✅|\n");
import {config} from "dotenv";
console.log("|    dotenv    imported   ✅|\n");
import {REST} from "@discordjs/rest";
import {Client, Routes, EmbedBuilder, Partials, Collection} from "discord.js";
console.log("|    discord.js   imported✅|\n");
import {DisTube} from "distube";
import {SpotifyPlugin} from "@distube/spotify";
console.log("|    DisTube   imported   ✅|\n");
import Canvas from "canvas";
console.log("|     canvas   imported   ✅|\n");
import {generateResponse} from "./utils/OpenAi.js";
import {log} from "./utils/Log.js";
import {get_warnings} from "./utils/get_warnings.js";
import {change_date, change_time, change_status} from "./utils/channelNameUpdate.js";
import {memes} from "./utils/memes.js";
import {helpRow} from "./utils/help.js";
import {user_ids} from "./json/user_ids.js";
console.log("|     utils    imported   ✅|\n");

console.log("----------------------------\n|      initializing...     |");
config();
fs.writeFileSync("./logs/Last.log",fs.readFileSync("./logs/Latest.log"));
fs.writeFileSync("./logs/Latest.log","");
const TOKEN = process.env.DiscordBotToken;
const client = new Client({
    intents: 131071,
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    partials: [Partials.Message, Partials.Channel]
});
client.DisTube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});
client.commands = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.buttons = new Collection();
client.categories = [];
client.buttonNames = [];
let changed_commands = [];
const loadCommands = (folderPath, category) => {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = `${folderPath}/${file}`;
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            client.categories.push(file);
            loadCommands(filePath, file);
        } else if (file.endsWith(".js")) {
            import(filePath).then((command) => {
                if (command.execute!=undefined) changed_commands.push(command.data.name);
                client.commands.set(command.data.name, {command, category});
            });
        } else {
            throw new Error("import non-js file");
        }
    }
};
loadCommands("./interaction/commands");
let files = fs.readdirSync("./interaction/modals");
for (const file of files) {
    if (file.endsWith(".js")) {
        import(`./interaction/modals/${file}`).then((modal) => {
            client.modals.set(modal.customId, modal);
        });
    } else {
        throw new Error("import non-js file");
    }
}
files = fs.readdirSync("./interaction/selectMenu");
for (const file of files) {
    if (file.endsWith(".js")) {
        import(`./interaction/selectMenu/${file}`).then((selectMenu) => {
            client.selectMenus.set(selectMenu.customId, selectMenu);
        });
    } else {
        throw new Error("import non-js file");
    }
}
files = fs.readdirSync("./interaction/buttons");
for (const file of files) {
    if (file.endsWith(".js")) {
        import(`./interaction/buttons/${file}`).then((button) => {
            client.buttons.set(button.customId, button);
            client.buttonNames.push(button.customId);
        });
    } else {
        throw new Error("import non-js file");
    }
}
client.bot_a = false;
client.bot_s = false;
client.bot_a_timeleft = 0;
client.bot_s_timeleft = 0;
client.game_number = {};
client.game_number_small = {};
client.game_number_big = {};
client.game_on_progress = {};
client.game_timeout = {};
client.game_reply = {};
client.tictactoe_players = [];
client.tictactoe_pending = [];
client.chatgptlist = [];
client.suggestcooldownlist = [];
client.lockdown = false;
const rest = new REST({ version: "10" }).setToken(TOKEN);
let generatingText = false;
let commands = [];
let welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024, 500);
welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
welcomeCanvas.context.font = "72px DejaVu Sans";
welcomeCanvas.context.fillStyle = "#ffffff";
Canvas.loadImage("./source/bg.png")
    .then(async (img) => welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500));
console.log("|initialization successful✅|\n----------------------------");

client.DisTube.on("initQueue", queue => queue.volume = 25);

client.DisTube.on("playSong", async (queue, song) => {
    log(`Playing ${song.name}-${song.url} requested by ${song.user.tag} at ${queue.textChannel.guild.name} #${queue.voiceChannel.name}`);
    const embed = new EmbedBuilder()
        .setDescription(`🎶Currently playing [${song.name}](${song.url})\n\n`)
        .setThumbnail(song.thumbnail)
        .addFields({ name: "Duration", value: song.formattedDuration })
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${song.user.tag}`, iconURL: song.user.displayAvatarURL() });
    await queue.textChannel.send({ embeds: [embed] });
});

client.DisTube.on("addSong", async (queue, song) => {
    log(`${song.name} (${song.url}) added to the queue of ${queue.textChannel.guild.name} requested by ${song.user.tag}`);
    const embed = new EmbedBuilder()
        .setDescription(`✅**[${song.name}](${song.url})**\nhas been added to the Queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.formattedDuration}` })
        .setTimestamp(Date.now());
    await queue.textChannel.send({ embeds: [embed] });
});

client.DisTube.on("addList", async (queue, playlist) => {
    log(`${playlist.name} (${playlist.url}) added to the queue of ${queue.textChannel.guild.name} requested by ${playlist.user.tag}`);
    const embed = new EmbedBuilder()
        .setDescription(`🎶**${playlist.songs.length} songs from [${playlist.name}](${playlist.url})**\nhas been added to the Queue`)
        .setThumbnail(playlist.thumbnail.url);
    await queue.textChannel.send({ embeds: [embed] });
});

client.DisTube.on("empty", async (queue) => {
    log(`#${queue.voiceChannel.name} at ${queue.voiceChannel.guild.name} is empty!`);
    await queue.voiceChannel.send("Channel is empty! Ending current queue...");
});

client.DisTube.on("searchNoResult", async (message, query) => {
    log(`SearchNoResult! | Query: ${query} | Requested by: ${message.author.tag}`);
    await message.channel.send("🚫 No result found for " + query + "!");
});

client.DisTube.on("finish", async queue => {
    log(`Finish playing all the songs in ${queue.textChannel.guild.name} #${queue.voiceChannel.name}`);
    await queue.textChannel.send("All the songs have finished playing!");
});

client.DisTube.on("error", (channel, e) => {
    console.error(e);
    log(`\n\n ${String(e)}`);
});

client.once("ready", async () => {
    let login_time = Date.now();
    console.log(`Logged in as ${client.user.tag}`);
    log(`Logged in as ${client.user.tag}`);
    await reg();
    console.log(`Startup time taken: ${((login_time - init_time) / 1000).toFixed(3)}s`);
    log(`Startup time taken: ${((login_time - init_time) / 1000).toFixed(3)}s`);
    init_time = undefined;
    client.user.setActivity("/help", {type: 2});
    let data = JSON.parse(fs.readFileSync("./json/Config.json"));
    let file_red = data["Restart"];
    if (file_red["Time"] != 0 && file_red["Message"] != "") {
        let m = file_red["Message"].split("||")[0];
        let c = file_red["Message"].split("||")[1];
        file_red["Message"] = "";
        client.channels.fetch(c).then(async (channel) => {
            channel.messages.fetch(m).then(async (message) => {
                const Embed = new EmbedBuilder()
                    .setTitle("Restarted")
                    .setDescription(`Time taken: ${((login_time - file_red["Time"]) / 1000).toFixed(3)}s`)
                    .setColor(0x00FFFF)
                    .setTimestamp(Date.now());
                await message.edit({ content: "", embeds: [Embed] });
                file_red["Time"] = 0;
                data["Restart"] = file_red;
                data = JSON.stringify(data, null, 4);
                fs.writeFileSync("./json/Config.json", data);
            });
        });
    }
    let my_server = await client.guilds.fetch(process.env.MyServerID);
    setTimeout(()=>{
        change_time(my_server);
        setInterval(()=>change_time(my_server),1000*60*5);
    },1000*60*(5-((parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[1]))%5)-1)+(60-(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[2]))*1000);
    setTimeout(()=>{
        change_date(my_server);
        setInterval(()=>change_date(my_server),1000*60*60*24);
    },1000*60*60*(24-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[0])-1)+1000*60*(60-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[1])-1)+1000*(60-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[2])));
    setTimeout(async()=>{
        memes(client);
        setInterval(async()=> memes(client),1000*60*60*24);
    },1000*60*60*(parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[0])>=22?46-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[0])-1:22-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[0])-1)+1000*60*(60-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[1])-1)+1000*(60-parseInt(new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].split(":")[2])));
    setInterval(async () => {
        let warns = await get_warnings();
        warns = warns.split(", ");
        const match = warns.find(element => {
            if (element.includes("No. 8")) return true;
        });
        if (match) {
            let file = fs.readFileSync("./json/Config.json");
            log(`Sending issued No.8 warnings of HKO | Warnings: ${match}`);
            let data = JSON.parse(file)["HKWeather"];
            if (data["No8"] == "sent") return;
            else {
                const thumbnailMap = {
                    "northeast": "https://www.hko.gov.hk/textonly/img/warn/tc8ne.gif",
                    "northwest": "https://www.hko.gov.hk/textonly/img/warn/tc8nw.gif",
                    "southeast": "https://www.hko.gov.hk/textonly/img/warn/tc8se.gif",
                    "southwest": "https://www.hko.gov.hk/textonly/img/warn/tc8sw.gif"
                };
                let thumbnailurl = "https://www.hko.gov.hk/textonly/images_e/logo_dblue.gif";
                for (const key of Object.keys(thumbnailMap)) {
                    if (match.toLowerCase().includes(key)) {
                        thumbnailurl = thumbnailMap[key];
                        break;
                    }
                }
                let embed = new EmbedBuilder()
                    .setTitle(`${match}\nhas been issued by Hong Kong Observatory`)
                    .setColor(0x0390fc)
                    .setTimestamp(Date.now())
                    .addFields({ name: "Hong Kong Observatory", value: "[Click Me!](https://www.hko.gov.hk/tc/index.html)" }, { name: "Hong Kong Government Education Bureau", value: "[Click Me!](https://www.edb.gov.hk/tc/index.html)" })
                    .setThumbnail(thumbnailurl);
                await client.channels.fetch(process.env.ChatGPTChannelID).then(channel => channel.send({ embeds: [embed] }));
                data["No8"] = "sent";
                let temp_data = JSON.parse(file);
                temp_data["HKWeather"] = data;
                data = JSON.stringify(temp_data,null,4);
                fs.writeFileSync("./json/Config.json", data);
            }
        } else {
            let data = JSON.parse(fs.readFileSync("./json/Config.json"));
            if (data["HKWeather"]["No8"] == "sent") {
                data["HKWeather"]["No8"] = null;
                data = JSON.stringify(data,null,4);
                fs.writeFileSync("./json/Config.json", data);
            } else {
                return;
            }
        }
    }, 1000 * 60 * 5);
    setInterval(async () => await change_status(my_server), 1000 * 60 * 5);
    setInterval(() => client.user.setActivity("/help", {type: 2}), 1000 * 60 * 60 * 2);
});

client.on("rateLimit", async(data)=>{
    await client.users.fetch(process.env.MyUserID).then(async user=> await user.send(`The bot is being rate limited.\nTimeout: ${data.timeout}\nLimit: ${data.limit}\nMethod: ${data.method}\nPath: ${data.path}\nRoute: ${data.route}\nGlobal: ${data.global}`));
    console.error(data);
});

client.on("messageCreate", async (ctx) => {
    try {
        if (ctx.author.id != client.user.id && ctx.guild != null && ctx.content) log(`${ctx.author.tag} at ${ctx.guild.name} #${ctx.channel.name}: ${ctx.content.replaceAll("\n","\\n")}`);
        else if (ctx.author.id != client.user.id && ctx.guild == null) {
            if (ctx.partial) {
                ctx.fetch();
            }
            if (ctx.content) log(`${ctx.author.tag} at direct message: ${ctx.content.replaceAll("\n","\\n")}`);
        }
    } catch (e) {
        console.error(e);
        log(`\n\n ${String(e)}`);
    }
    try {
        if (client.game_number[ctx.guildId] != undefined && ctx.author.id != client.user.id) {
            try {
                if (isNaN(ctx.content) == false && ctx.channelId == client.game_on_progress[ctx.guildId].interaction.channelId) {
                    let number = parseInt(ctx.content);
                    if (number == client.game_number[ctx.guildId]) {
                        await ctx.delete();
                        if (client.game_reply[ctx.guildId] == false) await client.game_on_progress[ctx.guildId].edit({ content: `<@${ctx.author.id}> is the winner!/贏了！ The number is ${number}!/數字是${number}` });
                        else await client.game_on_progress[ctx.guildId].interaction.editReply({ content: `<@${ctx.author.id}> is the winner!/贏了！ The number is ${number}!/數字是${number}` });
                        client.game_number[ctx.guildId] = undefined;
                        client.game_number_small[ctx.guildId] = undefined;
                        client.game_number_big[ctx.guildId] = undefined;
                        client.game_on_progress[ctx.guildId] = undefined;
                        client.game_timeout[ctx.guildId] = undefined;
                        return;
                    }
                    if (number < client.game_number[ctx.guildId] && number > client.game_number_small[ctx.guildId]) {
                        await ctx.delete();
                        if (client.game_reply[ctx.guildId] == false) await client.game_on_progress[ctx.guildId].edit({ content: `That's a wrong number! ${number}-${client.game_number_big[ctx.guildId]}\n那不是正確的數字！請在${number}和${client.game_number_big[ctx.guildId]}之間猜一個數字` });
                        else await client.game_on_progress[ctx.guildId].interaction.editReply({ content: `That's a wrong number! ${number}-${client.game_number_big[ctx.guildId]}\n那不是正確的數字！請在${number}和${client.game_number_big[ctx.guildId]}之間猜一個數字` });
                        client.game_number_small[ctx.guildId] = number;
                    } else if (number > client.game_number[ctx.guildId] && number < client.game_number_big[ctx.guildId]) {
                        await ctx.delete();
                        if (client.game_reply[ctx.guildId] == false) await client.game_on_progress[ctx.guildId].edit({ content: `That's a wrong number! ${client.game_number_small[ctx.guildId]}-${number}\n那不是正確的數字！請在${client.game_number_small[ctx.guildId]}和${number}之間猜一個數字` });
                        else await client.game_on_progress[ctx.guildId].interaction.editReply({ content: `That's a wrong number! ${client.game_number_small[ctx.guildId]}-${number}\n那不是正確的數字！請在${client.game_number_small[ctx.guildId]}和${number}之間猜一個數字` });
                        client.game_number_big[ctx.guildId] = number;
                    } else {
                        await ctx.delete();
                        if (client.game_reply == false) await client.game_on_progress[ctx.guildId].edit({ content: `Invalid number! ${client.game_number_small[ctx.guildId]}-${client.game_number_big[ctx.guildId]}\n無效的數字！請在${client.game_number_small[ctx.guildId]}和${client.game_number_big[ctx.guildId]}之間猜一個數字` });
                        else await client.game_on_progress[ctx.guildId].interaction.editReply({ content: `Invalid number! ${client.game_number_small[ctx.guildId]}-${client.game_number_big[ctx.guildId]}\n無效的數字！請在${client.game_number_small[ctx.guildId]}和${client.game_number_big[ctx.guildId]}之間猜一個數字` });
                    }
                    client.game_timeout[ctx.guildId] += 30;
                    if (client.game_number_big[ctx.guildId] - client.game_number_small[ctx.guildId] == 2) {
                        if (client.game_reply[ctx.guildId] == false) await client.game_on_progress[ctx.guildId].edit({ content: `Everyone lose! The number is ${client.game_number_big[ctx.guildId] - 1}!\n所有人都輸了！數字是${client.game_number_big[ctx.guildId] - 1}！` });
                        else await client.game_on_progress[ctx.guildId].interaction.editReply({ content: `Everyone lose! The number is ${client.game_number_big[ctx.guildId] - 1}!\n所有人都輸了！數字是${client.game_number_big[ctx.guildId] - 1}！` });
                        client.game_number[ctx.guildId] = undefined;
                        client.game_number_small[ctx.guildId] = undefined;
                        client.game_number_big[ctx.guildId] = undefined;
                        client.game_on_progress[ctx.guildId] = undefined;
                        client.game_timeout[ctx.guildId] = undefined;
                    }
                }
            } catch (err) {
                try {
                    if (err.rawError.code == 10008) {
                        client.game_on_progress[ctx.guildId] = await ctx.channel.send({ content: `Guess a number! ${client.game_number_small[ctx.guildId]}-${client.game_number_big[ctx.guildId]}\n在${client.game_number_small[ctx.guildId]}和${client.game_number_big[ctx.guildId]}之間猜一個數字！` });
                        client.game_reply[ctx.guildId] = false;
                    }
                } catch (errpr) {
                    console.error(err);
                }
            }
        } else if (ctx.content==`<@${process.env.DiscordBotID}>`&&ctx.author.id!=client.user.id&&!ctx.author.bot) {
            await ctx.reply({content:"Hi! How can I help you? :p",components:[helpRow],ephemeral:true});
            return;
        } else if (ctx.guild==null&&ctx.content!=undefined&&!isNaN(ctx.content)&&ctx.author.id!=client.user.id) {
            let file_data = JSON.parse(fs.readFileSync("./json/Config.json", "utf8"));
            let verify_file = file_data["Verify"];
            if (verify_file[0]["users"][`${ctx.author.id}`]==undefined) return;
            if (verify_file[0]["users"][`${ctx.author.id}`]!=parseInt(ctx.content)) {
                await ctx.reply("You failed the verification. Please click the verify button again to verify.\n你未通過驗證。請再次點擊驗證按鈕進行驗證。");
            } else {
                await ctx.reply("You passed the verification!\n您通過了驗證！");
                let server = await client.guilds.fetch(process.env.MyServerID);
                server.members.removeRole({user: ctx.author,role: server.roles.cache.find(role=> role.id==process.env.QuarantineRole)});
            }
            verify_file[0]["users"][`${ctx.author.id}`] = undefined;
            file_data["Verify"] = verify_file;
            fs.writeFileSync("./json/Config.json", JSON.stringify(file_data,null,4));
        }
        if (!ctx.author.bot&&ctx.channelId==process.env.ChatGPTChannelID) {
            let chatjson = JSON.parse(fs.readFileSync("./json/Chat.json"));
            while (JSON.stringify(chatjson).length>=2500) {
                chatjson.splice(1,1);
            }
            fs.writeFileSync("./json/Chat.json",JSON.stringify(chatjson,null,4));
            chatjson = JSON.parse(fs.readFileSync("./json/Chat.json"));
            chatjson.push({
                "role": "user",
                "content": ctx.content.replaceAll(`<@${process.env.DiscordBotID}>`,"ChatGPT")
            });
            fs.writeFileSync("./json/Chat.json",JSON.stringify(chatjson,null,4));
            if (ctx.content.includes(`<@${process.env.DiscordBotID}>`)) {
                try {
                    chatjson = JSON.parse(fs.readFileSync("./json/Chat.json"));
                    const gpt_response = await generateResponse(chatjson,generatingText);
                    await ctx.reply(gpt_response);
                    chatjson.push({
                        "role": "assistant",
                        "content": gpt_response
                    });
                    while (JSON.stringify(chatjson).length>=2500) {
                        chatjson.splice(1,1);
                    }
                    fs.writeFileSync("./json/Chat.json",JSON.stringify(chatjson,null,4));
                } catch (e) {
                    generatingText = false;
                    await ctx.reply(`Error occured when generating chatGPT response\nError:${e}\nTest msg:${e.response}`);
                    chatjson = JSON.parse(fs.readFileSync("./json/Chat.json"));
                    chatjson.push({
                        "role": "assistant",
                        "content": "Error"
                    });
                    fs.writeFileSync("./json/Chat.json",JSON.stringify(chatjson,null,4));
                    console.error(e);
                }
            }
        }
    } catch (e) {
        console.error(e);
        log(`\n\n ${String(e)}`);
    }
});

client.on("guildMemberAdd", async (ctx) => {
    if (ctx.guild.id == process.env.MyServerID) {
        await ctx.guild.members.addRole({user: ctx,role: ctx.guild.roles.cache.find(role=> role.id==process.env.QuarantineRole)});
        log(`Sending new banners with welcome message in ${ctx.guild.name}`);
        let welcome_banner = welcomeCanvas;
        welcome_banner.context.beginPath();
        welcome_banner.context.arc(512, 166, 128, 0, Math.PI * 2, true);
        welcome_banner.context.stroke();
        welcome_banner.context.fill();
        welcome_banner.context.textAlign = "center";
        welcomeCanvas.context.font = "48px Noto Sans HK";
        welcome_banner.context.fillText(`${ctx.user.tag} just joined the server`, 512, 380);
        welcome_banner.context.font = "32px DejaVu Sans";
        welcome_banner.context.fillText(`Member #${ctx.guild.memberCount + 1}`, 512, 425);
        welcome_banner.context.beginPath();
        welcome_banner.context.arc(512, 166, 119, 0, Math.PI * 2, true);
        welcome_banner.context.closePath();
        welcome_banner.context.clip();
        let user_avatar = ctx.user.displayAvatarURL({ extension: "png", dynamic: false, size: 1024 });
        await Canvas.loadImage(user_avatar).then(async img => { welcome_banner.context.drawImage(img, 393, 47, 238, 238); });
        await client.channels.fetch(process.env.MyServerWelcomeChannelID).then(async (channel) => {
            await channel.send({ content: `Hey <@${ctx.user.id}>, welcome to **${ctx.guild.name}** ! <a:idiotcat:875166689933815848> <a:dancingidk:875177936901247007> <a:meow:875178156942839909> <a:rainbowsheep:875178121895227412> <:ohhhhhhh:875171913624875009> <a:clapclapclap:875171998551146546>`, files: [{ attachment: welcome_banner.create.toBuffer(), name: `welcome-${ctx.id}.png` }] });
        });
        let status_json = fs.readFileSync("./json/Config.json");
        status_json = JSON.parse(status_json);
        status_json["Stats"][0]["Members"]++;
        fs.writeFileSync("./json/Config.json", JSON.stringify(status_json,null,4));
        ctx.guild.channels.fetch(process.env.TotalMembersChannelID).then(async channel=> {
            await channel.edit({name: `Total Members: ${status_json["Stats"][0]["Members"]}`});
            log("Edited Total Members");
        });
        if (ctx.user.bot) {
            status_json["Stats"][0]["Bot"]++;
            fs.writeFileSync("./json/Config.json", JSON.stringify(status_json,null,4));
            ctx.guild.channels.fetch(process.env.BotChannelID).then(async channel=> {
                await channel.edit({name: `Bot: ${status_json["Stats"][0]["Bot"]}`});
                log("Edited total number of Bot");
            });
        } else {
            ctx.guild.channels.fetch(process.env.UsersChannelID).then(async channel=> {
                await channel.edit({name: `Users: ${status_json["Stats"][0]["Members"]-status_json["Stats"][0]["Bot"]}`});
                log("Edited total number of Users");
            });
        }
    }
});

client.on("guildMemberRemove", async (ctx) => {
    log(`Sending goodbye message to ${ctx.user.tag} in ${ctx.guild.name}`);
    if (ctx.guild.id == process.env.MyServerID) {
        await client.channels.fetch(process.env.MyServerWelcomeChannelID).then(async (channel) => {
            await channel.send(`**${ctx.user.tag}** just left the server<a:feelsbadman:875175976106065921> 😢`);
        });
        let status_json = fs.readFileSync("./json/Config.json");
        status_json = JSON.parse(status_json);
        status_json["Stats"][0]["Members"]--;
        fs.writeFileSync("./json/Config.json", JSON.stringify(status_json,null,4));
        await ctx.guild.channels.fetch(process.env.TotalMembersChannelID).then(async channel=> {
            await channel.edit({name: `Total Members: ${status_json["Stats"][0]["Members"]}`});
            log("Edited Total Members");
        });
        if (ctx.user.bot) {
            status_json["Stats"][0]["Bot"]--;
            fs.writeFileSync("./json/Config.json", JSON.stringify(status_json,null,4));
            await ctx.guild.channels.fetch(process.env.BotChannelID).then(async channel=> {
                await channel.edit({name: `Bot: ${status_json["Stats"][0]["Bot"]}`});
                log("Edited total number of Bot");
            });
        } else {
            await ctx.guild.channels.fetch(process.env.UsersChannelID).then(async channel=> {
                await channel.edit({name: `Users: ${status_json["Stats"][0]["Members"]-status_json["Stats"][0]["Bot"]}`});
                log("Edited total number of Users");
            });
        }
    }
});

client.on("voiceStateUpdate", async (oldmember, newmember) => {
    if (oldmember?.guild?.id == process.env.MyServerID || newmember?.guild?.id == process.env.MyServerID) {
        let new_channel = newmember.channelId;
        let old_channel = oldmember.channelId;
        if ((new_channel&&old_channel)&&old_channel!=new_channel||old_channel==null) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: `${newmember.member.user.tag}`, iconURL: `${newmember.member.user.avatarURL()}` })
                .setDescription(`📥 <@${newmember.member.user.id}> **joined voice channel** \`${newmember.channel.name}\``)
                .setTimestamp(Date.now())
                .setColor(0x44b37f);
            await client.channels.fetch(process.env.LogChannel).then(async channel => {
                await channel.send({ embeds: [embed] });
            });
        } else if (new_channel==null) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: `${oldmember.member.user.tag}`, iconURL: `${oldmember.member.user.avatarURL()}` })
                .setDescription(`📤 <@${oldmember.member.user.id}> **left voice channel** \`${oldmember.channel.name}\``)
                .setTimestamp(Date.now())
                .setColor(0xf04848);
            await client.channels.fetch(process.env.LogChannel).then(async channel => {
                await channel.send({ embeds: [embed] });
            });
        }
    }
});

client.on("messageUpdate", async (oldmsg, newmsg) => {
    try {
        if (oldmsg.partial) await oldmsg.fetch();
        if (newmsg.partial) await newmsg.fetch();
        if (newmsg.author.id != client.user.id && oldmsg.guild != null) {
            if (oldmsg.content || newmsg.content) log(`${newmsg.author.username} edited message |* ${oldmsg.content}*| at ${oldmsg.guild.name} #${oldmsg.channel.name}: ${newmsg.content}`);
        } else if (oldmsg.author.id != client.user.id && oldmsg.guild == null) {
            if (oldmsg.content || newmsg.content) log(`${newmsg.author.username} edited message *${oldmsg.content}* at direct message: ${newmsg.content}`);
        }
    } catch (e) {
        console.error(e);
        log(`\n\n ${String(e)}`);
    }
});

client.on("interactionCreate", async (ita) => {
    try {
        if (client.lockdown&&!user_ids.includes(ita.user.id)) {
            await ita.reply("The bot is currently locked down, please contact the administrator if you beilive this is an error.");
            return;
        }
        if (ita.isStringSelectMenu()) {
            const SelectMenu = client.selectMenus.get(ita.customId);
            await SelectMenu.execute(ita,client);
            return;
        }
        if (ita.isModalSubmit()) {
            const modal = client.modals.get(ita.customId);
            modal.execute(ita,client);
            return;
        }
        if (ita.isChatInputCommand()) {
            if (ita.guild) log(`${ita.user.tag} used command ${ita.commandName} in ${ita.guild.name} #${ita.channel.name}`);
            else log(`${ita.user.tag} used command ${ita.commandName} in direct message`);
            const command = client.commands.get(ita.commandName);
            if (command.command.guild&&ita.guild!=null||command.command.guild==undefined) {
                await command.command.execute(ita,client);
            } else await ita.reply("This is a guild only command./你只能在伺服器内使用此指令");
            return;
        }
        if (ita.isButton()) {
            if (ita.guild == null) log(`${ita.user.tag} interacted button ${ita.customId} in direct message`);
            else log(`${ita.user.tag} interacted button ${ita.customId} in ${ita.guild.name} #${ita.channel.name}`);
            const button = ita.customId;
            let exe = false;
            for (const buttonName of client.buttonNames) {
                if (button.startsWith(buttonName)) {
                    const button_executable = client.buttons.get(buttonName);
                    button_executable.execute(ita, client);
                    exe = true;
                    break;
                }
            }
            if (exe) return;
            const Embed = new EmbedBuilder()
                .setTitle("You do not have the required permissions to interact with this button.\n你沒有權限使用此按鈕")
                .setColor(0x00FFFF)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${ita.user.tag}`, iconURL: ita.user.displayAvatarURL() });
            await ita.reply({ content: "", embeds: [Embed], ephemeral: true });
            return;
        }
    } catch (error) {
        console.error(error);
        log(`\n\n ${String(error)}`);
        try {
            await ita.reply(`Something went wrong during execution of \`${ita.commandName||ita.customId}\`.\nError: ${error}`);
        } catch (e) {
            try {
                await ita.channel.send(`Something went wrong during execution of \`${ita.commandName||ita.customId}\`.\nError: ${error}`);
            } catch (wtf) {
                console.error(wtf);
            }
        }
    }
});

async function reg() {
    await client.commands.forEach(async command => {
        commands.push(command.command.data.toJSON());
    });
    try {
        log("Started registering application (/) commands");
        await rest.put(Routes.applicationCommands(process.env.DiscordBotID), { body: commands });
        log("Ended registering application (/) commands");
    } catch (err) {
        console.error(err);
        log(`\n\n ${String(err)}`);
        throw err;
    }
}
try {
    log("Logging in...");
    await client.login(TOKEN);
} catch (e) {
    console.error(e);
    log(`\n\n ${String(e)}`);
    throw e;
}