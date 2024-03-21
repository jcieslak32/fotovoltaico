const mongoose = require("mongoose")

async function main() {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.ja04jx0.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`
    )
}

main().catch((error) => console.log(error))

module.exports = mongoose
