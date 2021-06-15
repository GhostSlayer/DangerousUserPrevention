const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Get support for DUP'
        });
    }

    async run(message) {
        message.channel.createMessage({
            embed: {
                title: 'Drivet Support',
                description: 'Looking to get support for DUP and Drivet\'s products? Join us here: https://discord.drivet.xyz'
            }
        })
    }
};
