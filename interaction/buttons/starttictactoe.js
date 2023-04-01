import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

export const customId = "starttictactoe";

export async function execute(interaction, client) {
    if (interaction.message.content.includes(interaction.user.id)) {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||1||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||2||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||3||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary));
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||4||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||5||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||6||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary));
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||7||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||8||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||9||${interaction.user.id}||${interaction.message.interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
            );
        await interaction.message.delete();
        await interaction.channel.send({ content: `<@${interaction.message.interaction.user.id}>'s turn! (❌)`, components: [row1, row2, row3] });
        client.tictactoe_players.push(interaction.message.interaction.user.id);
        client.tictactoe_players.push(interaction.user.id);
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(interaction.message.interaction.user.id), 1);
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(interaction.user.id), 1);
    } else {
        await interaction.reply({ content: "You are not the user being invited!", ephemeral: true });
    }
}