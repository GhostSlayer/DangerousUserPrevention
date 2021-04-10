const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['pong'],
            description: 'Check\'s the latency of DUP',
        });
    }

    async run(message, args) {
        const msg = await message.channel.createMessage('Pinging...');

        const latency = msg.timestamp - message.timestamp;

        msg.edit({
            embed: {
                title: 'DUP Ping',
                fields: [
                    {
                        name: 'Time Taken',
                        value: `${latency}ms`
                    },
                    {
                        name: 'Discord API',
                        value: `${message.channel.guild.shard.latency}ms`
                    }
                ]
            }
        })
    }

};
