import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Set music filter\n設定音樂過濾器")
    .addSubcommand(subcommand=>
        subcommand.setName("on")
            .setDescription("Turns on the specified music filter/開啓指定的音樂過濾器")
            .addStringOption(option=>
                option.setName("filter")
                    .setDescription("The filter to be turned on/過濾器")
                    .setRequired(true)
                    .addChoices({name:"3d",value:"3d"},
                        {name:"bassboost",value:"bassboost"},
                        {name:"echo",value:"echo"},
                        {name:"karaoke",value:"karaoke"},
                        {name:"nightcore",value:"nightcore"},
                        {name:"vaporwave",value:"vaporwave"},
                        {name:"flanger",value:"flanger"},
                        {name:"gate",value:"gate"},
                        {name:"haas",value:"haas"},
                        {name:"reverse",value:"reverse"},
                        {name:"surround",value:"surround"},
                        {name:"mcompand",value:"mcompand"},
                        {name:"phaser",value:"phaser"},
                        {name:"tremolo",value:"tremolo"},
                        {name:"earwax",value:"earwax"},)
            )
    )
    .addSubcommand(subcommand=>
        subcommand.setName("off")
            .setDescription("Turns off the specified music filter/關閉指定的音樂過濾器")
            .addStringOption(option=>
                option.setName("filter")
                    .setDescription("The filter to be turned off/過濾器")
                    .setRequired(true)
                    .addChoices({name:"3d",value:"3d"},
                        {name:"bassboost",value:"bassboost"},
                        {name:"echo",value:"echo"},
                        {name:"karaoke",value:"karaoke"},
                        {name:"nightcore",value:"nightcore"},
                        {name:"vaporwave",value:"vaporwave"},
                        {name:"flanger",value:"flanger"},
                        {name:"gate",value:"gate"},
                        {name:"haas",value:"haas"},
                        {name:"reverse",value:"reverse"},
                        {name:"surround",value:"surround"},
                        {name:"mcompand",value:"mcompand"},
                        {name:"phaser",value:"phaser"},
                        {name:"tremolo",value:"tremolo"},
                        {name:"earwax",value:"earwax"},)
            )
    );

export const guild = true;

export async function execute(interaction, client) {
    if (!interaction.member?.voice.channel||interaction.guild==null) {
        await interaction.reply("⛔ You need to be in the voice channel!/你必須在語音頻道裏！");
        return;
    }
    const queue = client.DisTube.getQueue(interaction.guild);
    if (!queue) {
        await interaction.reply("⛔ There are no songs in the queue/目前沒有任何歌曲正在播放");
        return;
    }
    if (interaction.member.voice.channelId != interaction.guild.members.me.voice.channelId) {
        await interaction.reply("⛔ You need to be in the same voice channel!");
        return;
    }
    if (interaction.options._subcommand == "on") {
        if (!queue.filters.has(interaction.options.getString("filter"))) {
            await interaction.reply(`Applying filter ${interaction.options.getString("filter")}...`);
            await queue.filters.add(interaction.options.getString("filter"));
            await interaction.editReply(`${interaction.options.getString("filter")} filter has turned on!`);
        }
        else await interaction.reply({content:"🚫 The filter has already been turned on!",ephemeral:true});
    } else if (interaction.options._subcommand == "off") {
        if (queue.filters.has(interaction.options.getString("filter"))) {
            await interaction.reply(`Removing filter ${interaction.options.getString("filter")}...`);
            await queue.filters.remove(interaction.options.getString("filter"));
            await interaction.editReply(`${interaction.options.getString("filter")} filter has turned off!`);
        }
        else await interaction.reply({content:"🚫 The filter has already been turned off!",ephemeral:true});
    }
}