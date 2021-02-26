const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
    _id: { type: String, required: true },
    notifierChannelId: { type: String }
});

module.exports = mongoose.model('guild', guildConfigSchema);
