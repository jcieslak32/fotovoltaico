const axios = require("axios")
const processJSON = require("../helpers/process-circular-json")
const { getSolarmanToken } = require("../helpers/get-tokens")
const { convertDate } = require("../helpers/convert-date")
const Stations = require("../models/Stations")
const Users = require("../models/Users")

const url = process.env.BASE_URL

class DashboardController {
    async listAll(req, res) {
        const solarmanToken = await getSolarmanToken()

        const solarman = await processJSON(
            await axios.post(
                `${url}/list?language=en`,
                {
                    page: 1,
                    size: 200,
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

        return res.status(200).json(clientes)
    }

    async getAll(req, res) {
        try {
            const solarmanToken = await getSolarmanToken()
            let response = []
            let generatedEnergy = 0
            let dailyGeneratedEnergy = 0
            let monthGeneratedEnergy = 0
            let data
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 200,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${solarmanToken}`,
                        },
                    }
                )
            )

            data = solarman.data.stationList

            if (req.params.id) {
                const user = await Users.findById(req.params.id)

                if (user.role === "client") {
                    data = data.filter((station) => {
                        return user.stations.includes(station.id.toString())
                    })
                }
            }

            const clientesPromises = data.map(async (station) => {
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
            })

            const clientes = await Promise.all(clientesPromises)

            for (const cliente of clientes) {
                const generated = await Stations.find({
                    stationId: cliente.id,
                }).then((response) => {
                    let calculatedEnergy = 0

                    response.forEach((station) => {
                        calculatedEnergy += station.generated
                    })

                    return calculatedEnergy
                })

                generatedEnergy += generated

                const dailyGenerated = await Stations.find({
                    stationId: cliente.id,
                    createdAt: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                }).then((response) => {
                    let calculatedEnergy = 0

                    response.forEach((station) => {
                        calculatedEnergy += station.generated
                    })

                    return calculatedEnergy
                })

                dailyGeneratedEnergy += dailyGenerated
            }

            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )

            const endOfMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            )

            for (const cliente of clientes) {
                const generated = await Stations.find({
                    stationId: cliente.id,
                }).then((response) => {
                    let calculatedEnergy = 0

                    response.forEach((station) => {
                        calculatedEnergy += station.generated
                    })

                    return calculatedEnergy
                })

                generatedEnergy += generated

                const monthGenerated = await Stations.find({
                    stationId: cliente.id,
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                }).then((response) => {
                    let calculatedEnergy = 0

                    response.forEach((station) => {
                        calculatedEnergy += station.generated
                    })

                    return calculatedEnergy
                })

                monthGeneratedEnergy += monthGenerated
            }

            const chart = {
                normal: clientes.filter(
                    (station) => station.status === "NORMAL"
                ).length,
                offline: clientes.filter(
                    (station) => station.status === "ALL_OFFLINE"
                ).length,
                parcialmenteOffline: clientes.filter(
                    (station) => station.status === "OFFLINE"
                ).length,
                alarme: clientes.filter((station) => station.status === "ALARM")
                    .length,
                semInversor: clientes.filter(
                    (station) => station.status === "NO_DEVICE"
                ).length,
            }

            response.push({
                clientes,
                geracao_total: generatedEnergy,
                geracao_diaria_total: dailyGeneratedEnergy,
                geracao_energia_mes: monthGeneratedEnergy,
                chart,
            })

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getByStationName(req, res) {
        const solarmanToken = await getSolarmanToken()
        let response = []

        try {
            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 200,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${solarmanToken}`,
                        },
                    }
                )
            )

            response = solarman.data.stationList.filter((station) =>
                station.name
                    .toLowerCase()
                    .toString()
                    .includes(req.body.search.toLowerCase().toString())
            )

            return res.status(200).json(
                response.map((station) => {
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
                })
            )
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getByStationId(req, res) {
        const solarmanToken = await getSolarmanToken()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        try {
            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 200,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${solarmanToken}`,
                        },
                    }
                )
            )

            const response = solarman.data.stationList.filter(
                (station) => Number(station.id) === Number(req.body.stationId)
            )[0]

            const generatedEnergy = await Stations.find({
                stationId: req.body.stationId,
            }).then((response) => {
                let calculatedEnergy = 0

                response.map((station) => {
                    calculatedEnergy = calculatedEnergy + station.generated
                })

                return calculatedEnergy
            })

            const dailyGeneratedEnergy = await Stations.find({
                stationId: req.body.stationId,
                createdAt: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            }).then((response) => {
                let calculatedEnergy = 0

                response.map((station) => {
                    calculatedEnergy += station.generated
                })

                return calculatedEnergy
            })

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
                geracao_energia_total: generatedEnergy,
                geracao_energia_diaria: dailyGeneratedEnergy,
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async setStationsGenerationToDb(req, res) {
        try {
            const solarmanToken = await getSolarmanToken()

            const solarman = await processJSON(
                await axios.post(
                    `${url}/list?language=en`,
                    {
                        page: 1,
                        size: 200,
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

            clientes.map(async (station) => {
                if (station.status !== "ALL_OFFLINE") {
                    await Stations.create({
                        stationId: station.id,
                        generated: station.geracao_energia
                            ? station.geracao_energia
                            : 0,
                    })
                }
            })

            return res
                .status(200)
                .json({ message: "Dados atualizados com sucesso!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new DashboardController()
