const router = require("express").Router()
const { verifyToken } = require("./app/helpers/own-token")
const DashboardController = require("./app/controllers/DashboardController")
const TokenController = require("./app/controllers/TokenController")

router.post("/token", TokenController.token)
router.post("/list-all", verifyToken, DashboardController.getAll)

module.exports = router
