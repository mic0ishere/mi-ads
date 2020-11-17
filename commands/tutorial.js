module.exports = {
    help: {
        name: "tutorial",
        aliases: ["tut"]
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.findOne({ guildId: message.guild.id })
        const prefix = guildDB.guildPrefix
        const tutEmbed = {
            color: 0x0099ff,
            title: `Jak używać bota **${bot.user.username}**?`,
            fields: [
                {
                    name: 'Kanał reklam',
                    value: `Ustaw kanał reklam używając komendy \`${prefix}ch [#kanal]\`. Jeżeli nie ustawisz kanału reklam, twoja reklama nie będzie wysyłana!`
                },
                {
                    name: 'Reklama serwera',
                    value: `Reklamę możesz ustawić komendą \`${prefix}ad [tresc]\`. Po ustawieniu reklamy, zostanie przesłana do weryfikacji. Nie zapomnij o dodaniu zaproszenia do twojego serwera!`
                },
                {
                    name: 'Inne informacje',
                    value: `Jeżeli chcesz dodać bota, lub dołączyć na serwer support, użyj komendy \`${prefix}help\``
                }
            ],
            footer: {
                text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                icon_url: bot.user.displayAvatarURL()
            }
        }
    message.channel.send({embed: tutEmbed})
    }
}