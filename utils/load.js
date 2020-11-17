const fs = require('fs')

module.exports = async (bot) => {
    await fs.readdir(`./commands`, (err, files) => {
        if (err) console.error(err);
        let jsfiles = files.filter((f) => f.split(".").pop() === "js");
  
        if (jsfiles.length <= 0)
          return console.log("There are no commands to load...");
        jsfiles.forEach((f, i) => {
          let props = require(`../commands/${f}`);
          console.log(`${i + 1}: ${f} loaded!`);
          bot.commands.set(props.help.name, props);
          if (props.help.aliases[0])
            props.help.aliases.forEach((alias) => {
              bot.aliases.set(alias, props.help.name);
            });
        });
      });
}