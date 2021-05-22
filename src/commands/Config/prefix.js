const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sets the channel where to notify new users and check if they are dangerous or not.',
            userPermissions: 'administrator'
        });
    }

    async run(message, args) {
        const value = args[0];

        const query = await this.bot.mysql.query(`SELECT * FROM guilds WHERE guildId = ?`, message.guild.id)
        const config = Object.values(JSON.parse(JSON.stringify(query)))[0];
        
        if (!value.length) return message.channel.createMessage(`You need to provide the new prefix!`)
        if (value.length >= 11) return message.channel.createMessage('The prefix should contain only 10 letters!')

        if (!config) {
          await this.bot.mysql.query(`INSERT INTO guilds SET ?`, { guildId: message.guild.id, prefix: value })
        } else {
          await this.bot.mysql.query(`UPDATE guilds SET ? WHERE guildId = ${message.guild.id}`, { prefix: value })
        }

        return message.channel.createMessage(`Prefix changed to \`${value}\``)
    }
};
