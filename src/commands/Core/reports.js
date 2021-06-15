const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Show all reports by DUP',
        });
    }

    async run(message) {
        const query = await this.bot.mysql.rowsQuery('SELECT * FROM reports');
        const reports = query.reverse();

        let construct = []

        reports.slice(0, 5).forEach((report, i) => {
            construct.push({
                name: report.reported_user,
                value: report.reason ? report.reason : 'No reason provided'
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
