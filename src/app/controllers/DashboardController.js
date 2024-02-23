const axios = require("axios")
const CircularJSON = require("circular-json")
const getToken = require("../helpers/get-token")

const url = process.env.BASE_URL

class DashboardController {
    async getAll(req, res) {
        try {
            const token = await getToken()
            const data = {
                page: 1,
                size: 20,
            }
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }

            const response = await axios.post(
                `${url}/list?language=en`,
                data,
                headers
            )

            return res
                .status(200)
                .json(JSON.parse(CircularJSON.stringify(response)))
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}

module.exports = new DashboardController()
