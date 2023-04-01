import { EmbedBuilder } from "@discordjs/builders";
import { get_weather } from "../../utils/get_weather.js";
import { get_warnings } from "../../utils/get_warnings.js";

export async function execute(interaction) {
    await interaction.deferUpdate();
    let tlst = await get_weather(interaction.values[0]);
    let temp = tlst[0];
    let h = tlst[1];
    let wind_dir = tlst[2];
    let wind = tlst[3];
    let p = tlst[4];
    let v = tlst[5];
    let well = tlst[7];
    let updte = tlst[6];
    let cartoon_no = tlst[8];
    if (h != "N/A") h += "%";
    let stri = await get_warnings();
    const Embed = new EmbedBuilder()
        .setColor(0x0390fc)
        .setTitle("🌤️Current Weather of Hong Kong/目前香港天氣")
        .setDescription(`Displaying weather information of ${interaction.message.components[1].components[0].data.placeholder.split("/")[1]+" "+interaction.values[0]}/你目前查詢緊${interaction.message.components[1].components[0].data.placeholder.split("/")[0]+(interaction.message.components[1].components[0].data.options.find((v)=> v.value==interaction.values[0])).label.split("/")[0]}`)
        .setThumbnail(`https://www.weather.gov.hk/images/HKOWxIconOutline/pic${cartoon_no}.png`)
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
    await interaction.message.edit({ content: "", embeds: [Embed], ephemeral:true});
}