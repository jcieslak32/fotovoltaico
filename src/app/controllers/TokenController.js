const { createToken } = require("../helpers/own-token")

const url = process.env.BASE_URL

class TokenController {
    async token(req, res) {
        try {
            return res.status(200).json(createToken(req, res))
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}

module.exports = new TokenController()
