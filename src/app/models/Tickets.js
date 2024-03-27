const mongoose = require("../config/db")
const { Schema } = mongoose

const Tickets = mongoose.model(
    "Tickets",
    new Schema(
        {
            user: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                enum: ["Manutenção", "Orçamento", "Inversor", "Outros"],
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            status: {
                type: Boolean,
                default: false,
            },
            answer: {
                type: String,
            },
        },
        { timestamps: true }
    )
)

module.exports = Tickets
