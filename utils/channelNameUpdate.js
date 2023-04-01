import { log } from "./Log.js";

export async function change_time(my_server) {
    my_server.channels.fetch("1048229314157629531")
        .then(async channel => await channel.edit({name:`🕑 ${new Date().toLocaleString("en-ZA", { timeZone: "Asia/Hong_Kong" }).replaceAll("/", "-").replace(",", "").split(" ")[1].slice(0,5)} 🕑`}))
        .catch(err=>console.error(err));
}

export async function change_date(my_server) {
    my_server.channels.fetch("852441839922839594")
        .then(async channel=> {
            await channel.edit({name:new Date().toLocaleString("en", { weekday: "long", month: "short", day: "numeric", timeZone: "Asia/Hong_Kong" })});
            log("Changed date");
        });
}

export async function change_status(my_server) {
    let dnd = 0;
    let online = 0;
    let offline = 0;
    let idle = 0;
    let admins = 0;
    my_server.members.cache.forEach(member=> {
        if (member.presence?.status=="dnd") dnd++;
        else if (member.presence?.status=="idle") idle++;
        else if (member.presence?.status=="online") online++;
        else offline++;
        if (member.presence?.status&&member.roles?.cache?.find(role=> role.name=="Owners"||role.name=="Helpers and admins")) admins++;
    });
    my_server.channels.fetch("852445766118670346").then(async channel=> {
        if (channel.name != `Admins Online: ${admins}`) {
            await channel.edit({name:`Admins Online: ${admins}`});
        }
    });
    my_server.channels.fetch("852445875761446922").then(async channel=> {
        if (channel.name!=`🟢: ${online} 🟡: ${idle} ⛔: ${dnd} 🔘: ${offline}`) {
            await channel.edit({name:`🟢: ${online} 🟡: ${idle} ⛔: ${dnd} 🔘: ${offline}`});
        }
    });
}