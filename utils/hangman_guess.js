const phrase = ["```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "                  |\n"+
    "                  |\n"+
    "__________________|____\n"+
    "```",
"```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "         |        |\n"+
    "                  |\n"+
    "__________________|____\n"+
    "```",
"```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "        /|        |\n"+
    "                  |\n"+
    "__________________|____\n"+
    "```",
"```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "        /|\\       |\n"+
    "                  |\n"+
    "__________________|____\n"+
    "```",
"```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "        /|\\       |\n"+
    "        /         |\n"+
    "__________________|____\n"+
    "```",
"```\n"+
    "         ---------┐\n"+
    "         |        |\n"+
    "         O        |\n"+
    "        /|\\       |\n"+
    "        / \\       |\n"+
    "__________________|____\n"+
    "```"
];

const show = (word,shown,x) => {
    let result = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i]===x||(shown[i]!=="_"&&shown[i]!=="\\")) result+=word[i];
        else result+="_";
    }
    return result;
};

export async function hangman_guess(ctx,client) {
    const word = client.hangman[ctx.guild.id].word;
    ctx.content = ctx.content.toLowerCase();
    // eslint-disable-next-line quotes
    if (ctx.content<'a'||ctx.content>'z'||ctx.content.length!=1&&ctx.content.length!=word.length) return;
    await ctx.delete();
    if (!client.hangman[ctx.guildId].word||!client.hangman[ctx.guildId].shown||
        !client.hangman[ctx.guildId].timeout||!client.hangman[ctx.guildId].hangman||
        client.hangman[ctx.guildId].phrase==undefined
    ) return;
    let check_messages;
    try {
        check_messages = await ctx.channel?.messages?.fetch((await client?.hangman[ctx.guildId]?.message?.fetch())?.id);
    } catch (e) {
        console.error(e);
    }
    if (!check_messages) {
        client.hangman[ctx.guildId] = undefined;
        return;
    }
    if (word.includes(ctx.content)) {
        if (ctx.content.length==1) client.hangman[ctx.guild.id].shown = show(word,client.hangman[ctx.guild.id].shown,ctx.content);
        if (client.hangman[ctx.guild.id].shown==client.hangman[ctx.guild.id].word||word==ctx.content) {
            await client.hangman[ctx.guild.id].message.edit(`<@${ctx.author.id}> have save the guy! The word is ${ctx.client.hangman[ctx.guild.id].word}!`);
            ctx.client.hangman[ctx.guild.id] = undefined;
            return;
        }
        await client.hangman[ctx.guild.id].message.edit({content:
            ":x:: "+
            (client.hangman[ctx.guild.id].wrong.length?client.hangman[ctx.guild.id].wrong.join(", "):"")+
            `\nThe word is: ${client.hangman[ctx.guild.id].shown.replaceAll("_","\\_")}\n`+
            client.hangman[ctx.guild.id].hangman
        });
    } else {
        if (client.hangman[ctx.guild.id].wrong.includes(ctx.content)) {
            return;
        }
        client.hangman[ctx.guild.id].phrase++;
        client.hangman[ctx.guild.id].hangman = phrase[client.hangman[ctx.guild.id].phrase-1];
        client.hangman[ctx.guild.id].wrong.push(ctx.content);
        if (client.hangman[ctx.guild.id].phrase==6) {
            await client.hangman[ctx.guild.id].message.edit({content:
                ":x:: "+
                client.hangman[ctx.guild.id].wrong.join(", ")+
                `\nEveryone lose! The word is: ${client.hangman[ctx.guild.id].word}\n`+
                phrase[client.hangman[ctx.guild.id].phrase-1]
            });
            client.hangman[ctx.guild.id] = undefined;
            return;
        }
        await client.hangman[ctx.guild.id].message.edit({content:
            ":x:: "+
            client.hangman[ctx.guild.id].wrong.join(", ")+
            `\nThe word is: ${client.hangman[ctx.guild.id].shown.replaceAll("_","\\_")}\n`+
            client.hangman[ctx.guild.id].hangman
        });
    }
}