import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { helpRow } from "../../../utils/help.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get information about the commands\n取得指令的資訊")
    .addStringOption(option =>
        option.setName("type")
            .setDescription("The category of the commands/指令類別")
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction, client) {
    const categoryCommands = client.commands.filter(c => c.category == interaction.options.getString("type"));
    let commandList = categoryCommands.map((c) => `\`${c.command.data.name}\`: \`${c.command.data.description}\``);
    if (commandList.length!=0) {
        commandList = commandList.map((c,i)=>`**${i+1}.** ${c}`);
        const embed = new EmbedBuilder()
            .setTitle(`Displaying commands related to ${interaction.options.getString("type")} category/正在顯示${interaction.options.getString("type")}的指令`)
            .setDescription(commandList.join("\n"))
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed], ephemeral: interaction.options.getBoolean("ephemeral") == null ? true : interaction.options.getBoolean("ephemeral")});
    } else {
        await interaction.reply({content:`There are follow categories: ${client.categories.join(", ")}`,components:[helpRow]});
    }
}