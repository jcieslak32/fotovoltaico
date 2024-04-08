const Tickets = require("../models/Tickets")
const Users = require("../models/Users")

class TicketController {
    async index(req, res) {
        try {
            let tickets = await Tickets.find().sort("status").sort("-createdAt")

            tickets.map(async (ticket) => {
                return await Users.findById({ _id: ticket.userId }).name
            })

            return res.status(200).json(tickets)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getAllFromUser(req, res) {
        const id = req.params.id

        try {
            const tickets = await Tickets.find({
                $or: [{ "user.id": id }, { admin: { $exists: true } }],
            }).sort("-createdAt")

            return res.status(200).json(tickets)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async read(req, res) {
        const id = req.params.id

        try {
            const ticket = await Tickets.findById({ _id: id })

            return res.status(200).json(ticket)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async create(req, res) {
        const id = req.params.id
        const ticket = req.body
        let user

        try {
            if (ticket.admin) {
                user = await Users.findById({ _id: ticket.admin })
            } else {
                user = await Users.findById({ _id: id })
            }

            await Tickets.create({
                ...ticket,
                user: {
                    id,
                    name: user.name,
                    email: user.email,
                },
            })

            return res
                .status(201)
                .json({ message: "Ticket criado com sucesso!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async update(req, res) {
        const id = req.params.id
        const ticket = req.body

        try {
            await Tickets.findOneAndUpdate({ _id: id }, ticket)

            return res
                .status(200)
                .json({ message: "Ticket atualizado com sucesso!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async delete(req, res) {
        const id = req.params.id

        try {
            await Tickets.findOneAndDelete({ _id: id })

            return res
                .status(200)
                .json({ message: "Ticket apagado com sucesso!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async answer(req, res) {
        const id = req.params.id
        const { answer } = req.body

        try {
            await Tickets.findOneAndUpdate(
                { _id: id },
                { status: true, answer }
            )

            return res.status(200).json({ message: "Ticket respondido" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new TicketController()
