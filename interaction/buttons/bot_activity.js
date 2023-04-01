import { user_ids } from "../../json/user_ids.js";
import { EmbedBuilder } from "@discordjs/builders";

export const customId = "bot_activity";

export async function execute(interaction,client) {
    if (!user_ids.includes(interaction.user.id)&&interaction.guild.ownerId!=interaction.user.id) {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to interact with this button.\n你沒有權限使用此按鈕")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
    } else if (interaction.customId=="bot_activity no") await interaction.update({ content: "Request rejected/請求已拒絕", embeds: [], components: [] });
    else {
        const button = interaction.customId;
        if (button.split("||")[1] != "1") {
            let lst = button.split("||");
            let typ = lst[1];
            let acti = lst[2];
            client.user.setActivity({
                name: acti,
                type: typ
            });
            await interaction.update({ content: "Request accepted/請求已接受", embeds: [], components: [] });
            client.bot_a = true;
            setTimeout(() => client.bot_a = false, 1000 * 30);
        } else {
            let lst = button.split("||");
            let typ = lst[1];
            let acti = lst[2];
            let ur = lst[3];
            client.user.setActivity({
                name: acti,
                type: typ,
                url: ur
            });
            await interaction.update({ content: "Request accepted/請求已接受", embeds: [], components: [] });
            client.bot_a = true;
            setTimeout(() => client.bot_a = false, 1000 * 30);
        }
    }
}