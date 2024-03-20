const convertDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return `${stringify(date.getDate())}/${stringify(
        date.getMonth() + 1
    )}/${date.getFullYear()} ${stringify(date.getHours())}:${stringify(
        date.getMinutes()
    )}:${stringify(date.getSeconds())}`
}

const convertDateUser = (timestamp) => {
    const dataUTC = new Date(timestamp)
    const dataBrasileira = new Date(dataUTC.getTime() - 3 * 60 * 60 * 1000)

    const dia = String(dataBrasileira.getDate()).padStart(2, "0")
    const mes = String(dataBrasileira.getMonth() + 1).padStart(2, "0")
    const ano = dataBrasileira.getFullYear()
    const hora = String(dataBrasileira.getHours()).padStart(2, "0")
    const minuto = String(dataBrasileira.getMinutes()).padStart(2, "0")
    const segundo = String(dataBrasileira.getSeconds()).padStart(2, "0")

    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`
}

const stringify = (date) => {
    return String(date).padStart(2, "0")
}

module.exports = { convertDate, convertDateUser }
