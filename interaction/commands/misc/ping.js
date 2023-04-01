import {EmbedBuilder,SlashCommandBuilder} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot's ping and says pong!\n取得延遲")
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    const that_time = Date.now();
    const interactionResponse = await interaction.deferReply({
        fetchReply: true,
        ephemeral: interaction.options.getBoolean("ephemeral") == null ? false : interaction.options.getBoolean("ephemeral")
    });
    const responseTime = interactionResponse.createdTimestamp - that_time;
    const embed = new EmbedBuilder()
        .setTitle("Pong!")
        .setColor(0x00FFFF)
        .setTimestamp(Date.now())
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .addFields(
            {
                name: "🌐Response latency/響應延遲",
                value: `${responseTime}ms/毫秒`,
                inline: true,
            },
            {
                name: "📟API Latency/API延遲",
                value: `${Math.round(interaction.client.ws.ping)}ms/毫秒`,
                inline: true,
            }
        );
    await interaction.editReply({ embeds: [embed] });
}