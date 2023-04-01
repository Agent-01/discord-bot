import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { user_ids } from "../../json/user_ids.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName("what_is_my_ip")
    .setDescription("You don't need to know this :)")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    if (user_ids.includes(interaction.user.id)) {
        await interaction.deferReply({ephemeral: interaction.options.getBoolean("ephemeral") == null ? true : interaction.options.getBoolean("ephemeral")});
        let response = await axios.get("https://api.ipify.org/");
        await interaction.editReply("The ip is "+response.data);
    } else {
        const Embed = new EmbedBuilder()
            .setTitle("You do not have the required permissions to run this command./你沒有權限使用此指令")
            .setColor(0x00FFFF)
            .setTimestamp(Date.now())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        if (interaction.guild != null) await interaction.reply({ content: "", embeds: [Embed], ephemeral: true });
        else await interaction.reply({ content: "", embeds: [Embed], ephemeral: true});
    }
}