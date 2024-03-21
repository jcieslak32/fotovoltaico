const axios = require("axios")
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const router = require("./routes")
const schedule = require("node-schedule")

const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.FRONT_BASE_URL }))
app.use(express.static("public"))
app.use("/api/v1", router)

schedule.scheduleJob("*/59 * * * *", async () => {
    try {
        await axios.get(
            `${process.env.API_BASE_URL}/set-station-generation-to-db`
        )
    } catch (error) {
        console.error("Error while calling the endpoint:", error.message)
    }
})

app.listen(process.env.API_BASE_PORT)
