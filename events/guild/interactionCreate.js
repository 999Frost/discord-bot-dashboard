const { Bot } = require('../../structure/client')
const Discord = require('discord.js')
module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    async exec(client, interaction) {
        try {
            if(interaction.isCommand()) {
                const cmd = client.commands.get(interaction.commandName)
                cmd.exec(client, interaction)
            }


        } catch (err) {
            console.log(err)
        }
    
    }
}