const mongoose = require('mongoose');

exports.connectDB = () => {
    mongoose
    .connect(process.env.MONGO_URL).then(con => console.log(`Database connnected: ${con.connection.host}`))
    .catch((err) => console.log(err))
};