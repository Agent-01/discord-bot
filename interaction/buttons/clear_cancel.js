import { EmbedBuilder } from "@discordjs/builders";
import {sleep} from "../../utils/sleep.js";

export const customId = "clear";

export async function execute(interaction) {
    if (interaction.message.interaction.user.id!=interaction.user.id) {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to interact with this button.\n你沒有權限使用此按鈕")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
        return;
    }
    if (interaction.customId=="clear_cancel") {
        await interaction.update({ content: "Operation cancelled./操作已取消", embeds: [], components: [] }).then(msg => {
            setTimeout(() => msg.delete(), 6000);
        });
    } else {
        const button = interaction.customId;
        await interaction.update({ content: "Deleting...", embeds: [], components: [] });
        let n = Number(button.split(" ")[1]);
        if (n <= 100) {
            try {
                await interaction.channel.bulkDelete(n);
                n=0;
            } catch (e) {
                if (n==Number(button.split(" ")[1])) {
                    let messages = await interaction.channel.messages.fetch({ limit: n });
                    let msg = await interaction.channel.send(`Deleting ${Number(button.split(" ")[1]) - 1} messages./${Number(button.split(" ")[1]) - 1}個訊息正在刪除`);
                    messages.forEach(async (message) => {
                        await message.delete();
                        n--;
                    });
                    await msg.delete();
                } else {
                    let msg = await interaction.channel.send(`Error occured while deleting messages, please try again later.\nError: ${e}`);
                    await sleep(2000);
                    try {
                        await msg.delete();
                    } catch (e) { /* empty */ }
                    return;
                }
            }
        } else {
            let o = n;
            try {
                while (n >= 100) {
                    await interaction.channel.bulkDelete(100);
                    n -= 100;
                    await sleep(1000);
                }
                await interaction.channel.bulkDelete(n);
                n=0;
            } catch (e) {
                if (o==n) {
                    let msg = await interaction.channel.send(`Deleting ${o - 1} messages./${o - 1}個訊息正在刪除`);
                    while (n >= 100) {
                        let messages = await interaction.channel.messages.fetch({ limit: 100 });
                        messages.forEach(async (message) => await message.delete());
                        n -= 100;
                    }
                    let messages = await interaction.channel.messages.fetch({ limit: n });
                    messages.forEach(async (message) => {
                        await message.delete();
                        n--;
                    });
                    await msg.delete();
                } else {
                    let msg = await interaction.channel.send(`Error occured while deleting messages, please try again later.\nError: ${e}`);
                    await sleep(2000);
                    try {
                        await msg.delete();
                    } catch (e) { /* empty */ }
                    return;
                }
            }
        }
        n--;
        if (n!=0) {
            let tempInterval = setInterval(async ()=>{
                if (n<=0) {
                    let msg = await interaction.channel.send("Messages has finished deleting./所有訊息已刪除");
                    setTimeout(async()=>await msg.delete(),6000);
                    clearInterval(tempInterval);
                }
            },1000);
        } else {
            let msg = await interaction.channel.send("Messages has finished deleting./所有訊息已刪除");
            setTimeout(async()=>await msg.delete(),6000);
        }
    }
}