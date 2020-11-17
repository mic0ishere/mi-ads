module.exports = {
    help: {
        name: "verify",
        aliases: []
    },
    run: async (bot, message, args) => {
        if(message.guild.id == bot.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).guild.id && message.member.hasPermission("MANAGE_GUILD")) {
            const guildDB = await bot.db.findOne({ guildId: args[0] })
            if(!args[0] || !guildDB) return message.channel.send("Musisz podać prawidłowe ID serwera")
            else {
                await bot.db.findOneAndUpdate({ guildId: args[0] }, {$set: { adVerified: true }})
                message.channel.send('Zweryfikowano reklamę!')
                const inviteUrl = await (await bot.channels.cache.get(guildDB.adChannel)).createInvite({maxAge: 0})
                const verificationEmbed = {
                    color: 'GREEN',
                    title: `Weryfikacja nr. \`${guildDB.guildId}\` - ZWERYFIKOWANO`,
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
        } else return message.channel.send("Nie posiadasz wymaganych uprawnień.")
    }
}