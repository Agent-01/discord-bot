export const customId = "canceltictactoe";

export async function execute(interaction,client) {
    const button = interaction.customId;
    if (interaction.message.content.includes(interaction.user.id)) {
        await interaction.update({ content: `<@${interaction.user.id}> your tictactoe invite has been rejected!`, embeds: [], components: [] });
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(button.split("||")[2]), 1);
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(button.split("||")[1]), 1);
    } else if (interaction.message.interaction.user.id == interaction.user.id) {
        await interaction.update({content:`<@${interaction.user.id}> you have cancelled your invite!`,embeds:[],components:[]});
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(button.split("||")[2]), 1);
        client.tictactoe_pending.splice(client.tictactoe_pending.indexOf(button.split("||")[1]), 1);
    } else {
        await interaction.reply({ content: "You are not the user being invited!", ephemeral: true });
    }
}