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
    if (ctx.content<'a'||ctx.content>'z') return;
    if (word.includes(ctx.content)) {
        client.hangman[ctx.guild.id].shown = show(word,client.hangman[ctx.guild.id].shown,ctx.content);
        if (client.hangman[ctx.guild.id].shown==client.hangman[ctx.guild.id].word) {
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
            await ctx.delete();
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
            await ctx.delete();
            return;
        }
        await client.hangman[ctx.guild.id].message.edit({content:
            ":x:: "+
            client.hangman[ctx.guild.id].wrong.join(", ")+
            `\nThe word is: ${client.hangman[ctx.guild.id].shown.replaceAll("_","\\_")}\n`+
            client.hangman[ctx.guild.id].hangman
        });
    }
    await ctx.delete();
}