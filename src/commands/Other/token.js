const Command = require('../../structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Want to report with your own token? Sure'
        });
    }

    async run(message, args) {
        if (message.guild) return message.deny('errors:dmOnly');
        if (!args.length) return message.channel.createMessage(await message.translate('commands:token.noArgs'))

        const config = await this.bot.mysql.rowQuery('SELECT * FROM tokens WHERE id = ?', message.author.id)
        const token = args[0];

        const data = await fetch(`https://discord.riverside.rocks/auth.json.php?key=${token}`).then(res => res.json())

        if (data.message.includes('invalid API')) return message.deny('Invalid API key.')

        if (!config) {
            await this.bot.mysql.query(`INSERT INTO tokens SET ?`, { id: message.author.id, token })
        } else {
            await this.bot.mysql.query(`UPDATE tokens SET token = ? WHERE id = ?`, [token, message.author.id])
        }

        return message.accept('Done!')


    }
};
