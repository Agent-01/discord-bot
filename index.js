import {spawn} from "child_process";
import fs from "fs";
const sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
let exited = false;
const start = function start() {
    const bot = spawn("node",["bot.js"]);
    bot.stdout.on("data", (data) => {
        console.log(String(data));
    });
    bot.stderr.on("data", (data) => {
        fs.appendFileSync("./logs/Error.log", String(data)+"\n");
        console.log(String(data));
    });
    bot.on("close",(code) => {
        console.log("Bot process exited with code " + code);
        if (code==255) exited = "exit";
        else if (code==100) {
            fs.appendFileSync("./logs/Error.log", "Exiting with code 100"+"\n").then(()=>process.exit(0));
        }
        else exited = true;
    });
};
let count = 0;
const auto_check_function = async function () {
    if (exited==true&&count==0) {
        start();
        count+=15;
        exited = false;
    } else if (exited=="exit") {
        clearInterval(auto_check);
        await sleep(1000*60*60*24*31);
        exited = false;
    } else if (count!=0) {
        count-=1;
    } else if (count>=10) {
        clearInterval(auto_check);
        setTimeout(()=>{
            auto_check = setInterval(auto_check_function,1000);
        },1000*30);
        count = 0;
    }
    await sleep(1000);
};
let auto_check = setInterval(auto_check_function,1000);
(async()=>{
    await sleep(10000);
    start();
})();