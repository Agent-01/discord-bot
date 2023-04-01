import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { user_ids } from "../../../json/user_ids.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName("mdn_docs")
    .setDescription("Get the documentation of javascript\n取得Javascript的文檔")
    .addStringOption(option =>
        option.setName("query")
            .setDescription("Anything related to javascript you want to search from mdn/搜尋")
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    if (!user_ids.includes(interaction.user.id)) {
        await interaction.reply("This command is currently under maintenance");
        return;
    }
    const base = "https://developer.mozilla.org";
    const uri = `${base}/api/v1/search?q=${interaction.options.getString("query")}`;
    const documents = (await axios.get(uri)).data.documents;
    if (documents && documents.length != 0) {
        let truncated = false;
        if (documents.length > 3) {
            documents.length = 3;
            truncated = true;
        }
        const embed = new EmbedBuilder()
            .setAuthor({ name: "MDN Documentation", iconURL: "https://avatars.githubusercontent.com/u/7565578?s=200&v=4" })
            .setColor(0x2296f3)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        for (let { mdn_url, title, summary } of documents) {
            summary = summary.replace(/(\r\n|\n|\r)/gm, "");
            embed.addFields({ name: title, value: `${summary}\n[**Link**](${base}${mdn_url})` });
        }
        embed.addFields({ name: truncated ? "Too many results!" : "Here you go!", value: truncated ? `View more results [here](https://developer.mozila.org/en-US/search?q=${encodeURIComponent(interaction.options.getString("query"))}).` : "All result(s) have been shown here" });
        await interaction.reply({ embeds: [embed] , ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral")});
    } else {
        await interaction.reply({content:`Could not find ${interaction.options.getString("query")}`,ephemeral:true});
    }
}