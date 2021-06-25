const {readdirSync, statSync} = require('fs');
const path = require('path');
const { SlashCreator, GatewayServer } = require('slash-create');
const config = require('config').util.toObject()
const creator = new SlashCreator({
    applicationID: config.bot.clientId,
    publicKey: config.bot.publicKey,
    token: config.bot.token,
});

const command_directory = path.join(__dirname, "../commands");
const event_directory = path.join(__dirname, "../events");

const slash_command_directory = path.join(__dirname, "../slash-commands")

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

    const slashFiles = readdirSync(slash_command_directory);

    creator
        .withServer(
            new GatewayServer(
                (handler) => bot.on('rawWS', (event) => {
                    if (event.t === 'INTERACTION_CREATE') {
                        handler(event.d)
                        console.log(`"${event.d.data.name}" ran by ${event.d.member.user.username}#${event.d.member.user.discriminator} (${event.d.member.user.id}) in guild ${event.d.guild_id} `)
                    }
                })
            )
        )

    slashFiles.forEach(subfolder => {
        const stats = statSync(`${slash_command_directory}/${subfolder}`);
        if (!stats.isDirectory) return;
        const cmds = readdirSync(`${slash_command_directory}/${subfolder}`);

        creator
            .registerCommandsIn(`${slash_command_directory}/${subfolder}`)
            .syncCommands()


        cmds.forEach(cmd => {
            let command;
            try {
                if (cmd.isDirectory || !cmd.endsWith(".js")) return;
                command = require(`${slash_command_directory}/${subfolder}/${cmd}`);
            } catch (err) {
                console.log(`${cmd} failed to load: ${err}`)
            }

            // Adds commands
            if (!command) return;
            const _command = new command(bot, subfolder, /(.{1,})\.js/.exec(cmd)[1]);
            bot.slash_commands.push(_command);
        });
    });

    console.log(`${bot.slash_commands.length} slash commands loaded`)

    console.log(`${bot.commands.length} commands loaded`)
}

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
        if(event.disable) return
        bot.on(event.name, (arg1, arg2, arg3, arg4, arg5) => {
            event.run(arg1, arg2, arg3, arg4, arg5);
        });
    });

    console.log(`${bot.events.length} events loaded`)
}

module.exports.all = async function loadAll(bot) {
    await this.commands(bot);
    await this.events(bot);
};
