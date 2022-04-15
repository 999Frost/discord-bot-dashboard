module.exports = (dashboard) => {
    const prefixValidator = (value) => value.length < 10;
    const prefixSetter = (client, guild, value) => client.db.set(`prefix_${guild.id}`, value);
    const prefixGetter = (client, guild) => client.db.get(`prefix_${guild.id}`) || '!';

    dashboard.addTextInput('Prefix', 'Changer le prefix du bot ( 20 caractères maximum )', prefixValidator, prefixSetter, prefixGetter);
}