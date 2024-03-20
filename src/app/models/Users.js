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
            },
            freePeriod: {
                type: Date,
                default: () => {
                    const currentDate = new Date()
                    currentDate.setDate(currentDate.getDate() + 30)
                    return currentDate
                },
            },
            nextPayment: {
                type: Date,
            },
            role: {
                type: String,
                enum: ["admin", "client"],
                required: true,
            },
        },
        { timestamps: true }
    )
)

module.exports = User
