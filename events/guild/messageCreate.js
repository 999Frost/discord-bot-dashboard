const { Message } = require('discord.js'),
{ Bot } = require('../../structure/client');
module.exports = {
    name: "messageCreate",

    /**
     * @param {Bot} client
     * @param {Message} message
     */

    async exec(client, message) {
        try {
            if(message.content.includes(`<@!${client.user.id}>`) || message.content.includes(`<@${client.user.id}>`)) {
                return message.channel.send("Mon prefix est " + await client.db.get(`prefix_${message.guild.id}`))
            }
        } catch (err) {
            console.log(err)
        }
    }
}