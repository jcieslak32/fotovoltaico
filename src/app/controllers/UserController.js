const { convertDateUser } = require("../helpers/convert-date")
const Users = require("../models/Users")
const bcrypt = require("bcrypt")

class UserController {
    async index(req, res) {
        try {
            const users = await Users.find().sort("-createdAt")

            return res.status(200).json(
                users.map((user) => {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        created_at: user.createdAt,
                        updated_at: user.updatedAt,
                        stations: user.stations,
                        freePeriod: !user.nextPayment
                            ? user.freePeriod >= new Date()
                                ? "Período de teste"
                                : "Periodo esgotado"
                            : false,
                        nextPayment: user.nextPayment
                            ? convertDateUser(user.nextPayment)
                            : null,
                        role: user.role,
                    }
                })
            )
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async create(req, res) {
        const user = req.body

        if (user.confirmPassword !== user.password) {
            return res.status(422).json({
                message: "A confirmação da senha precisa ser igual a senha!",
            })
        }

        try {
            if (await Users.findOne({ email: user.email })) {
                return res.status(422).json({
                    message: "Por favor, utilize outro e-mail",
                })
            }

            user.password = await bcrypt.hash(
                user.password,
                await bcrypt.genSalt(12)
            )

            await Users.create(user)

            return res
                .status(201)
                .json({ message: "Usuário criado com sucesso" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async read(req, res) {
        const id = req.body.id

        if (!id) {
            return res
                .status(422)
                .json({ message: "ID de usuário não encontrado" })
        }

        try {
            const user = await Users.findById(id)

            return res.status(200).json({
                name: user.name,
                email: user.email,
                password: user.password,
                stations: user.stations,
                freePeriod: user.freePeriod >= new Date(),
                nextPayment: user.nextPayment,
                role: user.role,
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async update(req, res) {
        const user = req.body

        try {
            const oldUser = await Users.findOne({ email: user.email })

            if (oldUser) {
                if (oldUser.email !== user.email) {
                    return res.status(422).json({
                        message: "Por favor, utilize outro e-mail",
                    })
                }
            }

            if (user.password) {
                user.password = await bcrypt.hash(
                    user.password,
                    await bcrypt.genSalt(12)
                )
            }

            await Users.findByIdAndUpdate(user.id, {
                name: user.name,
                email: user.email,
                password: !user.password ? oldUser.password : user.password,
                stations: user.stations,
                role: user.role,
            })

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!",
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async delete(req, res) {
        const id = req.params.id

        if (!id) {
            return res
                .status(422)
                .json({ message: "ID de usuário não encontrado" })
        }

        try {
            await Users.findByIdAndDelete(id)

            return res
                .status(200)
                .json({ message: "Usuário apagado com sucesso!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async generateNewPaymentDate(req, res) {
        const id = req.body.id

        const newDate = new Date()
        newDate.setDate(newDate.getDate() + 30)

        try {
            await Users.findByIdAndUpdate(id, {
                nextPayment: newDate,
            })

            return res
                .status(200)
                .json({ message: "Gerada nova data de cobrança!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async login(req, res) {
        const { email, password } = req.body

        try {
            const user = await Users.findOne({ email })

            if (
                (await bcrypt.compare(
                    password,
                    user !== undefined ? user.password : null
                )) === false
            ) {
                return res.status(422).json({
                    message: "Senha ou e-mail inválido(a)",
                })
            }

            return res.status(200).json(user)
        } catch (error) {
            return res.status(422).json({
                message: "Senha ou e-mail inválido(a)",
            })
        }
    }
}

module.exports = new UserController()
