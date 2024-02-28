const mongoose = require("mongoose")

async function main() {
    await mongoose.connect(
        "mongodb+srv://admin:ZE6rR1jCYnGTpQCL@cluster0.awdibql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
}

main().catch((error) => console.log(error))

module.exports = mongoose
