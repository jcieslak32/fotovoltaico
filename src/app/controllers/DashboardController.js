const axios = require("axios")
const processJSON = require("../helpers/process-circular-json")
const { getSolarmanToken } = require("../helpers/get-tokens")
const convertDate = require("../helpers/convert-date")

const url = process.env.BASE_URL

class DashboardController {
    async getAll(req, res) {
        try {
            const solarmanToken = await getSolarmanToken()
            let response = []

            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 20,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${solarmanToken}`,
                        },
                    }
                )
            )

            const clientesPromises = solarman.data.stationList.map(
                async (station) => {
                    return {
                        id: station.id,
                        nome: station.name,
                        latitude: station.locationLat,
                        longitude: station.locationLng,
                        endereco: station.locationAddress,
                        tipo:
                            station.type === "HOUSE_ROOF"
                                ? "Telhado da Casa"
                                : "Térreo",
                        capacidade_instalada: station.installedCapacity,
                        data_iniciada: convertDate(station.startOperatingTime),
                        data_criacao: convertDate(station.createdDate),
                        ultima_atualizacao: convertDate(station.lastUpdateTime),
                        status: station.networkStatus,
                        geracao_energia: station.generationPower,
                    }
                }
            )

            const clientes = await Promise.all(clientesPromises)

            response.push({ clientes })

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getByStationId(req, res) {
        const solarmanToken = await getSolarmanToken()
        let response = []

        try {
            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 20,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${solarmanToken}`,
                        },
                    }
                )
            )

            response = solarman.data.stationList.filter(
                (station) => Number(station.id) === Number(req.body.stationId)
            )[0]

            return res.status(200).json({
                id: response.id,
                nome: response.name,
                latitude: response.locationLat,
                longitude: response.locationLng,
                endereco: response.locationAddress,
                tipo:
                    response.type === "HOUSE_ROOF"
                        ? "Telhado da Casa"
                        : "Térreo",
                capacidade_instalada: response.installedCapacity,
                data_iniciada: convertDate(response.startOperatingTime),
                data_criacao: convertDate(response.createdDate),
                ultima_atualizacao: convertDate(response.lastUpdateTime),
                status: response.networkStatus,
                geracao_energia: response.generationPower,
            })
        } catch (error) {}
    }
}

module.exports = new DashboardController()
