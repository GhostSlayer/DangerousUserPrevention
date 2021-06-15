const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Show all reports by DUP',
        });
    }

    async run(message) {
        const reports = await this.bot.mysql.rowsQuery('SELECT * FROM reports LIMIT 5', message.guild.id);
        let construct = []

        reports.forEach((report) => {
            construct.push({
                name: report.reported_user,
                value: report.reason
            })
        })

        message.channel.createMessage({
            embed: {
                title: 'All reports by DUP',
                fields: construct,
                footer: { text: 'Showing the latest 5 reports'}
            }
        })
    }
};
