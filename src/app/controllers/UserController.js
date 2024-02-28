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
                        freePeriod: (user.freePeriod >= new Date() ? 'Período de teste' : 'Periodo esgotado')
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
                stationId: user.stationId,
                freePeriod,
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async update(req, res) {
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

            await Users.findByIdAndUpdate(user.id, {
                name: user.name,
                email: user.email,
                password: user.password,
                stationId: user.stationId,
            })

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!",
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    async delete(req, res) {
        const id = req.body.id

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
}

module.exports = new UserController()
