import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { user_ids } from "../../json/user_ids.js";

export const data = new SlashCommandBuilder()
    .setName("errorfile")
    .setDescription("Get the error file")
    .addIntegerOption(option=>
        option.setName("lines")
            .setDescription("Get last number of lines")
            .setRequired(true)
            .setMinValue(1))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    if (user_ids.includes(interaction.user.id)) {
        const Embed = new EmbedBuilder()
            .setTitle("Error file is sent through private message.")
            .setColor(0xFFD700)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({embeds:[Embed],ephemeral: interaction.options.getBoolean("ephemeral")==null?true:interaction.options.getBoolean("ephemeral")});
        await interaction.user.send({files:[{attachment:"./logs/Error.log"}]});
    } else {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        if (interaction.guild != null) await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
        else await interaction.reply({ content: "", embeds: [Embed] });
    }
}