import fs from "fs";
import { SlashCommandBuilder } from "discord.js";

const generatePi = function * generatePi() {
    let q = 1n;
    let r = 180n;
    let t = 60n;
    let i = 2n;
    while (true) {
        let digit = ((i * 27n - 12n) * q + r * 5n) / (t * 5n);
        yield Number(digit);
        let u = i * 3n;
        u = (u + 1n) * 3n * (u + 2n);
        r = u * 10n * (q * (i * 5n - 2n) + r - t * digit);
        q *= 10n * i * (i++ * 2n - 1n);
        t *= u;
    }
};

export const data = new SlashCommandBuilder()
    .setName("get_pi")
    .setDescription("Calculates Pi to specific digits and return the results and time taken\n計算PI")
    .addIntegerOption(option=>
        option.setName("digits")
            .setDescription("The number of digits the pi will be calculated/小數點後多少位")
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(19999));

export async function execute(interaction) {
    let calculating_pi = JSON.parse(fs.readFileSync("./json/Config.json"));
    if (!calculating_pi["calculating_pi"]) {
        calculating_pi["calculating_pi"] = true;
        fs.writeFileSync("./json/Config.json",JSON.stringify(calculating_pi,null,4));
        await interaction.deferReply();
        let iter = generatePi();
        iter.next();
        let stri = "3.";
        let start_time = Date.now();
        for (let i = 0; i < interaction.options.getInteger("digits"); i++) stri += iter.next().value;
        let end_time = ((Date.now()-start_time)/1000).toFixed(3);
        fs.appendFileSync("PI.txt","");
        fs.writeFileSync("PI.txt",stri);
        calculating_pi["calculating_pi"] = false;
        fs.writeFileSync("./json/Config.json",JSON.stringify(calculating_pi,null,4));
        await interaction.editReply({content:`Generated PI to ${interaction.options.getInteger("digits")} digits.\nTime taken: ${end_time} seconds`,files:[{attachment:`${__dirname}/PI.txt`,name:"PI.txt"}]});
    } else {
        await interaction.reply({content:"Currently calculating PI. Please wait until the result is calculated to use this command again.",ephemeral:true});
    }
}