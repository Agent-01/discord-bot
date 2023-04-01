import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";

export async function execute(interaction) {
    await interaction.deferUpdate();
    const row1 = new ActionRowBuilder()
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
    await interaction.message.edit({components:[row1]});
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("香港天文台/Hong Kong Observatory")
                .setStyle(ButtonStyle.Link)
                .setURL("https://www.hko.gov.hk/tc/index.html")
        );
    await interaction.message.edit({components:[row1,row2]});
    if (interaction.customId=="weather_remove") return;
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("weather_remove")
                .setLabel("完成查詢/Query finished")
                .setStyle(ButtonStyle.Secondary)
        );
    if (interaction.customId=="weather_kowloon") {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("weather")
                    .setPlaceholder("九龍/Kowloon")
                    .addOptions(
                        {
                            label: "香港天文台/Hong Kong Observatory",
                            description: "Get the weather information of Hong Kong Observatory/取得香港天文台的天氣",
                            value: "HK Observatory"
                        },
                        {
                            label: "啟德跑道公園/Kai Tak Runway Park",
                            description: "Get the weather information of Kai Tak Runway Park/取得啟德跑道公園的天氣",
                            value: "Kai Tak Runway Park"
                        },
                        {
                            label: "京士柏公園/King's Park",
                            description: "Get the weather information of King's Park/取得京士柏公園的天氣",
                            value: "King's Park"
                        },
                        {
                            label: "九龍城/Kowloon City",
                            description: "Get the weather information of Kowloon City/取得九龍城的天氣",
                            value: "Kowloon City"
                        },
                        {
                            label: "觀塘/Kwun Tong",
                            description: "Get the weather information of Kwun Tong/取得觀塘的天氣",
                            value: "Kwun Tong"
                        },
                        {
                            label: "深水埗/Sham Shui Po",
                            description: "Get the weather information of Sham Shui Po/取得深水埗的天氣",
                            value: "Sham Shui Po"
                        },
                        {
                            label: "大老山/Tate's Cairn",
                            description: "Get the weather information of Tate's Cairn/取得大老山的天氣",
                            value: "Tate's Cairn"
                        },
                        {
                            label: "黃大仙/Wong Tai Sin",
                            description: "Get the weather information of Wong Tai Sin/取得黃大仙的天氣",
                            value: "Wong Tai Sin"
                        }
                    ),
            );
        await interaction.message.edit({components: [row1,row,row2,row3]});
    } else if (interaction.customId=="weather_hong_kong_island") {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("weather")
                    .setPlaceholder("香港島/Hong Kong Island")
                    .addOptions(                        
                        {
                            label: "跑馬地/Happy Valley",
                            description: "Get the weather information of Happy Valley/取得跑馬地的天氣",
                            value: "Happy Valley"
                        },
                        {
                            label: "香港公園/Hong Kong Park",
                            description: "Get the weather information of Hong Kong Park/取得香港公園的天氣",
                            value: "HK Park"
                        },
                        {
                            label: "筲箕灣/Shau Kei Wan",
                            description: "Get the weather information of Shau Kei Wan/取得筲箕灣的天氣",
                            value: "Shau Kei Wan"
                        },
                        {
                            label: "赤柱/Stanley",
                            description: "Get the weather information of Stanley/取得赤柱的天氣",
                            value: "Stanley"
                        },
                        {
                            label: "太平山/The Peak",
                            description: "Get the weather information of The Peak/取得太平山的天氣",
                            value: "The Peak"
                        },
                        {
                            label: "黃竹坑/Wong Chuk Hang",
                            description: "Get the weather information of Wong Chuk Hang/取得黃竹坑的天氣",
                            value: "Wong Chuk Hang"
                        }
                    ),
            );
        await interaction.message.edit({components: [row1,row,row2,row3]});
    } else if (interaction.customId=="weather_new_territories") {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("weather")
                    .setPlaceholder("新界/New Territories")
                    .addOptions(
                        {
                            label: "赤鱲角/Chek Lap Kok",
                            description: "Get the weather information of Chek Lap Kok/取得赤鱲角的天氣",
                            value: "Chek Lap Kok"
                        },
                        {
                            label: "長洲/Cheung Chau",
                            description: "Get the weather information of Cheung Chau/取得長洲的天氣",
                            value: "Cheung Chau"
                        },
                        {
                            label: "清水灣/Clear Water Bay",
                            description: "Get the weather information of Clear Water Bay/取得清水灣的天氣",
                            value: "Clear Water Bay"
                        },                        
                        {
                            label: "滘西洲/Kau Sai Chau",
                            description: "Get the weather information of Kau Sai Chau/取得滘西洲的天氣",
                            value: "Kau Sai Chau"
                        },
                        {
                            label: "流浮山/Lau Fau Shan",
                            description: "Get the weather information of Lau Fau Shan/取得流浮山的天氣",
                            value: "Lau Fau Shan"
                        },
                        {
                            label: "昂坪/Ngong Ping",
                            description: "Get the weather information of Ngong Ping/取得昂坪的天氣",
                            value: "Ngong Ping"
                        },
                        {
                            label: "北潭涌/Pak Tam Chung",
                            description: "Get the weather information of Pak Tam Chung/取得北潭涌的天氣",
                            value: "Pak Tam Chung"
                        },
                        {
                            label: "坪洲/Peng Chau",
                            description: "Get the weather information of Peng Chau/取得坪洲的天氣",
                            value: "Peng Chau"
                        },
                        {
                            label: "西貢/Sai Kung",
                            description: "Get the weather information of Sai Kung/取得西貢的天氣",
                            value: "Sai Kung"
                        },
                        {
                            label: "沙田/Sha Tin",
                            description: "Get the weather information of Sha Tin/取得沙田的天氣",
                            value: "Sha Tin"
                        },
                        {
                            label: "筲箕灣/Shau Kei Wan",
                            description: "Get the weather information of Shau Kei Wan/取得筲箕灣的天氣",
                            value: "Shau Kei Wan"
                        },
                        {
                            label: "石崗/Shek Kong",
                            description: "Get the weather information of Shek Kong/取得石崗的天氣",
                            value: "Shek Kong"
                        },
                        {
                            label: "上水/Sheung Shui",
                            description: "Get the weather information of Sheung Shui/取得上水的天氣",
                            value: "Sheung Shui"
                        },
                        {
                            label: "打鼓嶺/Ta Kwu Ling",
                            description: "Get the weather information of Ta Kwu Ling/取得打鼓嶺的天氣",
                            value: "Ta Kwu Ling"
                        },
                        {
                            label: "大隴/Tai Lung",
                            description: "Get the weather information of Tai Lung/取得大隴的天氣",
                            value: "Tai Lung"
                        },
                        {
                            label: "大尾篤/Tai Mei Tuk",
                            description: "Get the weather information of Tai Mei Tuk/取得大尾篤的天氣",
                            value: "Tai Mei Tuk"
                        },
                        {
                            label: "大帽山/Tai Mo Shan",
                            description: "Get the weather information of Tai Mo Shan/取得大帽山的天氣",
                            value: "Tai Mo Shan"
                        },
                        {
                            label: "大埔/Tai Po",
                            description: "Get the weather information of Tai Po/取得大埔的天氣",
                            value: "Tai Po"
                        },
                        {
                            label: "將軍澳/Tseung Kwan O",
                            description: "Get the weather information of Tseung Kwan O/取得將軍澳的天氣",
                            value: "Tseung Kwan O"
                        },
                        {
                            label: "青衣/Tsing Yi",
                            description: "Get the weather information of Tsing Yi/取得青衣的天氣",
                            value: "Tsing Yi"
                        },
                        {
                            label: "城門谷/Tsuen Wan Shing Mun Valley",
                            description: "Get the weather information of Tsuen Wan Shing Mun Valley/取得城門谷的天氣",
                            value: "Tsuen Wan Shing Mun Valley"
                        },
                        {
                            label: "屯門/Tuen Mun",
                            description: "Get the weather information of Tuen Mun/取得屯門的天氣",
                            value: "Tuen Mun"
                        },
                        {
                            label: "橫瀾島/Waglan Island",
                            description: "Get the weather information of Waglan Island/取得橫瀾島的天氣",
                            value: "Waglan Island"
                        },
                        {
                            label: "香港濕地公園/Wetland Park",
                            description: "Get the weather information of Wetland Park/取得香港濕地公園的天氣",
                            value: "Wetland Park"
                        },
                        {
                            label: "元朗公園/Yuen Long Park",
                            description: "Get the weather information of Yuen Long Park/取得元朗公園的天氣",
                            value: "Yuen Long Park"
                        }
                    ),
            );
        await interaction.message.edit({components: [row1,row,row2,row3]});
    }
}