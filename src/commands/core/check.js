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
        let member = match ? await this.bot.getRESTUser(message.guild.id, match[0]) : message.member.user

        const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${member.id}`).then(res => res.json())
        const score = user.score.replace('%', '')
        let construct = []

        if (score >= 0 && score <= 29) {
            construct.push({
                name: 'Safe',
                value: 'This user is completely safe.'
            })
        }

        if (score >= 30 && score <= 49) {
            construct.push({
                name: 'Dunno',
                value: 'This user might be dangerous'
            })
        }

        if (score >= 50 && score <= 100) {
            construct.push({
                name: 'Dangerous',
                value: 'This user is dangerous! Ban them as fast as possible'
            })
        }

        message.channel.createMessage({
            embed: {
                fields: construct,
                footer: { text: `This user has ${user.total_reports} reports` }
            }
        })

    }
};
