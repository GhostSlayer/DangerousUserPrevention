const Event = require('../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageCreate",
        });
    }

    async run(message) {
        const mentionRegexPrefix = RegExp(`^<@!?${this.bot.user.id}>`);
        
        if (!message || !message.member || message.member.bot) return;

        const query = await this.bot.mysql.query(`SELECT * FROM guilds WHERE guildId = ?`, message.guild.id)
        const config = Object.values(JSON.parse(JSON.stringify(query)))[0];

        let mainPrefix = config && config.prefix ? config.prefix : process.env.PREFIX;
        const prefix = message.content.match(mentionRegexPrefix) ?
        message.content.match(mentionRegexPrefix)[0] : mainPrefix;

        if (!message.content.startsWith(prefix)) return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.bot.commands.find(c => c.id === cmd.toLowerCase() || c.aliases.includes(cmd.toLowerCase()));

        if (command) {
            try {
                if (command.disable) return message.channel.createMessage(`This command is disabled.`);

                if (command.userPermissions) {
                    if (!message.channel.memberHasPermission(message.author.id, command.userPermissions)) {
                        return message.channel.createMessage(`You do not have the following permissions to do this action: \`${command.userPermissions}\``)
                    }
                }

                await command.run(message, args)
                console.log(`${message.content} (${command.id}) ran by ${message.author.tag} (${message.author.id})`)
            } catch(err) {
                if (err && err.code && err.code === 10007 || err.code === 10008 || err.code === 10011 || err.code === 10013 ||
                    err.code === 10026 || err.code === 50001 || err.code === 50007 || err.code === 50013 || err.code === 90001 || err === "timeout") return;

                return message.channel.createMessage('Sorry, an error occured..')
            }
        }
    }
};
