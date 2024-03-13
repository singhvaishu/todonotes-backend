// const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017"
// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {
//         console.log("Connected to Mongo sucessfully");
//     })
// }
// module.exports = connectToMongo;


const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/sketchbook"; // Replace 'myDatabase' with your database name

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
