import axios from "axios";

export async function get_warnings() {
    const r = (await axios.get("https://www.hko.gov.hk/textonly/v2/warning/warn.htm")).data;
    let t = 1;
    let warns = "";
    let w = 0;
    while (t <= 20) {
        w = r.indexOf(`${t}. `, w);
        if (w != -1) {
            w += 3;
            if (t != 1) warns += ", ";
            let w_end = r.indexOf(" ( ", w);
            for (let i = w; i < w_end; i++) warns += r[i];
            t += 1;
        } else break;
    }
    if (warns == "") warns = "No warnings in force currently";
    return warns;
}