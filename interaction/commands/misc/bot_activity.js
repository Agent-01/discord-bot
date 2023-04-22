import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { user_ids } from "../../../json/user_ids.js";
import {sleep} from "../../../utils/sleep.js";

export const data = new SlashCommandBuilder()
    .setName("bot_activity")
    .setDescription("Changes the bot's activity (cooldown 30s)\n更改機器人的活動(冷卻三十秒)")
    .addIntegerOption(option =>
        option.setName("type")
            .setDescription("The type of activity the bot will change (You may need to provide a activity type)")
            .addChoices({ name: "Playing", value: 0 }, { name: "Streaming", value: 1 }, { name: "Listening", value: 2 }, { name: "Watching", value: 3 }, { name: "Clear activity", value: 4 })
            .setRequired(true))
    .addStringOption(option =>
        option.setName("activity")
            .setDescription("Example: Visual Studio Code")
            .setRequired(false))
    .addStringOption(option =>
        option.setName("url")
            .setDescription("REQUIRES IF THE TYPE IS STREAMING")
            .setRequired(false));

export const guild = true;

export async function execute(interaction, client) {
    if (!client.bot_a) {
        let find_url = "";
        if (interaction.options.getString("url") != null && interaction.options.getString("url") != "") {
            find_url = interaction.options.getString("url");
        }
        if (interaction.options.getInteger("type") == 1 && interaction.options.getString("url") == null) {
            const Embed = new EmbedBuilder()
                .setTitle("You must provide a url for Activity: Streaming")
                .setColor(0xff0000)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [Embed] });
        } else if (interaction.options.getInteger("type") == 4 && user_ids.includes(interaction.user.id) || interaction.options.getInteger("type") == 4 && interaction.user.id == interaction.guild.ownerId) {
            client.user.setActivity(null);
            const Embed = new EmbedBuilder()
                .setTitle("Cleared Activity")
                .setColor(0x5865f2)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ content: "", embeds: [Embed] });
        } else if (interaction.options.getString("activity") == null) {
            const Embed = new EmbedBuilder()
                .setTitle("You must provide activity name for changing the activity")
                .setColor(0xff0000)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [Embed] });
        } else if (interaction.options.getInteger("type") == 1 && find_url.search("youtube.com") != -1 && interaction.user.id == interaction.guild.ownerId || interaction.options.getInteger("type") == 1 && find_url.search("youtube.com") != -1 && user_ids.includes(interaction.user.id) || interaction.options.getInteger("type") == 1 && find_url.search("twitch.tv") != -1 && interaction.user.id == interaction.guild.ownerId || interaction.options.getInteger("type") == 1 && find_url.search("twitch.tv") != -1 && user_ids.includes(interaction.user.id)) {
            client.user.setActivity({
                name: interaction.options.getString("activity"),
                type: 1,
                url: interaction.options.getString("url")
            });
            const Embed = EmbedBuilder()
                .setTitle(`Activity has changed to **Streaming ${interaction.options.getString("activity")}**`)
                .setColor(0x5865f2)
                .setTimestamp(Date.now())
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ content: "", embeds: [Embed] });
        } else if (interaction.options.getInteger("type") == 1 && find_url.search("youtube.com") == -1 && find_url.search("twitch.tv") == -1) {
            await interaction.reply("You must provide a valid url for Activity: Streaming");
        } else {
            if (!user_ids.includes(interaction.user.id) && interaction.user.id != interaction.guild.ownerId) {
                if (interaction.options.getInteger("type") != 1) {
                    let lst = [
                        "Playing",
                        "Streaming",
                        "Listening",
                        "Watching",
                    ];
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`bot_activity||${interaction.options.getInteger("type")}||${interaction.options.getString("activity")}`)
                                .setLabel("Yes")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId("bot_activity no")
                                .setLabel("No")
                                .setStyle(ButtonStyle.Danger)
                        );
                    const Embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle("Change bot activity")
                        .addFields({ name: "Activity Type", value: `${interaction.options.getInteger("type")} (${lst[interaction.options.getInteger("type")]})` })
                        .addFields({ name: "Activity Name", value: interaction.options.getString("activity") })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "Waiting for approval", embeds: [Embed], components: [row] });
                } else {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`bot_activity||${interaction.options.getInteger("type")}||${interaction.options.getString("activity")}||${interaction.options.getString("url")}`)
                                .setLabel("Yes")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId("bot_activity no")
                                .setLabel("No")
                                .setStyle(ButtonStyle.Danger)
                        );
                    const Embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle("Change bot activity")
                        .addFields({ name: "Activity Type", value: `${interaction.options.getInteger("type")} (Streaming)` })
                        .addFields({ name: "Activity Name", value: interaction.options.getString("activity") })
                        .addFields({ name: "Stream URL", value: interaction.options.getString("url") })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ content: "Waiting for approval", embeds: [Embed], components: [row] });
                }
            } else {
                let lst = [
                    "Playing",
                    "Streaming",
                    "Listening",
                    "Watching",
                ];
                client.user.setActivity({
                    name: interaction.options.getString("activity"),
                    type: interaction.options.getInteger("type")
                });
                const Embed = new EmbedBuilder()
                    .setTitle(`Activity has changed to **${lst[interaction.options.getInteger("type")]} ${interaction.options.getString("activity")}**`)
                    .setColor(0x5865f2)
                    .setTimestamp(Date.now())
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ content: "", embeds: [Embed] });
            }
        }
        client.bot_a = true;
        client.bot_a_timeleft = 30;
        let masg = await interaction.followUp({ content: `Cooldown time left: ${client.bot_a_timeleft}` });
        while (client.bot_a_timeleft) {
            try {
                await sleep(1000);
                client.bot_a_timeleft -= 1;
                await masg.edit(`Cooldown time left: ${client.bot_a_timeleft}`);
            } catch (e) {
                try {
                    if (e.rawError.code == 10008) masg = await interaction.followUp({ content: `Cooldown time left: ${client.bot_a_timeleft}` });
                } catch (err) {
                    throw e;
                }
            }
        }
        client.bot_a = undefined;
        await masg.delete();
    } else {
        const Embed = new EmbedBuilder()
            .setTitle(`This command is on cooldown, please try again in ${client.bot_a_timeleft} second(s).`)
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed] });
    }
}