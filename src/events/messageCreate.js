const Event = require('../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageCreate",
        });
    }

    async run(message) {
        if (!message || !message.member || message.member.bot) return;

        let prefix = '!';

        if (!message.content.startsWith(prefix)) return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.bot.commands.find(c => c.id === cmd.toLowerCase() || c.aliases.includes(cmd.toLowerCase()));

        if (command) {
            await command.run(message, args)
            console.log(`${message.content} (${command.id}) ran by ${message.author.tag} (${message.author.id})`)
        }
    }
};
