import { SlashCommandBuilder } from "discord.js";
import {sleep} from "../../../utils/sleep.js";

export const data = new SlashCommandBuilder()
    .setName("guess_number")
    .setDescription("Start a game that guess a number from default 1-1000\n開始一個猜數字的游戲")
    .addIntegerOption(option =>
        option.setName("max_range")
            .setDescription("The maximum number the number could be/最大數字")
            .setRequired(false)
            .setMinValue(4)
            .setMaxValue(99999999999999));

export const guild = true;

export async function execute(interaction, client) {
    if (client.game_number == {} || client.game_number[interaction.guildId] == undefined) {
        if (interaction.options.getInteger("max_range") == null) client.game_number[interaction.guildId] = Math.round(Math.random() * (1000 - 1)) + 1;
        else client.game_number[interaction.guildId] = Math.round(Math.random() * (interaction.options.getInteger("max_range") - 1)) + 1;
        client.game_number_small[interaction.guildId] = 1;
        client.game_number_big[interaction.guildId] = interaction.options.getInteger("max_range") == null ? 1000 : interaction.options.getInteger("max_range");
        client.game_on_progress[interaction.guildId] = await interaction.reply(`Please guess a number between 1 to ${client.game_number_big[interaction.guildId]}\n請在1和${client.game_number_big[interaction.guildId]}之間猜一個數字`);
        client.game_timeout[interaction.guildId] = 60 * 5;
        while (client.game_timeout[interaction.guildId]--) {
            await sleep(1000);
            if (client.game_timeout[interaction.guildId] == 1) {
                try {
                    await client.game_on_progress[interaction.guildId].interaction.editReply("❌The game has taken too long to wait for a response, if you still wish to play it, please use the command again.");
                } catch (e) {
                    await client.game_on_progress[interaction.guildId].edit("❌The game has taken too long to wait for a response, if you still wish to play it, please use the command again.");
                }
                client.game_number[interaction.guildId] = undefined;
                client.game_number_big[interaction.guildId] = undefined;
                client.game_number_small[interaction.guildId] = undefined;
                client.game_on_progress[interaction.guildId] = undefined;
                client.game_timeout[interaction.guildId] = undefined;
            } else if (client.game_number[interaction.guildId] == undefined || client.game_number_big[interaction.guildId] == undefined || client.game_number_small[interaction.guildId] == undefined || client.game_on_progress[interaction.guildId] == undefined || client.game_timeout[interaction.guildId] == undefined) {
                break;
            }
        }
    } else {
        await interaction.reply("Another game is already in progress/另外一個游戲正在進行");
    }
}