const {Bot} = require('../../structure/client');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    name: "ready",
    /**
     * @param {Bot} client 
     */
async exec(client) {
    console.log("Prêt sur" + ' ' + client.user.tag)
    client.commands.forEach(command => {
        client.dashboard.registerCommand(command?.name, command?.description, command?.usage)
    });
    await client.db.connect();
    client.db.on("ready", () => {
        console.log("DB CONNECTED");
    }); 
    const commands = [
        new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Permet de connaître la latence du bot.")
    ]
    const rest = new REST({ version: "9" }).setToken(require("../../config").token)
    
    client.guilds.cache.forEach(async guild => {
        
        await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commands }).then(sc => {
            console.log("[ / ] Chargé")
        })
    })
    
}

}