const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Get support for DUP'
        });
    }

    async run(message, args) {
        message.channel.createMessage({
            embed: {
                title: 'Drivet Support',
                description: 'Looking to get support for DUP and Drivet\'s products? Join us here: https://discord.drivet.xyz'
            }
        })
    }
};
