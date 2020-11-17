module.exports = {
    help: {
        name: "prefix",
        aliases: []
    },
    run: async (bot, message, args) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            const guildDB = await bot.db.findOne({ guildId: message.guild.id })
            const exampleEmbed = {
                color: 0x0099ff,
                title: `Aktualny prefix: ${guildDB.guildPrefix}`,
                description: `Możesz zmienić prefix używając komendy \`${guildDB.guildPrefix}prefix [nowy prefix]\``,
                footer: {
                    text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                    icon_url: bot.user.displayAvatarURL()
                }
            };
            if(args[0]) {
                const newData = args.join(" ")
                exampleEmbed.description = `Możesz ponownie zmienić prefix używając komendy \`${newData}prefix [nowy prefix]\``,
                exampleEmbed.title = "Ustawiono nowy prefix: " + newData
                await bot.db.findOneAndUpdate({ guildId: message.guild.id }, {$set: { guildPrefix: newData }})
            }
            message.channel.send({embed: exampleEmbed})
        } else return message.channel.send("Nie posiadasz wymaganych uprawnień.")
    }
}