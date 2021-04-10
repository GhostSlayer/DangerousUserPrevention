const { SlashCommand, CommandOptionType } = require('slash-create');
const fetch = require('node-fetch');
const REST = require('../../utils/rest')

module.exports = class CheckCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'check',
            description: 'Checks the user\'s information in DDUB',
            options: [{
                type: CommandOptionType.USER,
                name: 'user',
                required: true,
                description: 'A user is needed'
            }]
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            const match = ctx.member.user.id !== ctx.options.user;
            let member = match ? await REST.getUser(ctx.options.user) : ctx.member.user

            const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${ctx.options.user}`).then(res => res.json())

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

            let embed = {
                description: 'All data comes from [DDUD](https://discord.riverside.rocks)',
                fields: construct,
                footer: {
                    text: user.total_reports ? match ?
                        // if args
                        `This user has been reported ${user.total_reports === 1 ? '1 time' : `${user.total_reports} times`}`
                        // if no args
                        : `You have been reported ${user.total_reports === 1 ? '1 time' : `${user.total_reports} times`}`
                        // if never reported
                        : match ? 'This user have never been reported' : 'You have never been reported'
                }
            }


            return ({ embeds: [embed] })
        } catch (err) {
            console.log(err)
            return 'Sorry, something went wrong'
        }
    }
}
