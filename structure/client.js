const {Client} = require('discord.js'),
{ readdirSync } = require('fs'),
Dashboard = require('discord-easy-dashboard'),
{ Database } = require('quickmongo'),
noir = require('../node_modules/discord-easy-dashboard/themes/dark');

class Bot extends Client {
     constructor(...options) {
        super(...options);
        this.config = require('../config.js');
        this.dashboard = new Dashboard(this, {
            name: '', // nom de votre bot
            description: '', // description de votre bot
            serverUrl: '', // url de votre serveur support
            baseUrl: "http://localhost", // laissez comme il est, sauf si vous possèdez un ndd
            port: 80, // vous pouvez le changer à votre guise
            secret: this.config.client_secret, // laissez comme ceci, changer simplement dans le config.js
            theme: noir, // vous pouvez remplacer par blanc en changeant la variable & sa value "dark" par "light"
            permissions: "MANAGE_GUILD" // vous pouvez mettre la permission que vous souhaitez 
        });
        require('./dashboard')(this.dashboard)
        this.collection = new (require('./collection.js')).Collection()
        this.commands = new Map();
        this.events = new Map()
        this.loadEvents();
        this.loadSlashCmds();
        this.db = new Database(this.config.mongourl);
        this.login(this.config.token);
    }

    loadSlashCmds() {
        const subCmds = readdirSync('./commands');
        for (const subFolders of subCmds) {
            const folder = readdirSync('./commands/' + subFolders);
            for(const commandFile of folder) {
                const command = require('../commands/' + subFolders + '/' + commandFile);
                this.commands.set(command.name, command);
                this.dashboard.registerCommand(command.name, command.description, `/${command.usage}`);
            }
        }
    }

    loadEvents() {
        const subEvents = readdirSync('./events');
        for (const subFolders of subEvents) {
            const folder = readdirSync('./events/' + subFolders);
            for(const eventFile of folder) {
                const event = require('../events/' + subFolders + '/' + eventFile);
                this.events?.set(event, event?.name);
                this.on(event.name, (...eventrest) => event.exec(this, ...eventrest));
            }
        }
    }
}
module.exports.Bot = Bot