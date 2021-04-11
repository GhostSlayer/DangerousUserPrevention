const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stats',
            aliases: ['s', 'botinfo'],
            description: 'Displays information about SlayBot'
        });
    }

    async run(message, bot) {
        let uptime = this.bot.shard ? await this.bot.shard.broadcastEval('this.uptime') : this.bot.uptime;
        if (uptime instanceof Array) {
            uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
        }
        let seconds = uptime / 1000;
        let days = parseInt(seconds / 86400);
        seconds = seconds % 86400;
        let hours = parseInt(seconds / 3600);
        seconds = seconds % 3600;
        let minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);

        uptime = `${seconds}s`;
        if (days) {
            uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours) {
            uptime = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes) {
            uptime = `${minutes}m ${seconds}s`;
        }

        let rss = bot.shard ? await bot.shard.broadcastEval('process.memoryUsage().rss') : process.memoryUsage().rss;
        if (rss instanceof Array) {
            rss = rss.reduce((sum, val) => sum + val, 0);
        }
        let heapUsed = bot.shard ? await bot.shard.broadcastEval('process.memoryUsage().heapUsed') : process.memoryUsage().heapUsed;
        if (heapUsed instanceof Array) {
            heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
        }

        let useramnt = 0;
        this.bot.guilds.forEach(g => {
            useramnt += g.memberCount;
        });

        message.channel.createMessage({
            embed: {
                thumbnail: {
                    url: this.bot.user.avatarURL
                },
                footer: {
                    text: 'Made by Slayer#3102'
                },
                fields: [
                    {
                        name: 'Users',
                        value: `\`${useramnt}\``,
                        inline: true
                    },
                    {
                        name: 'Guilds',
                        value: `\`${this.bot.guilds.size}\``,
                        inline: true
                    },
                    {
                        name: 'Running Events',
                        value: `\`${this.bot.events.length}\``,
                        inline: true
                    },
                    {
                        name: `Bot version`,
                        value: `\`${this.bot.version}\``,
                        inline: true
                    },
                    {
                        name: `Commands`,
                        value: `\`${this.bot.commands.length}\``,
                        inline: true
                    },
                    {
                        name: `Environment`,
                        value: `\`${process.platform} ${process.arch}\``,
                        inline: true
                    },
                    {
                        name: `Library`,
                        value: `\`Eris\``,
                        inline: true
                    },
                    {
                        name: `Library version`,
                        value: `\`v${require("eris").VERSION}\``,
                        inline: true
                    },
                    {
                        name: `Node version`,
                        value: `\`${process.version}\``,
                        inline: true
                    },
                    {
                        name: 'Uptime',
                        value: `\`${uptime}\``,
                        inline: true
                    },
                    {
                        name: 'Shards',
                        value: `\`${this.bot.shard ? `${this.bot.shard.count} Shards` : 'None'}\``,
                        inline: true
                    },
                    {
                        name: 'Memory',
                        value: `\`${(rss / 1024 / 1024).toFixed(2)} MB RSS\`\n`
                            + `\`${(heapUsed / 1024 / 1024).toFixed(2)} MB Heap\``,
                        inline: true
                    }
                ]
            }
        })
    }
};