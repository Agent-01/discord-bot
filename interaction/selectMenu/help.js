import { EmbedBuilder } from "discord.js";

export const customId = "help";

export async function execute(interaction, client) {
    const categoryCommands = client.commands.filter(c => c.category == interaction.values[0]);
    let commandList = categoryCommands.map((c) => `\`${c.command.data.name}\`: \`${c.command.data.description}\``);
    if (commandList.length!=0) {
        commandList = commandList.map((c,i)=>`**${i+1}.** ${c}`);
        const embed = new EmbedBuilder()
            .setTitle(`Displaying commands related to ${interaction.values[0]} category/正在顯示${interaction.values[0]}的指令`)
            .setDescription(commandList.join("\n"))
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.update({ embeds: [embed]});
    } else {
        await interaction.reply(`There are follow categories: ${client.categories.join(", ")}`);
    }
}