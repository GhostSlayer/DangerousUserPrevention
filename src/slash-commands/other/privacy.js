const { SlashCommand } = require('slash-create');

module.exports = class ReportCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'privacy',
            description: 'DUP\'s privacy command',
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run() {
        try {
            let construct = [];

            construct.push({
                name: 'What data we collect',
                value: 'When reporting, these data will be collected: your id, reported user id, reason. That\'s all.\n\nIf you have any configuration set on DUP, the server configuration is saved on the database with the server id.'
            })

            construct.push({
                name: 'Access to data',
                value: 'Only the developer and owner of DUP has access to the database. We don\'t sell or give data to other individuals'
            })

            construct.push({
                name: 'Third-party',
                value: 'We use DDUB (discord.riverside.rocks) to handle these all reports and user checks. You can see DDUB Legal here: https://riverside.rocks/about/legal'
            })

            return ({
                embeds: [{
                    color: 0x7289DA,
                    title: 'Privacy',
                    description: 'We care about everyone\'s privacy and it\'s very important for us',
                    fields: construct
                }]
            })

        } catch (err) {
            console.log(err)
            return 'Sorry, something went wrong'
        }
    }
}
