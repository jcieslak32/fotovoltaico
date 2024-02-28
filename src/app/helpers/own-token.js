const jwt = require("jsonwebtoken")

const createToken = (req, res) => {
    const token = jwt.sign(
        {
            api_key: req.body.api_key,
        },
        process.env.SECRET_API
    )

    res.status(200).json({
        message: "Você está autenticado!",
        token: token,
    })
}

const getToken = (req) => req.headers.authorization.split(" ")[1]

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso Negado!" })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({ message: "Acesso Negado!" })
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_API)
        req.verified = verified

        next()
    } catch (error) {
        return res.status(400).json({ message: "Token inválido!" })
    }
}

module.exports = { createToken, getToken, verifyToken }
