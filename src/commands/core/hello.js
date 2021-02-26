const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'hi'
        });
    }

    run(message) {
        message.channel.createMessage('Hello!')
    }
};
