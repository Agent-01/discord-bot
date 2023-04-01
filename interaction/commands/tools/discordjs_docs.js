import { SlashCommandBuilder } from "discord.js";
import Docs from "discord.js-docs";

export const data = new SlashCommandBuilder()
    .setName("discordjs_docs")
    .setDescription("Get the documentation of discord.js\n取得Discord.js的文檔")
    .addStringOption(option =>
        option.setName("query")
            .setDescription("Anything related to discord.js you want to search from mdn/搜尋")
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName("ephemeral")
            .setDescription("Only you can see this message/只有你能看得到此訊息")
            .setRequired(false));

export async function execute(interaction) {
    const branch = "main";
    const max = 1024;
    const replaceDisco = (str) => str.replace(/docs\/docs\/disco/g, `docs/discord.js/${branch}`).replace(/ \(disco\)/g, "");
    const doc = await Docs.fetch(branch);
    const results = await doc.resolveEmbed(interaction.options.getString("query"));
    if (!results) {
        await interaction.editReply("Could not find that documentation");
        return;
    }
    const stri = replaceDisco(JSON.stringify(results,null,4));
    const embed = JSON.parse(stri);
    embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`;
    const extra =
                "\n\nView more here: " +
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
                    .exec(embed.description)[0]
                    .split(")")[0];
    for (const field of embed.fields || []) {
        if (field.value.length >= max) {
            field.value = field.value.slice(0, max);
            const spli = field.value.split(" ");
            let joined = spli.join(" ");
            while (joined.length >= max - extra.length) {
                spli.pop();
                joined = spli.join(" ");
            }
            field.value = joined + extra;
        }
    }
    embed.author.icon_url = "https://discord.js.org/static/djs_logo.png";
    embed.footer = { text: `Requested by ${interaction.user.tag}`, icon_url: interaction.user.displayAvatarURL() };
    embed.timestamp = new Date().toISOString();
    await interaction.reply({ embeds: [embed] , ephemeral: interaction.options.getBoolean("ephemeral") == null ? true : interaction.options.getBoolean("ephemeral")});
}