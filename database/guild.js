const GuildModel = require('./guildModel')
module.exports = new class {
    async get({ id }) {
        GuildModel.db.collection("guilds")
        if(!await GuildModel.findOne({ guildId: id })) await new GuildModel({ guildId: id }).save()
        return await GuildModel.findOne({ guildId: id })
    }
}