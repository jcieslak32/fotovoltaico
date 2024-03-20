const mongoose = require("../config/db")
const { Schema } = mongoose

const Station = mongoose.model(
    "Station",
    new Schema(
        {
            stationId: {
                type: Number,
                required: true,
            },
            generated: {
                type: Number,
                required: true,
            },
        },
        { timestamps: true }
    )
)

module.exports = Station
