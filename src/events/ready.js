const Event = require('../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
        });
    }

    async run(id) {
        console.log(`Shard ${id || '0'} connected`)
    }
};