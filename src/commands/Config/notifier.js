const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sets the channel where to notify new users and check if they are dangerous or not.',
            userPermissions: 'administrator'
        });
    }

    async run(message, args) {
        const value = args[0];
        const guildSettings = await Guild.findById(message.guild.id);

        if (!args.length) return message.channel.createMessage(`${this.bot.emojis.deny} You have to mention a channel!`)

        if (value.toLowerCase() === 'disable') {
            if (!guildSettings || !guildSettings.notifierChannelId) return message.channel.createMessage('The notifier is already disabled!')
            await guildSettings.deleteOne()
            return message.channel.createMessage(`Disabled the notifier.`)
        }

        const channel = message.channelMentions[0] || message.guild.channels.get(args[0]).id;
        if (!channel) return message.channel.createMessage(`${this.bot.emojis.deny} I couldn't find that channel. Please mention a channel within this server.`);

        if (guildSettings) await guildSettings.updateOne({ notifierChannelId: channel })
        if (!guildSettings) await Guild.create({ _id: message.guild.id, notifierChannelId: channel })

        return message.channel.createMessage(`Notifier enabled to <#${channel}>`)
    }
};
