const Event = require('../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate",
        });
    }

    async run(guild) {
        const userRest = await this.bot.getRESTUser(guild.ownerID)

        console.log(`Added to ${guild.name} (${guild.id})`)

        this.bot.createMessage('830578159660957736', {
            embed: {
                color: parseInt(this.bot.colors.GREEN),
                description: `I have joined the ${guild.name} server`,
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
                    text: `Gained ${guild.memberCount} members • I'm now in ${this.bot.guilds.size} servers!`
                }
            }
        }).catch(() => {})
    }
};
