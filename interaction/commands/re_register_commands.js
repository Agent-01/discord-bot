import { SlashCommandBuilder, EmbedBuilder, Routes } from "discord.js";
import { user_ids } from "../../json/user_ids.js";
import {REST} from "@discordjs/rest";
import {config} from "dotenv";
import { log } from "../../utils/Log.js";

config();
const TOKEN = process.env.DiscordBotToken;
const rest = new REST({ version: "10" }).setToken(TOKEN);
const commands = [];

export const data = new SlashCommandBuilder()
    .setName("re_register_commands")
    .setDescription("You don't need to know this :)");

export async function execute(interaction,client) {
    if (user_ids.includes(interaction.user.id)) {
        try {
            await client.commands.forEach(async command => {
                commands.push(command.data.toJSON());
            });
            let t0 = performance.now();
            await interaction.reply("♻️⬜️⬜️⬜️⬜️⬜️");
            await rest.put(Routes.applicationCommands(process.env.DiscordBotID), { body: [] })
                .then(async () => {
                    await interaction.editReply({ content: "♻️🟩⬜️⬜️⬜️⬜️", ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral")});
                    log("Successfully deleted all application commands.");
                });
            await interaction.editReply({ content: "♻️🟩🟩⬜️⬜️⬜️" });
            log("Started registering application (/) commands");
            await interaction.editReply({ content: "♻️🟩🟩🟩⬜️⬜️" });
            await rest.put(Routes.applicationCommands(process.env.DiscordBotID), { body: commands });
            await interaction.editReply({ content: "♻️🟩🟩🟩🟩⬜️" });
            log("Ended registering application (/) commands");
            await interaction.editReply({ content: "♻️🟩🟩🟩🟩🟩" });
            let t1 = performance.now();
            await interaction.editReply({ content: `✅Application commands successfully deleted and registered again. Time taken: \`${Math.round((t1 - t0) / 1000)}s\`` });
        } catch (err) {
            console.error(err);
            log(`\n\n ${String(err)}`);
        }
    } else {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed], ephemeral:true });
    }
}