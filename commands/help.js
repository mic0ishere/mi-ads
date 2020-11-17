const { version } = require("../package.json")

module.exports = {
    help: {
        name: "help",
        aliases: ["h", "pomoc"]
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.findOne({ guildId: message.guild.id })
        const prefix = guildDB.guildPrefix
        const linksEmbed = {
            color: 'DARK_RED',
            fields: [
                {
                    name: ':dividers: Wersja',
                    value: `\`${version}\``,
                    inline: true
                },
                {
                    name: ':family: Serwer Support',
                    value: `[\`KLIKNIJ\`](${process.env.BOT_SUPPORT})`,
                    inline: true
                },
                {
                    name: ':robot: Dodaj bota',
                    value: `[\`KLIKNIJ\`](${process.env.BOT_LINK})`,
                    inline: true
                },
                {
                    name: ':brain: Developer',
                    value: '[`mic0#2704`](https://mic0.me)',
                    inline: true
                },
                {
                    name: ':brain: Właściciel',
                    value: `\`${process.env.OWNER_NAME}\``,
                    inline: true
                }
            ]
        }
        const helpEmbed = {
                color: 0x0099ff,
                title: `Lista komend bota **${bot.user.username}**`,
                description: `
                *[] - opcjonalne, <> - wymagane*
                \`${prefix}help\` - wyświetla menu pomocy
                \`${prefix}tut\` - pomaga w ustawieniu bota na serwerze
                \`${prefix}premium [opcja]\` - wysyła informacje dot. premium
                \`${prefix}stats\` - statystyki bota
                \`${prefix}ad [tresc]\` - ustawia reklamę
                \`${prefix}ch [#kanal]\` - ustawia kanał reklam
                \`${prefix}prefix [tresc]\` - zmienia prefix bota
                `,
                footer: {
                    text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                    icon_url: bot.user.displayAvatarURL()
                }
        }
        message.channel.send({embed: linksEmbed})
        message.channel.send({embed: helpEmbed})
    }
}