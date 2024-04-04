const mongoose = require("../config/db")
const { Schema } = mongoose

const Alerts = mongoose.model(
    "Alerts",
    new Schema({
        stationId: {
            type: Number,
        },
        message: {
            type: String,
        },
        date: {
            type: Date,
        },
        stationName: {
            type: String,
        },
    })
)

module.exports = Alerts
