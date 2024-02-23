const router = require("express").Router()
const DashboardController = require("./app/controllers/DashboardController")

router.post("/list-all", DashboardController.getAll)

module.exports = router
