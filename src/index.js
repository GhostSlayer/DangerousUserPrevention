const SlayBotClient = require('./structures/Client');

if (process.env.NODE_ENV === 'development') require('custom-env').env('development')
else require('custom-env').env()

new SlayBotClient(process.env.TOKEN)
