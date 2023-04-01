import { SlashCommandBuilder,EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get the user info of the mentioned user.\n取得你所提及的人的資訊")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("The user you want to get his/her information(default yourself).\n提及用戶，如果沒有提供，則獲取自己的資料")
            .setRequired(false))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export const guild = true;

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
    let target = (interaction.options.getMember("user") ? interaction.options.getMember("user") : interaction.member);
    let a = await target.presence?.activities||[];
    let stri = "";
    let x = "";
    let boot = "";
    let the_roles = await target._roles;
    for (let i = the_roles.length - 1; i >= 0; i--) {
        if (i == the_roles.length - 1) stri = `<@&${the_roles[i]}>`;
        else stri += `|<@&${the_roles[i]}>`;
    }
    if (stri == "") stri = "@everyone";
    else stri += "|@everyone";
    if (await target.user.bot == false) {
        boot = "Nope";
    } else {
        boot = "Yes";
    }
    if (a.length == 0) x = "No presence";
    else {
        let lst = [
            "Playing",
            "Streaming",
            "Listening",
            "Watching",
            "",
            "Competing"
        ];
        x = lst[Number(await a[0].type)] + " " + String(await a[0].name);
    }
    const Embed = new EmbedBuilder()
        .setColor(target.roles.highest.color)
        .setTitle("User information/用戶資料")
        .setDescription(`Displaying information for ${target.user}\n正在顯示${target.user}的資料`)
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setThumbnail(await target.user.displayAvatarURL())
        .addFields({
            name: "ID",
            value: target.id,
            inline: true
        },
        {
            name: "Is Bot?/是否爲機器人",
            value: boot,
            inline: true
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true
        },
        {
            name: "Username/使用者名稱",
            value: target.user.tag,
            inline: true
        },
        {
            name: "Nickname/昵稱",
            value: (target.nickname ? await target.nickname : await target.displayName),
            inline: true
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true
        },
        {
            name: "Created At/賬號創建日期",
            value: `<t:${Math.round(await target.user.createdTimestamp / 1000)}:D>`,
            inline: true
        },
        {
            name: "Joined At/加入日期",
            value: `<t:${Math.round(await target.joinedTimestamp / 1000)}:D>`,
            inline: true
        },
        {
            name: "Boosted Since/加成日期",
            value: (await target.premiumSince != null ? `<t:${Math.round(target.premiumSinceTimestamp / 1000)}:D>` : "Not boosting./目前沒有加成"),
            inline: false
        },
        {
            name: "Top Role/最高身份組",
            value: (await target.roles.highest.id ? `<@&${await target.roles.highest.id}>` : "@everyone"),
            inline: false
        },
        {
            name: "Role(s)/身份組",
            value: stri,
            inline: false
        },
        {
            name: "Activity/活動",
            value: x,
            inline: true
        },
        {
            name: "Status/狀態",
            value: target.presence?.status=="dnd"?"Do not disturb":target.presence?.status=="idle"?"Idle":"Online"||"Offline",
            inline: true
        });
    await interaction.editReply({ content: "", embeds: [Embed] });
}