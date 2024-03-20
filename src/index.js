const axios = require("axios")
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const router = require("./routes")
const schedule = require("node-schedule")

const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: "https://front-na66.onrender.com/" }))
app.use(express.static("public"))
app.use("/api/v1", router)

schedule.scheduleJob("*/59 * * * *", async () => {
    try {
        await axios.get(
            "https://api-skzm.onrender.com/api/v1/set-station-generation-to-db"
        )
    } catch (error) {
        console.error("Error while calling the endpoint:", error.message)
    }
})

app.listen(3000)
