import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play tic-tac-toe with your friends or the bot!\n和朋友或者機器人玩OXO")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("The user you want to play with!")
            .setRequired(true));

export const guild = true;

export async function execute(interaction, client) {
    if (client.tictactoe_pending.includes(interaction.user.id)) {
        await interaction.reply({ content: "Please reject or cancell the invite first!", ephemeral: true });
        return;
    }
    if (client.tictactoe_pending.includes(interaction.options.getUser("user").id)) {
        await interaction.reply({ content: "Another user has invited this user!", ephemeral: true });
        return;
    }
    if (interaction.options.getUser("user").id == interaction.user.id) {
        await interaction.reply({ content: "You can't play with yourself, tag a bot instead!", ephemeral: true });
        return;
    }
    if (interaction.options.getUser("user").bot && interaction.options.getUser("user").id != client.user.id) {
        await interaction.reply({ content: "You want to play with another bot? \\:(", ephemeral: true });
        return;
    }
    if (client.tictactoe_players.includes(interaction.user.id)) {
        await interaction.reply({ content: "Please finish your game first!", ephemeral: true });
        return;
    }
    if (client.tictactoe_players.includes(interaction.options.getUser("user").id) && interaction.options.getUser("user").id != client.user.id) {
        await interaction.reply({ content: `<@${interaction.options.getUser("user") != null ? interaction.options.getUser("user").id : client.user.id}> is in another game!`, ephemeral: true });
        return;
    }
    if (interaction.options.getUser("user").id == client.user.id) {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||1||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||2||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||3||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary));
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||4||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||5||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||6||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary));
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tictactoe||7||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||8||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`tictactoe||9||${client.user.id}||${interaction.user.id}`)
                    .setLabel("➖")
                    .setStyle(ButtonStyle.Secondary),
            );
        await interaction.reply({ content: `<@${interaction.user.id}>'s turn! (❌)`, components: [row1, row2, row3] });
        client.tictactoe_players.push(interaction.user.id);
    } else {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("starttictactoe")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("canceltictactoe")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Danger)
            );
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} is inviting you to play tictactoe!`)
            .setDescription("Do you want to join the tictactoe game?")
            .setColor(0xe7f705)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: `<@${interaction.options.getUser("user").id}>`, embeds: [embed], components: [row] });
        client.tictactoe_pending.push(interaction.user.id);
        client.tictactoe_pending.push(interaction.options.getUser("user").id);
    }
} 