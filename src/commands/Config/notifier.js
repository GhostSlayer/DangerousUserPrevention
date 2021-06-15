const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sets the channel where to notify new users and check if they are dangerous or not.',
            userPermissions: 'administrator',
            usage: '<channel or disable>',
            examples: ['notifier 827061957046960140', 'notifier disable']
        });
    }

    async run(message, args) {
        const value = args[0];

        const query = await this.bot.mysql.query(`SELECT * FROM guilds WHERE guildId = ?`, message.guild.id)
        const config = Object.values(JSON.parse(JSON.stringify(query)))[0];
        
        if (!value) return message.channel.createMessage(`You have to mention a channel!`)

        if (value.toLowerCase() === 'disable') {
            if (!config || !config.notifierChannelId) return message.channel.createMessage('The notifier is already disabled!')
            await this.bot.mysql.query(`UPDATE guilds SET ? WHERE guildId = ${message.guild.id}`, { notifierChannelId: null })
            return message.channel.createMessage(`Disabled the notifier.`)
        }

        const channel = message.channelMentions[0] || message.guild.channels.get(args[0]).id;
        if (!channel) return message.channel.createMessage(`I couldn't find that channel. Please mention a channel within this server.`);

        if (!config) {
          await this.bot.mysql.query(`INSERT INTO guilds SET ?`, { guildId: message.guild.id, notifierChannelId: channel })
        } else {
          await this.bot.mysql.query(`UPDATE guilds SET ? WHERE guildId = ${message.guild.id}`, { notifierChannelId: channel })
        }

        return message.channel.createMessage(`Notifier enabled to <#${channel}>`)
    }
};
