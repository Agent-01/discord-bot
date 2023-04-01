import { user_ids } from "../../json/user_ids.js";
import { EmbedBuilder } from "@discordjs/builders";

export const customId = "bot_status";

export async function execute(interaction,client) {
    if (!user_ids.includes(interaction.user.id)&&interaction.guild.ownerId!=interaction.user.id) {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to interact with this button.\n你沒有權限使用此按鈕")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
    } else if (interaction.customId=="bot_status no") await interaction.update({ content: "Request rejected/請求已拒絕", embeds: [], components: [] });
    else {
        const button = interaction.customId;
        let lst = button.split("||");
        let typ = lst[1];
        client.user.setStatus({
            status: typ
        });
        await interaction.update({ content: "Request accepted/請求已接受", embeds: [], components: [] });
        client.bot_s = true;
        setTimeout(() => client.bot_s = false, 1000 * 30);
    }
}