import axios from "axios";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("currency_exchange")
    .setDescription("Simply exchange the currency")
    .addNumberOption(option =>
        option.setName("amount")
            .setDescription("The amount of the money/金錢數量")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("currency_1")
            .setDescription("The type of the currency of the money/原本的貨幣類型")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("currency_2")
            .setDescription("The type of the currency you want to exchange to/轉換後的貨幣類型")
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    let money = `${interaction.options.getNumber("amount")} ${interaction.options.getString("currency_1")} to ${interaction.options.getString("currency_2")}`.split(" ").join("+");
    const options = {
        url: `https://hk.search.yahoo.com/search?q=${money}`,
        method: "get",
        headers: {
            "Accept-Encoding": "application/json",
        },
        responseType: "text", // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
        //responseEncoding: "utf8",
        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: "XSRF-TOKEN", // default
        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: "X-XSRF-TOKEN", // default
        // `decompress` indicates whether or not the response body should be decompressed 
        // automatically. If set to `true` will also remove the 'content-encoding' header 
        // from the responses objects of all decompressed responses
        decompress: true // default
    };
    let r = (await axios(options)).data;
    let stri = "";
    let start = r.indexOf("<span class=\" convert-to fz-xl mb-5 v-h wob-ba\">");
    if (start === -1) stri = "Failed";
    else start += 48;
    let end = 0;
    if (start != -1) end = r.indexOf("<b>",start);
    if (end === -1) stri = "Failed";
    if (stri != "Failed") for (let i = start; i < end; i++) stri += r[i];
    if (stri == "Failed") await interaction.reply({ content: "The currency is incorrect or an error occurs, please try again." });
    else {
        const Embed = new EmbedBuilder()
            .setTitle(`💵 ${interaction.options.getString("currency_1").toUpperCase()} $${interaction.options.getNumber("amount")} = ${interaction.options.getString("currency_2").toUpperCase()} $${stri}`)
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed], ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral") });
    }
}