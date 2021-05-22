const load = require("./Util");
const { Client } = require("eris-additions")(require("eris"))
class DUPClient extends Client {
    constructor(bot, options) {
        super(bot, options);

        this.commands = [];
        this.slash_commands = [];
        this.events = [];
        this.version = require("../../package.json").version;
        this.colors = require('../settings/colors.json').colors;
        this.mysql = require('../database/mysql');

        this.connect();

        load.all(this)

        setInterval(async () => {
            const query = await this.mysql.query('SELECT * FROM reports');
            const config = Object.values(JSON.parse(JSON.stringify(query)));
            this.editStatus('online', {
                type: 1,
                name: `Reported over ${config.length} times!`,
                url: 'https://discord.riverside.rocks'
            })
        }, 30000)
    }
}

module.exports = DUPClient;
