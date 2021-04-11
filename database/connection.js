const mongoose = require('mongoose');

module.exports = () => {
    const dbURI = "mongodb+srv://user:root@cluster0.kbdbm.mongodb.net/dndesigner?retryWrites=true&w=majority";
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(result => console.log("connected to MongoDB Atlas"))
        .catch(err => console.log(err));
}