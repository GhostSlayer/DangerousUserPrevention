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
        this.config = require('config').util.toObject()
        this.mysql = require('../database');

        this.connect();

        load.all(this)

        setInterval(async () => {
            const config = await this.mysql.rowQuery('SELECT * FROM reports');
            this.editStatus('online', {
                type: 0,
                name: `Reported over ${config.length} times!`
            })
        }, 30000)
    }
}

module.exports = DUPClient;
