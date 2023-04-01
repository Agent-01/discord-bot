import {EmbedBuilder,SlashCommandBuilder} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("version")
    .setDescription("Get the version of the bot\n取得機器人版本")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    const Embed = new EmbedBuilder()
        .setTitle("My version is Alpha 2.1!/目前版本正式2.1!")
        .setColor(0x00FFFF)
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    await interaction.reply({ content: "", embeds: [Embed] , ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral")});
}