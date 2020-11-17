module.exports = {
    help: {
        name: "ad",
        aliases: ["advertisment"]
    },
    run: async (bot, message, args) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            const guildDB = await bot.db.findOne({ guildId: message.guild.id })
            const exampleEmbed = {
                color: 0x0099ff,
                title: guildDB.adText ? 'Treść aktualnej reklamy:': 'Nie posiadasz ustawionej reklamy!',
                description: guildDB.adText ? guildDB.adText : `Ustaw ją używając komendy \`${guildDB.guildPrefix}ad [treść reklamy]\``,
                footer: {
                    text: `Komenda wywołana przez ${message.author.username + "#" + message.author.discriminator} (${message.author.id})`,
                    icon_url: bot.user.displayAvatarURL()
                }
            };
            if(args[0]) {
                const newData = args.join(" ")
                const inviteUrl = await (await message.guild.channels.cache.get(guildDB.adChannel || message.channel.id)).createInvite({maxAge: 0})
                const verificationEmbed = {
                    color: 0x0099ff,
                    title: `Weryfikacja nr. \`${guildDB.guildId}\``,
                    description: `Zweryfikuj używając komendy \`verify ${guildDB.guildId}\``,
                    fields: [
                        {
                            name: 'Serwer:',
                            value: `${message.guild.name} (ID: ${message.guild.id})\n[\`KLIKNIJ ABY DOŁĄCZYĆ\`](${inviteUrl})`,
                            inline: true
                        },
                        {
                            name: 'Ustawiono kanał reklam?',
                            value: guildDB.adChannel ? `Tak, ${message.guild.channels.cache.get(guildDB.adChannel).name} (${message.guild.channels.cache.get(guildDB.adChannel).id})` : `Nie.`,
                            inline: true
                        },
                        {
                            name: 'Treść reklamy:',
                            value: newData
                        },
                    ]
                };
                exampleEmbed.description = newData
                exampleEmbed.title = "Reklama została wysłana do weryfikacji:"
                await bot.db.findOneAndUpdate({ guildId: message.guild.id }, {$set: { adText: newData, adVerified: false }})
                bot.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).send({embed: verificationEmbed})
            }
            message.channel.send({embed: exampleEmbed})
        } else return message.channel.send("Nie posiadasz wymaganych uprawnień.")
    }
}