const { boost } = require("../utils/sendAds")

module.exports = {
    help: {
        name: "premium",
        aliases: ["boost"]
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.findOne({ guildId: message.guild.id })
        if(args[0] == 'add' && message.author.id == process.env.OWNER_ID) {
            const premiumGuildDB = await bot.db.findOne({ guildId: args[1] })
            if(!args[1] || !premiumGuildDB) return message.channel.send("Musisz podać prawidłowe ID serwera, któremu chcesz nadać premium!")
            else {
                await bot.db.findOneAndUpdate({ guildId: args[1] }, {$set: { isPremium: true }})
                message.channel.send('Dodano premium!')
                const inviteUrl = await (await bot.channels.cache.get(premiumGuildDB.adChannel || message.channel.id)).createInvite({maxAge: 0})
                const verificationEmbed = {
                    color: 'GREEN',
                    title: `Premium dla serwera nr. \`${premiumGuildDB.guildId}\` - DODANO`,
                    fields: [
                        {
                            name: 'Serwer:',
                            value: `${message.guild.name} (ID: ${message.guild.id})\n[\`KLIKNIJ ABY DOŁĄCZYĆ\`](${inviteUrl})`,
                            inline: true
                        }
                    ]
                };
                bot.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).send({embed: verificationEmbed})
            }
        } else if(args[0] == 'remove' && message.author.id == process.env.OWNER_ID) {
            const premiumGuildDB = await bot.db.findOne({ guildId: args[1] })
            if(!args[1] || !premiumGuildDB) return message.channel.send("Musisz podać prawidłowe ID serwera, któremu chcesz nadać premium!")
            else {
                await bot.db.findOneAndUpdate({ guildId: args[1] }, {$set: { isPremium: false }})
                message.channel.send('Usunięto premium!')
                const inviteUrl = await (await bot.channels.cache.get(premiumGuildDB.adChannel || message.channel.id)).createInvite({maxAge: 0})
                const verificationEmbed = {
                    color: 'RED',
                    title: `Premium dla serwera nr. \`${premiumGuildDB.guildId}\` - USUNIĘTO`,
                    fields: [
                        {
                            name: 'Serwer:',
                            value: `${message.guild.name} (ID: ${message.guild.id})\n[\`KLIKNIJ ABY DOŁĄCZYĆ\`](${inviteUrl})`,
                            inline: true
                        }
                    ]
                };
                bot.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).send({embed: verificationEmbed})
            }
        } else if(args[0] == 'use') {
            if(guildDB.isPremium != true) message.channel.send("Musisz posiadać usługę premium!")
            else if((Number(guildDB.boostTimeStamp) - message.createdTimestamp) > -(process.env.BOOST_COOLDOWN*1000)) message.channel.send('Musisz jeszcze zaczekać ' + (process.env.BOOST_COOLDOWN-Math.round((guildDB.boostTimeStamp - message.createdTimestamp)/(-1000))) + ' sekund!')
            else if(!guildDB.adText) message.channel.send('Nie masz ustawionej reklamy!')
            else {
                await bot.db.findOneAndUpdate({ guildId: message.guild.id }, {$set: { boostTimeStamp: message.createdTimestamp }})
                const db = await bot.db.find().toArray()
                db.forEach(async x => {
                    await boost(guildDB, x.guildId, bot)
                })
                const embed = {
                    color: 'GREEN',
                    title: `Użyto **boosta**!`,
                    description: `
                    Reklama serwera została wysłana na ${db.length} kanały!
                    `,
                    footer: {
                        text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                        icon_url: bot.user.displayAvatarURL()
                    }
                }
                message.channel.send({embed: embed})
            }
        } else {
            const embed = {
                color: 0x0099ff,
                title: `Premium Info`,
                fields: [
                    {
                        name: 'Opis',
                        value: `Premium to płatna usługa, która wyróżnia się oddzielną, dodatkową kolejką wysyłania reklam oraz możliwością boostowania reklamy serwera specjalną komendą (jednorazowe wysłanie reklamy na wszystkie kanały reklam)`
                    },
                    {
                        name: 'Komendy',
                        value: `\`${guildDB.guildPrefix}premium use\` - użycie boosta`
                    },
                    {
                        name: 'Zakup',
                        value: `Zakup premium już dziś kontaktując się z właścicielem bota, *${process.env.OWNER_NAME}*!`
                    },
                    {
                        name: 'Czy ten serwer ma premium?',
                        value: guildDB.isPremium == true ? '**Tak**' : '**Nie**'
                    }
                ],
                footer: {
                    text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                    icon_url: bot.user.displayAvatarURL()
                }
            }
            message.channel.send({embed: embed})
        }
    }
}