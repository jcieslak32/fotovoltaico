const router = require("express").Router()
const { verifyToken } = require("./app/helpers/own-token")
const DashboardController = require("./app/controllers/DashboardController")
const TokenController = require("./app/controllers/TokenController")
const UserController = require("./app/controllers/UserController")

router.post("/token", TokenController.token)
router.post("/list-all", verifyToken, DashboardController.getAll)
router.post(
    "/get-by-station-id",
    verifyToken,
    DashboardController.getByStationId
)

router.get("/users", verifyToken, UserController.index)
router.post("/users", verifyToken, UserController.create)
router.put("/users", verifyToken, UserController.read)
router.patch("/users", verifyToken, UserController.update)
router.delete("/users", verifyToken, UserController.delete)

module.exports = router
