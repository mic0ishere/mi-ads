module.exports = {
    help: {
        name: "channel",
        aliases: ["ch"]
    },
    run: async (bot, message, args) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            const guildDB = await bot.db.findOne({ guildId: message.guild.id })
            const exampleEmbed = {
                color: 0x0099ff,
                title: guildDB.adChannel ? `Kanał reklam ustawiony` : 'Brak kanału reklam!',
                description: guildDB.adChannel ? `Reklamy są wysyłane na: ${message.guild.channels.cache.get(guildDB.adChannel)}\nMożesz zmienić kanał reklam używając komendy \`${guildDB.guildPrefix}prefix [nowy prefix]\`` : `Ustaw kanał reklam używając komendy \`${guildDB.guildPrefix}prefix [nowy prefix]\``,
                footer: {
                    text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                    icon_url: bot.user.displayAvatarURL()
                }
            };
            if(message.mentions.channels.first()) {
                const newData = message.mentions.channels.first()
                exampleEmbed.description = `Reklamy będą wysyłane na: ${newData}\nMożesz ponownie zmienić kanał reklam używając komendy \`${guildDB.guildPrefix}channel [nowy kanał]\``,
                exampleEmbed.title = "Ustawiono nowy kanał reklam"
                await bot.db.findOneAndUpdate({ guildId: message.guild.id }, {$set: { adChannel: newData.id }})
            }
            message.channel.send({embed: exampleEmbed})
        } else return message.channel.send("Nie posiadasz wymaganych uprawnień.")
    }
}