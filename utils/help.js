import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export const helpRow = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("help")
            .setPlaceholder("How can I help you?")
            .addOptions(
                {
                    label: "🕹️Game commands/游戲指令",
                    description: "Get the commands related game category/取得關於游戲的指令",
                    value: "games",
                },
                {
                    label: "🎶Music commands/音樂指令",
                    description: "Get the commands related music category/取得關於音樂的指令",
                    value: "music",
                },
                {
                    label: "🔢Math related commands/數學有關的指令",
                    description: "Get the commands related math category/取得和數學有關的指令",
                    value: "math",
                },
                {
                    label: "🤖OpenAI related commands/AI有關的指令",
                    description: "Get the commands related OpenAI category/取得和AI有關的指令",
                    value: "openai",
                },
                {
                    label: "🛠️Tools related commands/工具有關的指令",
                    description: "Get the commands related tools category/取得有關工具的指令",
                    value: "tools",
                },
                {
                    label: "⚠️Moderation commands/管理伺服器指令",
                    description: "Get the commands related moderation category/取得管理伺服器的指令",
                    value: "moderation",
                },
                {
                    label: "Misc commands/其他指令",
                    description: "Get the commands related misc category/取得其他的指令",
                    value: "misc",
                },
            ),
    );