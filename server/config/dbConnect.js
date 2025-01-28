const { mongoose } = require('mongoose');

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then((conn) => {
            if (conn.connection.readyState === 1) {
                console.log('DB connected successfully');
            } else {
                console.log('DB connection failed');
            }
        })
        .catch((error) => {
            console.log('DB connection error:', error);
            throw new Error(error);
        });
};

module.exports = dbConnect;
