const router = require("express").Router()
const { verifyToken } = require("./app/helpers/own-token")
const DashboardController = require("./app/controllers/DashboardController")
const TokenController = require("./app/controllers/TokenController")
const UserController = require("./app/controllers/UserController")

router.post("/token", TokenController.token)
router.get("/list-all", verifyToken, DashboardController.getAll)
router.get("/list-clients", verifyToken, DashboardController.listAll)
router.post(
    "/get-by-station-id",
    verifyToken,
    DashboardController.getByStationId
)
router.post(
    "/get-by-station-name",
    verifyToken,
    DashboardController.getByStationName
)

router.get(
    "/set-station-generation-to-db",
    DashboardController.setStationsGenerationToDb.bind(DashboardController)
)

router.post("/login", verifyToken, UserController.login)

router.get("/users", verifyToken, UserController.index)
router.post("/users", verifyToken, UserController.create)
router.put("/users", verifyToken, UserController.read)
router.patch("/users", verifyToken, UserController.update)
router.delete("/users/:id", verifyToken, UserController.delete)
router.post(
    "/generate-new-payment-date",
    verifyToken,
    UserController.generateNewPaymentDate
)

module.exports = router
