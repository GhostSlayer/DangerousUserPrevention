const Event = require('../structures/Event');
const fetch = require('node-fetch');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberAdd",
        });
    }

    async run(guild, member) {
        const query = await this.bot.mysql.query('SELECT * FROM `guilds` WHERE `guildId` = ', guild.id);
        const settings = Object.values(JSON.parse(JSON.stringify(query)))[0];

        console.log(member)

        if (settings && settings.notifierChannelId) {
            const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${member.id}`).then(res => res.json())
            const score = user.score.replace('%', '') // remove that percent symbol to get only the amount
            const notifierChannel = guild.channels.get(settings.notifierChannelId)

            if (score >= 0 && score <= 29) {
                notifierChannel.createMessage({
                    embed: {
                        color: parseInt(this.bot.colors.GREEN),
                        url: `https://discord.riverside.rocks/check?id=${member.id}`,
                        title: 'Safe',
                        author: {
                            name: member.user.username,
                            icon_url: member.avatarURL
                        }
                    },
                })
            }

            if (score >= 30 && score <= 49) {
                notifierChannel.createMessage({
                    embed: {
                        color: parseInt(this.bot.colors.YELLOW),
                        url: `https://discord.riverside.rocks/check?id=${member.id}`,
                        title: 'Not too dangerous',
                        author: {
                            name: member.user.username,
                            icon_url: member.avatarURL
                        }
                    },
                })
            }

            if (score >= 50 && score <= 100) {
                notifierChannel.createMessage({
                    embed: {
                        color: parseInt(this.bot.colors.RED),
                        url: `https://discord.riverside.rocks/check?id=${member.id}`,
                        title: 'Dangerous!',
                        author: {
                            name: member.user.username,
                            icon_url: member.avatarURL
                        }
                    },
                })
            }


        }

    }
};
