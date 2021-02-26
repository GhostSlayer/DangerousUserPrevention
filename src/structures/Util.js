const {readdirSync, statSync} = require('fs');
const path = require('path');

const command_directory = path.join(__dirname, "../commands");
const event_directory = path.join(__dirname, "../events");

module.exports.commands = async function loadCommands(bot) {
    const files = readdirSync(command_directory);
    files.forEach(subfolder => {
        const stats = statSync(`${command_directory}/${subfolder}`);
        if (!stats.isDirectory) return;
        const cmds = readdirSync(`${command_directory}/${subfolder}`);

        cmds.forEach(cmd => {
            let command;
            try {
                if (cmd.isDirectory || !cmd.endsWith(".js")) return;
                command = require(`${command_directory}/${subfolder}/${cmd}`);
            } catch (err) {
                console.log(`${cmd} failed to load: ${err}`)
            }

            // Adds commands
            if (!command) return;
            const _command = new command(bot, subfolder, /(.{1,})\.js/.exec(cmd)[1]);
            bot.commands.push(_command);
        });
    });

    console.log(`${bot.commands.length} commands loaded`)
};

module.exports.events = async function loadEvents(bot) {
    const files = readdirSync(event_directory);
    files.forEach(evnt => {
        let event;
        try {
            if (evnt.isDirectory || !evnt.endsWith(".js")) return;
            event = require(`${event_directory}/${evnt}`);
        } catch (err) {
            console.log(`${evnt} failed to load: ${err}`)
        }

        // Adds events; runs them
        bot.events.push(new event(bot, /(.{1,})\.js/.exec(evnt)[1]));
        event = bot.events.find(e => e.id === evnt.split(".js")[0]);
        bot.on(event.name, (arg1, arg2, arg3, arg4, arg5) => {
            event.run(arg1, arg2, arg3, arg4, arg5);
        });
    });

    console.log(`${bot.events.length} events loaded`)
};

module.exports.all = async function loadAll(bot) {
    this.commands(bot);
    this.events(bot);
};
