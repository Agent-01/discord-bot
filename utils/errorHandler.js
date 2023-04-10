import { log } from "./Log.js";

export async function handle(interaction, error) {
    console.error(error);
    log(`\n\n ${String(error)}`);
    try {
        await interaction.reply(`Something went wrong during execution of \`${interaction.commandName||interaction.customId}\`.\nError: ${error}`);
    } catch (e) {
        try {
            await interaction.channel.send(`Something went wrong during execution of \`${interaction.commandName||interaction.customId}\`.\nError: ${error}`);
        } catch (wtf) {
            console.error(wtf);
        }
    }
}