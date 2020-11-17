const { Collection, Client } = require('discord.js')
const mongoose = require('mongoose');
const guild = require('./database/guild');
const sendAds = require('./utils/sendAds');
require('dotenv').config()

const bot = new Client()
bot.commands = new Collection();
bot.aliases = new Collection();
require('./utils/load')(bot)

bot.on('message', async (message) => {
    if(message.author.bot) return
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    const guildDB = await guild.get({ id: message.guild.id })
    let prefix = guildDB.guildPrefix
    let args = message.content.slice(prefix.length).trim().split(' ');
    if (args[0] == `@!${bot.user.id}>` && message.mentions.has(bot.user, {ignoreRoles: true, ignoreEveryone: true})) return message.channel.send(`My prefix is **${prefix}**. Check my commands by running **${prefix}help**`)
    let cmd = args.shift().toLowerCase();
    let command;
    if (message.content.startsWith(prefix)) {
        if (bot.commands.has(cmd)) {
            command = bot.commands.get(cmd);
        } else if (bot.aliases.has(cmd)) {
            command = bot.commands.get(bot.aliases.get(cmd));
        }
        if (command) return command.run(bot, message, args)
        else if(cmd.split('').find(x => guildDB.guildPrefix)?.length < cmd.split('')?.length) return message.react('\u274C')
    }
})

bot.once('ready', async () => {
    console.log(`Logged as ${bot.user.username}!`);
    await mongoose.connect(
        process.env.MONGO_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async () => {
            console.log("Connected to db!");
            bot.db = mongoose.connection.collection("guilds")
            console.log("Started sending ads!");
            const db = await bot.db.find().toArray()
            db.forEach(async x => {
                await sendAds.normalAds(10*1000, x.guildId, bot)
                await sendAds.premiumAds(10*1000, x.guildId, bot)
            })
        }
        );
    })
    

bot.login(process.env.TOKEN)