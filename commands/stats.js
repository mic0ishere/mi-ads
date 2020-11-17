const os = require('os');
module.exports = {
    help: {
        name: "stats",
        aliases: ["ping"]
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.findOne({ guildId: message.guild.id })
        let totalSeconds = (bot.uptime / 1000)
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor((totalSeconds % 86400) / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund`;
        let memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        let embedEdit = await message.channel.send("Pinging...")
        let ping = embedEdit.createdTimestamp - message.createdTimestamp;
        const messageEmbed = {
            color: 0x0099ff,
            title: 'Statystyki',
            fields: [
                {
                    name: 'Statystyki serwera:',
                    value: `
                    Reklama serwera: **${guildDB.adVerified ? 'Zweryfikowana' : guildDB.adText ? 'W trakcie weryfikacji' : 'Nie ustawiona'}**
                    *Aby zobaczyć reklamę użyj komendy* \`${guildDB.guildPrefix}ad\`
                    Premium: **${guildDB.isPremium ? 'Tak' : 'Nie'}**
                    Kanał reklam: ${guildDB.adChannel ? message.guild.channels.cache.get(guildDB.adChannel) : 'Nie ustawiono'}`,
                },
                {
                    name: 'Statystyki bota:',
                    value: `
                    Ping: **${ping}**ms.
                    Uptime: **${uptime}**
                    Zajmowana pamięć: **${memory}/${Math.round(os.totalmem()/1024/1024)}** mb.
                    `,
                }
            ],
            footer: {
                text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                icon_url: bot.user.displayAvatarURL()
            }
        };
        embedEdit.edit({embed: messageEmbed, content: ''})
    }
}