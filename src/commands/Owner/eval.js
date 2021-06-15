const Command = require('../../structures/Command');
const {inspect} = require('util');
const {Type} = require('@extreme_hero/deeptype');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['ev'],
            description: 'Eval some code',
            ownerOnly: true,
            usage: '<function>',
            examples: ['eval message.author.id', 'eval this.bot.token']
        });
    }

    async run(message, args) {
        if (!args.length) return message.channel.createMessage('What should I eval?');

        let code = args.join(' ');
        code = code.replace(/[""]/g, '"').replace(/['']/g, "'");
        let evaled;
        try {
            const start = process.hrtime();
            evaled = eval(code);
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }
            const stop = process.hrtime(start);
            const response = [
                `**Output:** \`\`\`js\n${this.clean(inspect(evaled, {depth: 0}))}\n\`\`\``,
                `**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
                `**Time Taken:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms \`\`\``,
            ];
            const res = response.join('\n');
            if (res.length < 2000) {
                await message.channel.createMessage({
                    embed: {
                        description: res,
                        color: parseInt(this.bot.colors.GREEN),
                    },
                });
            } else {
                return;
            }
        } catch (err) {
            await message.channel.createMessage({
                embed: {
                    description: `Error: \`\`\`xl\n${this.clean(err)}\n\`\`\``,
                    color: parseInt(this.bot.colors.RED),
                },
            });
            return;
        }
    };

    clean(text) {
        if (typeof text === 'string') {
            text = text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(new RegExp(this.bot.token, 'gi'), '****')
        }
        return text;
    }
};