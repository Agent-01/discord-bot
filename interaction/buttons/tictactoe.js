export const customId = "tictactoe";

export async function execute(interaction, client) {
    const button = interaction.customId;
    if (!interaction.message.content.includes(interaction.user.id)) {
        await interaction.reply({ content: !button.includes(interaction.user.id)?"You are not in the game!":"Please wait for your turn!", ephemeral: true });
        return;
    }
    await interaction.deferUpdate();
    let rob = [interaction.message.components[0], interaction.message.components[1], interaction.message.components[2]];
    let row_index = Math.ceil(parseInt(button.split("||")[1]) / 3) - 1;
    let button_index = parseInt(button.split("||")[1]) - row_index * 3 - 1;
    rob[row_index].components[button_index].data.disabled = true;
    rob[row_index].components[button_index].data.label = interaction.message.content.includes("❌") ? "❌" : "⭕";
    rob[row_index].components[button_index].data.style = interaction.message.content.includes("❌") ? 1 : 3;
    if ((rob[0].components[0].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == rob[2].components[2].data.label)||(rob[0].components[2].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == rob[2].components[0].data.label)) {
        if ((rob[0].components[0].data.label == "❌"||rob[0].components[2].data.label =="❌")&&rob[1].components[1].data.label == "❌") {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (rob[i].components[j].data.disabled != true) {
                        rob[i].components[j].data.disabled = true;
                    }
                }
            }
            await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
            return;
        } else if ((rob[0].components[0].data.label == "⭕"||rob[0].components[2].data.label =="⭕")&&rob[1].components[1].data.label == "⭕") {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (rob[i].components[j].data.disabled != true) {
                        rob[i].components[j].data.disabled = true;
                    }
                }
            }
            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
            return;
        }
    }
    for (let i = 0; i < 3; i++) {
        if (rob[i].components[0].data.label == rob[i].components[1].data.label && rob[i].components[1].data.label == rob[i].components[2].data.label) {
            if (rob[i].components[0].data.label == "❌") {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (rob[i].components[j].data.disabled != true) {
                            rob[i].components[j].data.disabled = true;
                        }
                    }
                }
                await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                return;
            }
            else if (rob[i].components[0].data.label == "⭕") {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (rob[i].components[j].data.disabled != true) {
                            rob[i].components[j].data.disabled = true;
                        }
                    }
                }
                await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                return;
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        if (rob[0].components[i].data.label == rob[1].components[i].data.label && rob[1].components[i].data.label == rob[2].components[i].data.label) {
            if (rob[0].components[i].data.label == "❌") {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (rob[i].components[j].data.disabled != true) {
                            rob[i].components[j].data.disabled = true;
                        }
                    }
                }
                await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                return;
            }
            else if (rob[0].components[i].data.label == "⭕") {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (rob[i].components[j].data.disabled != true) {
                            rob[i].components[j].data.disabled = true;
                        }
                    }
                }
                await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                return;
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (rob[i].components[j].data.label == "➖") {
                await interaction.message.edit({ content: `<@${interaction.message.content.includes("❌") ? button.split("||")[2] : button.split("||")[3]}>'s turn! (${interaction.message.content.includes("❌") ? "⭕" : "❌"})`, components: rob });
                if (button.includes(client.user.id)) {
                    if (rob[0].components[0].data.label == "⭕" && rob[0].components[0].data.label == rob[1].components[1].data.label && rob[2].components[2].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[2].components[2].data.label = "⭕";
                        rob[2].components[2].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    } else if (rob[1].components[1].data.label == "⭕" && rob[2].components[2].data.label == rob[1].components[1].data.label && rob[0].components[0].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[0].components[0].data.label = "⭕";
                        rob[0].components[0].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    } else if (rob[0].components[0].data.label == "⭕" && rob[0].components[0].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[1].components[1].data.label = "⭕";
                        rob[1].components[1].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    } else if (rob[1].components[1].data.label == "⭕" && rob[2].components[0].data.label == rob[1].components[1].data.label && rob[0].components[2].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[0].components[2].data.label = "⭕";
                        rob[0].components[2].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    } else if (rob[1].components[1].data.label == "⭕" && rob[0].components[2].data.label == rob[1].components[1].data.label && rob[2].components[0].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[2].components[0].data.label = "⭕";
                        rob[2].components[0].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    } else if (rob[0].components[2].data.label == "⭕" && rob[0].components[2].data.label == rob[2].components[0].data.label && rob[1].components[1].data.label == "➖") {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (rob[i].components[j].data.disabled != true) {
                                    rob[i].components[j].data.disabled = true;
                                }
                            }
                        }
                        rob[1].components[1].data.label = "⭕";
                        rob[1].components[1].data.style = 3;
                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                        return;
                    }
                    for (let i = 0; i < 3; i++) {
                        if (rob[i].components[0].data.label == "⭕" && rob[i].components[0].data.label == rob[i].components[1].data.label && rob[i].components[2].data.label == "➖") { // OO-
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[i].components[2].data.label = "⭕";
                            rob[i].components[2].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        } else if (rob[i].components[0].data.label == "⭕" && rob[i].components[0].data.label == rob[i].components[2].data.label && rob[i].components[1].data.label == "➖") { // O-O
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[i].components[1].data.label = "⭕";
                            rob[i].components[1].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        } else if (rob[i].components[1].data.label == "⭕" && rob[i].components[2].data.label == rob[i].components[1].data.label && rob[i].components[0].data.label == "➖") { // -OO
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[i].components[0].data.label = "⭕";
                            rob[i].components[0].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        }
                    }
                    for (let i = 0; i < 3; i++) {
                        if (rob[0].components[i].data.label == "⭕" && rob[0].components[i].data.label == rob[1].components[i].data.label && rob[2].components[i].data.label == "➖") {
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[2].components[i].data.label = "⭕";
                            rob[2].components[i].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        } else if (rob[0].components[i].data.label == "⭕" && rob[0].components[i].data.label == rob[2].components[i].data.label && rob[1].components[i].data.label == "➖") {
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[1].components[i].data.label = "⭕";
                            rob[1].components[i].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        } else if (rob[1].components[i].data.label == "⭕" && rob[2].components[i].data.label == rob[1].components[i].data.label && rob[0].components[i].data.label == "➖") { // -OO
                            for (let i = 0; i < 3; i++) {
                                for (let j = 0; j < 3; j++) {
                                    if (rob[i].components[j].data.disabled != true) {
                                        rob[i].components[j].data.disabled = true;
                                    }
                                }
                            }
                            rob[0].components[i].data.label = "⭕";
                            rob[0].components[i].data.style = 3;
                            await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                            client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                            return;
                        }
                    }
                    let block_place = false;
                    if (rob[0].components[0].data.label == "❌" && rob[0].components[0].data.label == rob[1].components[1].data.label && rob[2].components[2].data.label == "➖") {
                        block_place = true;
                        row_index = 2;
                        button_index = 2;
                    } else if (rob[1].components[1].data.label == "❌" && rob[2].components[2].data.label == rob[1].components[1].data.label && rob[0].components[0].data.label == "➖") {
                        block_place = true;
                        row_index = 0;
                        button_index = 0;
                    } else if (rob[0].components[0].data.label == "❌" && rob[0].components[0].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == "➖") {
                        block_place = true;
                        row_index = 1;
                        button_index = 1;
                    } else if (rob[1].components[1].data.label == "❌" && rob[2].components[0].data.label == rob[1].components[1].data.label && rob[0].components[2].data.label == "➖") {
                        block_place = true;
                        row_index = 0;
                        button_index = 2;
                    } else if (rob[1].components[1].data.label == "❌" && rob[0].components[2].data.label == rob[1].components[1].data.label && rob[2].components[0].data.label == "➖") {
                        block_place = true;
                        row_index = 2;
                        button_index = 0;
                    } else if (rob[0].components[2].data.label == "❌" && rob[0].components[2].data.label == rob[2].components[0].data.label && rob[1].components[1].data.label == "➖") {
                        block_place = true;
                        row_index = 1;
                        button_index = 1;
                    }
                    if (block_place == false) {
                        for (let i = 0; i < 3; i++) {
                            if (rob[i].components[0].data.label == "❌" && rob[i].components[0].data.label == rob[i].components[1].data.label && rob[i].components[2].data.label == "➖") { // OO-
                                block_place = true;
                                row_index = i;
                                button_index = 2;
                                break;
                            } else if (rob[i].components[0].data.label == "❌" && rob[i].components[0].data.label == rob[i].components[2].data.label && rob[i].components[1].data.label == "➖") { // O-O
                                block_place = true;
                                row_index = i;
                                button_index = 1;
                                break;
                            } else if (rob[i].components[1].data.label == "❌" && rob[i].components[2].data.label == rob[i].components[1].data.label && rob[i].components[0].data.label == "➖") { // -OO
                                block_place = true;
                                row_index = i;
                                button_index = 0;
                                break;
                            }
                        }
                    }
                    if (block_place == false) {
                        for (let i = 0; i < 3; i++) {
                            if (rob[0].components[i].data.label == "❌" && rob[0].components[i].data.label == rob[1].components[i].data.label && rob[2].components[i].data.label == "➖") {
                                block_place = true;
                                row_index = 2;
                                button_index = i;
                                break;
                            } else if (rob[0].components[i].data.label == "❌" && rob[0].components[i].data.label == rob[2].components[i].data.label && rob[1].components[i].data.label == "➖") {
                                block_place = true;
                                row_index = 1;
                                button_index = i;
                                break;
                            } else if (rob[1].components[i].data.label == "❌" && rob[2].components[i].data.label == rob[1].components[i].data.label && rob[0].components[i].data.label == "➖") { // -OO
                                block_place = true;
                                row_index = 0;
                                button_index = i;
                                break;
                            }
                        }
                    }
                    let row_index_min = 0, row_index_max = 0, button_index_min = 0, button_index_max = 0;
                    if (block_place == false) {
                        if (row_index == 0) row_index_max = 1;
                        else if (row_index == 1) row_index_max = 2;
                        else if (row_index == 2) {
                            row_index_min = 1;
                            row_index_max = 2;
                        }
                        if (button_index == 0) button_index_max = 1;
                        else if (button_index == 1) button_index_max = 2;
                        else if (button_index == 2) {
                            button_index_max = 2;
                            button_index_min = 1;
                        }
                    }
                    let while_break = 0;
                    while (rob[row_index].components[button_index].data.disabled != undefined || block_place) {
                        if (block_place != true) {
                            if (while_break > 20) {
                                row_index_min = 0;
                                row_index_max = 2;
                                button_index_min = 0;
                                button_index_max = 2;
                            }
                            while_break++;
                            row_index = Math.floor(Math.random() * (row_index_max - row_index_min + 1)) + row_index_min;
                            button_index = Math.floor(Math.random() * (button_index_max - button_index_min + 1)) + button_index_min;
                        }
                        if (rob[row_index].components[button_index].data.disabled == undefined || rob[row_index].components[button_index].data.disabled == false || block_place) {
                            rob[row_index].components[button_index].data.disabled = true;
                            rob[row_index].components[button_index].data.label = "⭕";
                            rob[row_index].components[button_index].data.style = 3;
                            if (rob[0].components[0].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == rob[2].components[2].data.label) {
                                if (rob[0].components[0].data.label == "❌") {
                                    await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                    return;
                                }
                                else if (rob[0].components[0].data.label == "⭕") {
                                    await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                    return;
                                }
                            } else if (rob[0].components[2].data.label == rob[1].components[1].data.label && rob[1].components[1].data.label == rob[2].components[0].data.label) {
                                if (rob[2].components[0].data.label == "❌") {
                                    await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                    return;
                                }
                                else if (rob[2].components[0].data.label == "⭕") {
                                    await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                    return;
                                }
                            }
                            for (let i = 0; i < 3; i++) {
                                if (rob[i].components[0].data.label == rob[i].components[1].data.label && rob[i].components[1].data.label == rob[i].components[2].data.label) {
                                    if (rob[i].components[0].data.label == "❌") {
                                        await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                        return;
                                    }
                                    else if (rob[i].components[0].data.label == "⭕") {
                                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                        return;
                                    }
                                }
                            }
                            for (let i = 0; i < 3; i++) {
                                if (rob[0].components[i].data.label == rob[1].components[i].data.label && rob[1].components[i].data.label == rob[2].components[i].data.label) {
                                    if (rob[0].components[i].data.label == "❌") {
                                        await interaction.message.edit({ content: `<@${button.split("||")[3]}> wins!`, components: rob });
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                        return;
                                    }
                                    else if (rob[0].components[i].data.label == "⭕") {
                                        await interaction.message.edit({ content: `<@${button.split("||")[2]}> wins!`, components: rob });
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
                                        client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
                                        return;
                                    }
                                }
                            }
                            await interaction.message.edit({ content: `<@${button.split("||")[3]}>'s turn! (❌)`, components: rob });
                            break;
                        }
                    }
                }
                return;
            }
        }
    }
    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[2]), 1);
    client.tictactoe_players.splice(client.tictactoe_players.indexOf(button.split("||")[3]), 1);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (rob[i].components[j].data.disabled != true) {
                rob[i].components[j].data.disabled = true;
            }
        }
    }
    await interaction.message.edit({ content: "That's a draw!", components: rob });
}