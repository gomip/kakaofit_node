// 2021.02.08 | gomip | created

// Initialization
const mongoose = require('mongoose');

// Connection
const connect = () => {
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err) => {
        if (err) {
            console.log('Mongo DB Connection Failed', err);
        } else {
            console.log()
            console.log('Mongo DB Connected');
        }
    });
};

// Error handling
mongoose.connection.on('error', (error) => {
    console.error('MongoDb Error', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('Try to reconnect MongoDb due to disconnection');
    connect();
});

module.exports = connect;