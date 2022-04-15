const { Bot } = require('../../structure/client.js'),
{ Interaction, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'ping',
    permission: '',
    description: "Permet de connaître la latence du bot",
    usage: "ping",

    /**
     * 
     * @param {Bot} client 
     * @param {Interaction} interaction 
     */
    async exec(client, interaction) {
        try {
        const msg = await interaction.reply({content: "Recherche...", fetchReply: true})
        const a = Date.now()
        client.db.get('a').then(async db => {
            const b = Date.now()
            const embed = new MessageEmbed()
            .setDescription(`Bot : ${msg.createdAt - interaction.createdAt}ms\nBase de données : ${b - a}ms\nAPI : ${client.ws.ping}ms`)
            .setColor("2f3136")
            await interaction.editReply({content : " ", embeds : [embed]})
        })
        } catch (err) {
            console.log(err)
        };
    }
};