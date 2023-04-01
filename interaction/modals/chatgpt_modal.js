import fs from "fs";
import { generateText } from "../../utils/OpenAi.js";
import { log } from "../../utils/Log.js";
import { sleep } from "../../utils/sleep.js";

export const customId = "chatgpt_modal";

export async function execute(interaction,client) {
    await interaction.deferReply();
    log(`${interaction.fields.getTextInputValue("questionInput")}`);
    try {
        const response_chatgpt = await generateText(`${interaction.fields.getTextInputValue("questionInput")}`);
        log(response_chatgpt);
        if (response_chatgpt.length<2000) {
            if (`${interaction.fields.getTextInputValue("questionInput")}`.length<15) await interaction.editReply(`Please provide more detailed message to the bot if that's not related to.\n${response_chatgpt}`);
            else interaction.editReply(`${response_chatgpt}`);
        } else {
            fs.appendFileSync("ChatGPT.txt","");
            fs.writeFileSync("ChatGPT.txt",response_chatgpt);
            await interaction.editReply({content:"The response is too long, which is written in the file below.",files:["./ChatGPT.txt"]});
        }
        client.chatgptlist.push([interaction.user.id, 5, 0]);
    } catch (e) {
        client.chatgptlist.push([interaction.user.id, 10, 0]);
        log(e.toJSON());
    }
    let temp_index = client.chatgptlist.length - 1;
    while (client.chatgptlist[temp_index][1] > 0 || client.chatgptlist[temp_index][2] > 0) {
        if (client.chatgptlist[temp_index][2] == 0) {
            client.chatgptlist[temp_index][2] += 60;
            client.chatgptlist[temp_index][1] -= 1;
        }
        client.chatgptlist[temp_index][2]--;
        await sleep(1000);
    }
}