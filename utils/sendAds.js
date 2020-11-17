module.exports.normalAds = async (time, guildId, bot) => {
    const ads = await bot.db.find().toArray()
    const guild = await bot.db.findOne({ guildId: guildId })
    let adNum = -1
    const interval = setInterval(() => {
        adNum++
        if(!ads[adNum] || ads[adNum].adVerified != true) {
            this.normalAds(time, guildId,bot)
            return clearInterval(interval)
        }
        if(ads[adNum].adText && ads[adNum].adVerified == true && bot.channels.cache.get(ads[adNum].adChannel)){
            bot.channels.cache.get(guild.adChannel)?.send(`**ID: \`${ads[adNum].guildId}\` Cykl: \`STANDARD\`**\n${ads[adNum].adText}`)
        }
    }, time)
}

module.exports.boost = async (ad, guildId, bot) => {
    const guild = await bot.db.findOne({ guildId: guildId })
    bot.channels.cache.get(guild.adChannel)?.send(`**ID: \`${ad?.guildId}\` Cykl: \`BOOST\`**\n${ad?.adText}`)
}

module.exports.premiumAds = async (time, guildId, bot) => {
    const ads = await bot.db.find().toArray()
    const guild = await bot.db.findOne({ guildId: guildId })
    let adNum = ads.length
        const interval = setInterval(() => {
            adNum--
            if(!ads[adNum]) {
                this.premiumAds(time, guildId,bot)
                return clearInterval(interval)
            }
            if(ads[adNum].adText && ads[adNum].adVerified == true && bot.channels.cache.get(ads[adNum].adChannel) && ads[adNum].isPremium == true){
                bot.channels.cache.get(guild.adChannel)?.send({ embed: {
                    color: '#DAA520',
                    title: `**ID: \`${ads[adNum].guildId}\` Cykl: \`PREMIUM\`**`,
                    description: ads[adNum].adText,
                    footer: {
                        text: `Reklama premium - zakup swoją komendą ${guild.guildPrefix}premium`,
                        icon_url: bot.user.displayAvatarURL()
                    }
                }})
            }
        }, time * Math.random())
}