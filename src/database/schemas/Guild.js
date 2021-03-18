const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    notifierChannelId: { type: String, unique: true }
});

module.exports = mongoose.model('guild', guildConfigSchema);
