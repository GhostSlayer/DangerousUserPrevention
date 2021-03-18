const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sets the channel where to notify new users and check if they are dangerous or not.',
            userPermissions: 'administrator'
        });
    }

    async run(message, args) {
        const match = message.content.match(/\d{18}/);
        let member = match ? await this.bot.getRESTUser(match[0]) : message.member.user

        const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${member.id}`).then(res => res.json())
        const score = user.score.replace('%', '')
        let construct = []

        if (score >= 0 && score <= 29) {
            construct.push({
                name: 'Safe',
                value: match ? `${member.username} is completely safe.` : 'Your account is completely safe'
            })
        }

        if (score >= 30 && score <= 49) {
            construct.push({
                name: 'Dunno',
                value: match ? `${member.username} might be dangerous` : 'Your account might be dangrous'
            })
        }

        if (score >= 50 && score <= 100) {
            construct.push({
                name: 'Dangerous',
                value: match ? `${member.username} is dangerous! Ban that user fast as possible!` : 'Your account is dangerous!!'
            })
        }

        message.channel.createMessage({
            embed: {
                fields: construct,
                footer: { text: user.total_reports ? match ?
                        // if args
                        `This user has been reported ${user.total_reports === 1 ? '1 time' : `${user.total_reports} times`}`
                        // if no args
                        : `You have been reported ${user.total_reports === 1 ? '1 time' : `${user.total_reports} times`}`
                        // if never reported
                        : match ? 'This user have never been reported' : 'You have never been reported'
                }
            }
        })

    }
};
