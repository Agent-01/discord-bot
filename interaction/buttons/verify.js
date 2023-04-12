import fs from "fs";
import Canvas from "canvas";
import { config } from "dotenv";

config();

export const customId = "verify";

export async function execute(interaction) {
    let verify_file = JSON.parse(fs.readFileSync("./json/Config.json"));
    if (!interaction.member.roles.cache.has(process.env.QuarantineRole)) {
        await interaction.reply({content:"You have already verified!",ephemeral: true});
        return;
    }
    await interaction.reply({content:"Please continue to verify in private message channel. If you didn't allow private message, please turn that on and try to press the button again.\n請在私人頻道中進行驗證。如果你沒有打開私信，請將其打開並再次按下按鈕。",ephemeral: true});
    let verifyCanvas = {};
    verifyCanvas.create = Canvas.createCanvas(1024, 500);
    verifyCanvas.context = verifyCanvas.create.getContext("2d");
    verifyCanvas.context.font = "240px DejaVu Sans";
    let randomnum = Math.floor(Math.random() * (999999 - 100010 + 1)) + 100010;
    verifyCanvas.context.fillText(`${randomnum}`, 0, 300);
    verify_file["Verify"][0]["users"][`${interaction.user.id}`] = randomnum;
    fs.writeFileSync("./json/Config.json", JSON.stringify(verify_file,null,4));
    await interaction.user.send({ content: `Hey <@${interaction.user.id}>, please type in the number you see in this image\n<@${interaction.user.id}>，請輸入你在這張圖片中看到的數字`, files: [{ attachment: verifyCanvas.create.toBuffer(), name: `verify-${interaction.user.id}.png` }] });
}