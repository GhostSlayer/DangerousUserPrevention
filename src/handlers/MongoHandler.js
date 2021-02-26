const mongoose = require('mongoose');

module.exports = () => {
    const dbOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    if (!process.env.MONGODB_URL) {
        throw new Error('Database failed to load: mongodb_url environment variable is required')
    }
    mongoose.connect(process.env.MONGODB_URL, dbOptions)
        .catch(e => {
            console.error('DB: ', e.message)
        })


    mongoose.connection.on('connected', () => {
        console.log('Database connection established')
    });

    mongoose.connection.on('err', err => {
        console.log(`Mongoose connection error: ${err.stack}`)
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection lost')
    });
}
