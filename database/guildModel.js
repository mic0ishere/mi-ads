const { model } = require('mongoose');
module.exports = model('guild', {
    guildId: String,
    guildPrefix: { type: String, default: "!" },
    isPremium: { type: Boolean, default: false },
    boostTimeStamp: { type: Number, default: null },
    adChannel: { type: String, default: null },
    adSent: { type: Number, default: 0 },
    adText: { type: String, default: null },
    adVerified: { type: Boolean, default: false },
});