const Event = require('../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildDelete",
        });
    }

    async run(guild) {
        const userRest = await this.bot.getRESTUser(guild.ownerID)

        this.bot.createMessage('830578159660957736', {
            embed: {
                color: parseInt(this.bot.colors.RED),
                description: `I have left the ${guild.name} server`,
                thumbnail: {
                    "url": guild.iconURL ? guild.iconURL : 'https://cdn.slaybot.xyz/static/Pastel-Red.png'
                },
                fields: [
                    {
                        name: 'Server Owner',
                        value: `${userRest.username}#${userRest.discriminator} / ${guild.ownerID}`
                    },
                    {
                        name: 'Server ID',
                        value: guild.id
                    }
                ],
                footer: {
                    text: `Lost ${guild.memberCount} members • I'm now in ${this.bot.guilds.size} servers..`
                }
            }
        }).catch(() => {})
    }
};
