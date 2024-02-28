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

            response.push({
                clientes: solarman.data.stationList.map(async (station) => {
                    const metering = await processJSON(
                        await axios.post(
                            `${url}/metering?appId=302309264764900&language=en`,
                            {
                                stationId: station.id,
                                totalProductionType: 1,
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${solarmanToken}`,
                                },
                            }
                        )
                    )

                    console.log(metering)

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
                        acumulada: metering,
                    }
                }),
            })

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new DashboardController()
