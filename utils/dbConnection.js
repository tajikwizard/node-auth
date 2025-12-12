const mongoose = require("mongoose");



const dbConnection = async (url)=>{
    try {
        await mongoose.connect(url);
        console.log("Connected");
    } catch (error) {
        console.log("Error Connecting", error);
    }
}

module.exports = dbConnection;