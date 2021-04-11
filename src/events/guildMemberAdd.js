const Event = require('../structures/Event');
const fetch = require('node-fetch');
const Guild = require('../database/schemas/Guild');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberAdd",
        });
    }

    async run(guild, member) {
        const settings = await Guild.findOne({ guildId: guild.id })

        console.log(member)

        if (settings && settings.notifierChannelId) {
            const user = await fetch(`https://discord.riverside.rocks/check.json.php?id=${member.id}`).then(res => res.json())
            const score = user.score.replace('%', '') // remove that percent symbol to get only the amount
            const notifierChannel = guild.channels.get(settings.notifierChannelId)

            if (score >= 0 && score <= 29) {
                notifierChannel.createMessage({
                    embed: {
                        color: parseInt(this.bot.colors.GREEN),
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
                        title: 'Not too dangerous',
                        author: {
                            name: member.user.username,
                            icon_url: member.avatarURL
                        }
                    },
                })
            }

            if (score >= 50 && score <= 100) {
                member.createMessage(`You have been banned from \`${guild.name}\` for having too big abuse score. Your abuse score is ${score}%`)
                notifierChannel.createMessage({
                    embed: {
                        color: parseInt(this.bot.colors.RED),
                        title: 'Dangerous!',
                        author: {
                            name: member.user.username,
                            icon_url: member.avatarURL
                        }
                    },
                })
                setTimeout(() => {
                    member.ban(7, `Banned automatically by DUP: User's abuse score is ${score}%`)
                }, '700')
            }


        }

    }
};
