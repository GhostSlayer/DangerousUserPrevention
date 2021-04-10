const DUPClient = require('./structures/Client');
const path = require('path');

if (process.env.NODE_ENV === 'development') require('custom-env').env('development')
else require('custom-env').env()


let options = {
    restMode: true,
    intents: [
        'guilds',
        'guildMessages',
        'guildMessageReactions',
        'directMessages',
        'directMessageReactions',
    ],
}

new DUPClient(process.env.TOKEN, options)
