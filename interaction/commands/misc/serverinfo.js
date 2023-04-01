import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get the server info of this server.\n取得這個伺服器的資料")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export const guild = true;

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean("ephemeral") == undefined ? false : interaction.options.getBoolean("ephemeral") });
    let the_owner = await interaction.guild.members.fetch(interaction.guild.ownerId);
    const Embed = new EmbedBuilder()
        .setColor(0x00FFFF)
        .setTitle(interaction.guild.name + " server information/伺服器資訊")
        .setDescription(interaction.guild.description)
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .addFields({
            name: ":crown:Owner/伺服器創建人",
            value: the_owner.user.tag
        },
        {
            name: "Server/伺服器 :id:",
            value: interaction.guildId,
        },
        {
            name: "Created At/創建時間",
            value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}:D>`,
            inline: true
        },
        {
            name: "Member Count/成員數量",
            value: String(interaction.guild.memberCount),
            inline: true
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true
        },
        {
            name: "Boost Level/加成等級",
            value: String(interaction.guild.premiumTier),
            inline: true
        },
        {
            name: "Number of Boosts/加成數量",
            value: String(interaction.guild.premiumSubscriptionCount),
            inline: true
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true
        })
        .setThumbnail(interaction.guild.iconURL());
    await interaction.editReply({ content: "", embeds: [Embed] });
}