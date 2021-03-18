class Event {
    constructor(bot, id, params) {
        this.bot = bot;
        this.id = id;
        this.name = params.name || this.id;
        this.disable = params.disable || false
    }
}

module.exports = Event;
