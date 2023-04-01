import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { get_warnings } from "../../../utils/get_warnings.js";
import { get_weather } from "../../../utils/get_weather.js";

export const data = new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get the weather information of some place in Hong Kong (default HKO)\n取得香港天氣")
    .addStringOption(option =>
        option.setName("place")
            .setDescription("The place to get weather information/取得天氣資訊的地點")
            .setRequired(false))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    let hk_place = "";
    hk_place = interaction.options.getString("place");
    if (hk_place == null || hk_place == "") {
        hk_place = "HK Observatory";
        await interaction.deferReply();
    } else if (hk_place == "Chek Lap Kok" || hk_place == "Cheung Chau" || hk_place == "Clear Water Bay" || hk_place == "Happy Valley" || hk_place == "HK Observatory" || hk_place == "HK Park" || hk_place == "Kai Tak Runway Park" || hk_place == "Kau Sai Chau" || hk_place == "King's Park" || hk_place == "Kowloon City" || hk_place == "Kwun Tong" || hk_place == "Lau Fau Shan" || hk_place == "Ngong Ping" || hk_place == "Pak Tam Chung" || hk_place == "Peng Chau" || hk_place == "Sai Kung" || hk_place == "Sha Tin" || hk_place == "Sham Shui Po" || hk_place == "Shau Kei Wan" || hk_place == "Shek Kong" || hk_place == "Sheung Shui" || hk_place == "Stanley" || hk_place == "Ta Kwu Ling" || hk_place == "Tai Lung" || hk_place == "Tai Mei Tuk" || hk_place == "Tai Mo Shan" || hk_place == "Tai Po" || hk_place == "Tate's Cairn" || hk_place == "The Peak" || hk_place == "Tseung Kwan O" || hk_place == "Tsing Yi" || hk_place == "Tsuen Wan Ho Koon" || hk_place == "Tsuen Wan Shing Mun Valley" || hk_place == "Tuen Mun" || hk_place == "Waglan Island" || hk_place == "Wetland Park" || hk_place == "Wong Chuk Hang" || hk_place == "Wong Tai Sin" || hk_place == "Yuen Long Park") {
        await interaction.deferReply();
    } else {
        await interaction.reply({ content: "Invalid place\nThe following places are available: Chek Lap Kok, Cheung Chau, Clear Water Bay, Happy Valley, HK Observatory, HK Park, Kai Tak Runway Park, Kau Sai Chau, King's Park, Kowloon City, Kwun Tong, Lau Fau Shan, Ngong Ping, Pak Tam Chung, Peng Chau, Sai Kung, Sha Tin, Sham Shui Po, Shau Kei Wan, Shek Kong, Sheung Shui, Stanley, Ta Kwu Ling, Tai Lung, Tai Mei Tuk, Tai Mo Shan, Tai Po, Tate's Cairn, The Peak, Tseung Kwan O, Tsing Yi, Tsuen Wan Ho Koon, Tsuen Wan Shing Mun Valley, Tuen Mun, Waglan Island, Wetland Park, Wong Chuk Hang, Wong Tai Sin, Yuen Long Park", ephemeral: true });
        return;
    }
    let tlst = await get_weather(hk_place);
    let temp = tlst[0];
    let h = tlst[1];
    let wind_dir = tlst[2];
    let wind = tlst[3];
    let p = tlst[4];
    let v = tlst[5];
    let well = tlst[7];
    let updte = tlst[6];
    if (h != "N/A") h += "%";
    let stri = await get_warnings();
    const Embed = new EmbedBuilder()
        .setColor(0x0390fc)
        .setTitle("🌤️Current Weather of Hong Kong/目前香港天氣")
        .setDescription(`Displaying weather information of ${hk_place}`)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/zh/thumb/1/11/Hong_Kong_Observatory_Logo_%282018%29.svg/640px-Hong_Kong_Observatory_Logo_%282018%29.svg.png")
        .addFields(
            {
                name: "Air Temperature/溫度",
                value: `${temp}°C`,
                inline: true
            },
            {
                name: "Relative Humidity/濕度",
                value: h,
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: "Wind Direction/風向",
                value: wind_dir,
                inline: true
            },
            {
                name: "Wind Speed/風速",
                value: wind,
                inline: true
            },
            {
                name: "Mean Sea Level Pressure/平均海平面壓力",
                value: p,
                inline: false
            },
            {
                name: "Visibility/能見度",
                value: v,
                inline: true
            },
            {
                name: "Weather Condition/天氣狀態",
                value: well.charAt(0).toUpperCase() + well.toLowerCase().slice(1),
                inline: false
            },
            {
                name: "Warning(s)/警告",
                value: stri,
                inline: true
            },
            {
                name: "Updated at/更新時間",
                value: updte,
                inline: false
            }
        )
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("weather_kowloon")
                .setLabel("九龍/Kowloon")
                .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("weather_hong_kong_island")
                .setLabel("香港島/Hong Kong Island")
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("weather_new_territories")
                .setLabel("新界/New Territories")
                .setStyle(ButtonStyle.Success)
        );
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("香港天文台/Hong Kong Observatory")
                .setStyle(ButtonStyle.Link)
                .setURL("https://www.hko.gov.hk/tc/index.html")
        );
    await interaction.editReply({ content: "", embeds: [Embed], components: [row,row2] });
}