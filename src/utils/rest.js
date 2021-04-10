const fetch = require('node-fetch');

async function getUser(discordId) {
    const response = await fetch(`https://discord.com/api/v6/users/${discordId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`
        }
    });
    return response.json();
}

module.exports = { getUser }
