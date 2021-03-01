const DUPClient = require('./structures/Client');

if (process.env.NODE_ENV === 'development') require('custom-env').env('development')
else require('custom-env').env()

new DUPClient(process.env.TOKEN, {
    intents: [
        'guilds',
        'guildMessages',
        'guildMessageReactions',
        'directMessages',
        'directMessageReactions',
    ],
    restMode: true
})
