require("dotenv").config();

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require("discord.js");

const { startWhatsApp, sendMessage } = require("./whatsapp/client");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logado como ${client.user.tag}`);
    startWhatsApp();
});

client.on("messageCreate", async (message) => {
    if (message.content === "!painel") {

        const button = new ButtonBuilder()
            .setCustomId("send_like")
            .setLabel("Enviar Like")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await message.channel.send({
            content: "Sistema de Likes",
            components: [row]
        });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isButton() && interaction.customId === "send_like") {

        const modal = new ModalBuilder()
            .setCustomId("like_modal")
            .setTitle("Enviar Like");

        const input = new TextInputBuilder()
            .setCustomId("id_input")
            .setLabel("Digite o ID")
            .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(input);
        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === "like_modal") {

        const id = interaction.fields.getTextInputValue("id_input");

        const msg = `/like ${id}`;

        await sendMessage(msg, process.env.WHATSAPP_GROUP_ID);

        await interaction.reply({
            content: "Enviado com sucesso.",
            ephemeral: true
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
