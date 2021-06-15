const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['lookup', 'search'],
            description: 'Checks the user\'s information in DDUB',
            usage: '<user>',
            examples: ['check 267386908382855169', 'check @GhostSlayer#0001']
        });
    }

    async run(message, args) {
        const match = args.toString().match(/\d{18}/);
        let member = match ? await this.bot.getRESTUser(match[0]) : message.member.user

        const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${member.id}`).then(res => res.json())
        const score = user.score.replace('%', '')
        let construct = []

        if (parseInt(score) === parseInt(0) && user.total_reports >= 1) {
            construct.push({
                name: 'Safe',
                value: match ? `${member.username} is a whitelisted user.` : 'Your account is whitelisted.'
            })

            construct.push({
                name: 'Note',
                value: 'While the user appears to be whitelisted, it does not mean the user is safe all the time.'
            })
        }

        if (score > 1 && score <= 29) {
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
                color: parseInt(this.bot.colors.BLURPLE),
                author: {
                    name: member.tag,
                    icon_url: member.dynamicAvatarURL()
                },
                url: `https://discord.riverside.rocks/check?id=${member.id}`,
                description: `[See reports here](https://discord.riverside.rocks/check?id=${member.id})`,
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
