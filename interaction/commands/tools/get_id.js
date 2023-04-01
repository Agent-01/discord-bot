import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("get_id")
    .setDescription("Get the id of something\n取得某東西的id")
    .addSubcommand(subcommand =>
        subcommand.setName("channel")
            .setDescription("Get the id of the channel/取得頻道的id")
            .addChannelOption(option =>
                option.setName("channel")
                    .setDescription("The channel you want to get its id/你想獲取id的頻道")
                    .setRequired(false)))
    .addSubcommand(subcommand =>
        subcommand.setName("role")
            .setDescription("Get the id of the role/取得身分組的id")
            .addRoleOption(option =>
                option.setName("role")
                    .setDescription("The role you want to get its id/你想獲取id的身分組")
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName("emoji")
            .setDescription("Get the id of the emoji/取得emoji的id")
            .addStringOption(option =>
                option.setName("emoji")
                    .setDescription("The emoji you want to get its id/你想獲取id的emoji")
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName("user")
            .setDescription("Get the id of the user/取得用戶的id")
            .addUserOption(option =>
                option.setName("user")
                    .setDescription("The user you want to get his id/你想獲取id的用戶")
                    .setRequired(false)))
    .addSubcommand(subcommand =>
        subcommand.setName("guild")
            .setDescription("Get the id of the guild/取得伺服器的id"));

export const guild = true;

export async function execute(interaction, client) {
    if (interaction.options._subcommand == "channel") {
        await interaction.reply(interaction.options.getChannel("channel") == null ? `\\<#${interaction.channelId}>` : `\\<#${interaction.options.getChannel("channel").id}>`);
    } else if (interaction.options._subcommand == "role") {
        await interaction.reply(interaction.options.getRole("role") == null ? "You have not provided any role" : `\\<@&${interaction.options.getRole("role").id}>`);
    } else if (interaction.options._subcommand == "emoji") {
        let emo = interaction.options.getString("emoji");
        if (emo.startsWith("<") && emo.endsWith(">")) await interaction.reply("\\" + interaction.options.getString("emoji"));
        else if (emo.toLowerCase()[0] >= "a" && emo.toLowerCase()[0] <= "z" || emo.match(/[\u3400-\u9FBF]/)) {
            let find_emoji = client.emojis.cache.find(emoji => emoji.name == interaction.options.getString("emoji"));
            if (find_emoji == undefined) await interaction.reply("Invalid string provided, expected an emoji");
            else await interaction.reply(`\\<${find_emoji.animated ? "a" : ""}:${find_emoji.name}:${find_emoji.id}>`); //\nName: ${find_emoji.name}\nID: ${find_emoji.id}\nFormat: \\<\\:name\\:id>
        }
        else if (emo.startsWith(":")&&emo.endsWith(":")) await interaction.reply("\\" + interaction.options.getString("emoji"));
        else await interaction.reply("Invalid string provided, expected an emoji");
    } else if (interaction.options._subcommand == "user") {
        await interaction.reply(interaction.options.getUser("user") == null ? `\\<@${interaction.user.id}>` : `\\<@${interaction.options.getUser("user") != null ? interaction.options.getUser("user").id : client.user.id}>`);
    } else if (interaction.options._subcommand == "guild") {
        await interaction.reply(interaction.guildId);
    }
}