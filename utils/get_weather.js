import axios from "axios";

export async function get_weather(place) {
    let stri = "";
    let r = (await axios.get("https://www.hko.gov.hk/textonly/v2/forecast/text_readings_e.htm")).data;
    let temp_start = 0;
    temp_start = r.search(place) + place.length;
    let temp_end = r.indexOf("\n", temp_start);
    let h_start = 0;
    let start = temp_start;
    let end = 0;
    for (let i = temp_start; i < temp_end; i++) {
        if (r[i] != " ") {
            stri += r[i];
            if (r[i] != " " && r[i + 1] == " ") {
                stri += "||";
                h_start = i + 1;
                break;
            }
        }
    }
    for (let i = h_start; i < temp_end; i++) {
        if (r[i] != " ") {
            stri += r[i];
            if (r[i] != " " && r[i + 1] == " ") {
                stri += "||";
                break;
            }
        }
    }
    if (place == "Chek Lap Kok" || place == "Cheung Chau" || place == "King's Park" || place == "Lau Fau Shan" || place == "Ngong Ping" || place == "Peng Chau" || place == "Sai Kung" || place == "Sha Tin" || place == "Shek Kong" || place == "Stanley" || place == "Ta Kwu Ling" || place == "Tai Mei Tuk" || place == "Tate's Cairn" || place == "Tseung Kwan O" || place == "Tsing Yi" || place == "Tuen Mun" || place == "Waglan Island" || place == "Wetland Park" || place == "Wong Chuk Hang") {
        if (start != -1) start += place.length + 1;
        else throw new Error("HKO website has removed this place info");
        start = r.indexOf(place, start);
        if (start != -1) start += place.length;
        else throw new Error("HKO website has removed this place info");
        end = r.indexOf("\n", start);
        if (end == -1) throw new Error("HKO website has removed this place info");
        for (let i = start; i < end; i++) {
            if (r[i] != " " && r[i + 1] == " ") {
                stri += r[i];
                start = i + 1;
                break;
            }
            else if (r[i] != " ") stri += r[i];
        }
        stri += "||";
        for (let i = start; i < end; i++) {
            if (r[i] != " " && r[i + 1] == " ") {
                stri += r[i];
                break;
            }
            else if (r[i] != " ") stri += r[i];
        }
        stri += "km/h";
    }
    else stri += "N/A||N/A";
    stri += "||";
    let l = 0;
    let valid = false;
    if (place == "Chek Lap Kok" || place == "Lau Fau Shan" || place == "Peng Chau" || place == "Sha Tin" || place == "Shek Kong" || place == "Ta Kwu Ling" || place == "Tai Po" || place == "Waglan Island" || place == "Wetland Park") {
        l = 3;
        valid = true;
    }
    else if (place == "Cheung Chau") {
        l = 4;
        valid = true;
    }
    else if (place == "HK Observatory" || place == "Sheung Shui") {
        l = 2;
        valid = true;
    }
    if (valid == true) {
        start = 0;
        end;
        for (let i = 0; i < l; i++) {
            start = r.indexOf(place, start) + place.length;
            end = r.indexOf("\n", start);
        }
        for (let i = start; i < end; i++) {
            if (r[i] != " " && r[i + 1] == " ") {
                stri += r[i];
                start = i + 1;
                break;
            }
            else if (r[i] != " ") stri += r[i];
        }
        stri += " hPa";
    }
    else stri += "N/A";
    stri += "||";
    if (place == "Chek Lap Kok" || place == "Waglan Island") {
        start = 0;
        start = r.indexOf(place, start) + place.length;
        start = r.indexOf(place, start) + place.length;
        start = r.indexOf(place, start) + place.length;
        start = r.indexOf(place, start) + place.length;
        end = r.indexOf("\n", start);
        for (let i = start; i < end; i++) {
            if (r[i] != " " && r[i + 1] == " " || r[i] != " " && r[i + 1] == "\n") {
                stri += r[i];
                break;
            }
            else if (r[i] != " ") stri += r[i];
        }
        stri += " km";
    }
    else stri += "N/A";
    stri += "||";
    let udt_at = r.indexOf("Latest readings recorded at ") + 28;
    let udt_end = r.indexOf(" Hong Kong", udt_at);
    for (let i = udt_at; i < udt_end; i++) stri += r[i];
    stri += "||";
    r = (await axios.get("https://www.hko.gov.hk/textonly/v2/forecast/englishwx2.htm")).data;
    let wea = r.indexOf("Weather Cartoon : ") + 18;
    wea = r.indexOf(" - ", wea) + 3;
    let w_end = r.indexOf("\n", wea);
    for (let i = wea; i < w_end; i++) stri += r[i];
    stri = stri.trimEnd();
    return stri.split("||");
}