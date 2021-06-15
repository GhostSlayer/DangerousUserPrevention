const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Blacklist a server or a user.',
            ownerOnly: true
        });
    }

    async run(message, args) {
      let type = args[0]
      let method = args[1]
      let id = args[2]
      let reason = args.slice(3).join(' ')

      if (!method) return message.channel.createMessage('You need to choose **add** or **remove**')
      if (!type) return message.channel.createMessage('You need to choose **user** or **guild**')
      if (!id) return message.channel.createMessage('You need to type the **user id** or **guild id**')
      if (method.toLowerCase() !== 'remove' && !reason) return message.channel.createMessage('You need to type the reason for the blacklist')


      if (type.toLowerCase() === 'user') {
          const blacklistSettings = await this.bot.mysql.rowQuery('SELECT * FROM blacklist WHERE id = ?', [id])
          console.log(blacklistSettings)

          const apiUser = await this.bot.getRESTUser(id).catch(() => {})

          if (method.toLowerCase() === 'add') {
              if (!blacklistSettings.length) {
                  await this.bot.mysql.query('INSERT INTO blacklist SET ?', { id, type, reason, date: new Date() })
                  return message.channel.createMessage({
                      embed: {
                          color: parseInt(this.bot.colors.GREEN),
                          title: 'User added to the blacklist!',
                          description: `${apiUser.username}#${apiUser.discriminator} - \`${reason}\``,
                      }
                  });
              } else {
                  return message.channel.createMessage(`${apiUser.username} is already blacklisted!`)
              }
          }

          if (method.toLowerCase() === 'remove') {
              if (blacklistSettings.length) {
                  await this.bot.mysql.query('DELETE FROM `blacklist` WHERE ?', { id, type })
                  return message.channel.createMessage({
                      embed: {
                          color: parseInt(this.bot.colors.GREEN),
                          title: 'User removed from the blacklist!',
                          description: `${apiUser.username}#${apiUser.discriminator}`,
                      }
                  });
              } else {
                  return message.channel.createMessage(`${apiGuild.name} is not blacklisted!`)
              }
          }
      }

      if (type.toLowerCase() === 'guild') {
          const blacklistSettings = await this.bot.mysql.rowQuery('SELECT * FROM blacklist WHERE ?', { id, type })
          const apiGuild = await this.bot.getRESTGuild(id).catch(() => {})

          if (method.toLowerCase() === 'add') {
              if (!blacklistSettings.length) {
                  await this.bot.mysql.query('INSERT INTO blacklist SET ?', { id, type, reason, date: new Date() })
                  message.channel.createMessage({
                      embed: {
                          color: parseInt(this.bot.colors.GREEN),
                          title: 'Guild added to the blacklist!',
                          description: `${apiGuild ? apiGuild.name : 'Unknown name'} - \`${reason}\``,
                      }
                  });
                  try { this.bot.guilds.find(o => o.id === id).leave().catch(() => {}); } catch(err) {{}}
              } else {
                  return message.channel.createMessage(`${apiGuild.name} is already blacklisted!`)
              }
          }

          if (method.toLowerCase() === 'remove') {
              if (blacklistSettings.length) {
                  await this.bot.mysql.rowQuery('SELECT * FROM blacklist WHERE ?', { id, type })
                  return message.channel.createMessage({
                      embed: {
                          color: parseInt(this.bot.colors.GREEN),
                          title: 'Guild removed from the blacklist!',
                      }
                  });
              } else {
                  return message.channel.createMessage(`${apiGuild.name} is not blacklisted!`)
              }
          }
      }
    }
};
