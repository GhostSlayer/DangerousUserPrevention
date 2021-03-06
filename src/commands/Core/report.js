const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Report a user to DDUB',
            usage: '<user> [reason]',
            examples: ['report 267386908382855169 Spamming', 'report @GhostSlayer#0001']
        });
    }

    async run(message, args) {
        if (!args.length) return message.channel.createMessage('Please give a user\'s id to report!')
        const match = args.toString().match(/\d{18}/);
        let member = match ? await this.bot.getRESTUser(match[0]) : null

        let reason = args.slice(1).join(' ')

        if (!member) return message.channel.createMessage('That user was not found!')
        if (member.id === message.author.id) return message.channel.createMessage('You can\'t report yourself!')

        const report = await fetch(`https://discord.riverside.rocks/report.json.php?id=${member.id}&key=${this.bot.config.ddubToken}&details=${reason ? reason : 'No reason'} (Reported by ${message.author.username})`).then(res => res.json())

        if (!report) return message.channel.createMessage('Report failed. DDUB didn\'t receive the request!')
        if (report.message === 'You can only report a user every 10 minutes.') return message.channel.createMessage('This user has been already reported within the 10 minutes!')

        const post = { author: message.author.id, 'reported_user': member.id, reason }
        await this.bot.mysql.query('INSERT INTO reports SET ?', post)

        message.channel.createMessage({
            embed: {
                color: parseInt(this.bot.colors.BLURPLE),
                url: `https://discord.riverside.rocks/check?id=${member.id}`,
                title: 'User Reported!',
                description: `${member.username} was reported successfully!`,

            }
        })
    }
};
