const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Checks the user\'s information in DDUB'
        });
    }

    async run(message, args) {
        if (!args.length) return message.channel.createMessage('Please give a user\'s id to report!')
        const match = message.content.match(/\d{18}/);
        let member = match ? await this.bot.getRESTUser(match[0]) : null

        let reason = args.slice(1).join(' ')

        if (member.id === message.author.id) return message.channel.createMessage('You can\'t report yourself!')
        if (!member) return message.channel.createMessage('That user was not found!')

        const report = await fetch(`https://discord.riverside.rocks/report.json.php?id=${member.id}&key=${process.env.DDUB_TOKEN}&details=${reason} (Reported by ${message.author.username})`).then(res => res.json())

        if (!report) return message.channel.createMessage('Report failed. DDUB didn\'t receive the request!')
        if (report.message === 'You can only report a user every 10 minutes.') return message.channel.createMessage('This user has been already reported within the 10 minutes!')

        message.channel.createMessage({
            embed: {
                color: 0x7289DA,
                url: `https://discord.riverside.rocks/check?id=${member.id}`,
                title: 'User Reported!',
                description: `${member.username} was reported successfully!`,

            }
        })
    }
};
