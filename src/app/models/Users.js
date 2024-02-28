const mongoose = require("../config/db")
const { Schema } = mongoose

const User = mongoose.model(
    "User",
    new Schema(
        {
            name: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            stationId: {
                type: Number,
                required: true,
            },
            freePeriod: {
                type: Date,
                default: () => {
                    const currentDate = new Date()
                    currentDate.setDate(currentDate.getDate() + 30)
                    return currentDate
                },
            },
        },
        { timestamps: true }
    )
)

module.exports = User
