const Alerts = require("../models/Alerts")

class AlertController {
    async getAll(req, res) {
        let alerts

        try {
            if (req.params.id) {
                alerts = await Alerts.find({ stationId: req.params.id })
            } else {
                alerts = await Alerts.find({})
            }

            return res.status(200).json(alerts)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new AlertController()
