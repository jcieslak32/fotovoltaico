const convertDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return `${stringify(date.getDate())}/${stringify(
        date.getMonth() + 1
    )}/${date.getFullYear()} ${stringify(date.getHours())}:${stringify(
        date.getMinutes()
    )}:${stringify(date.getSeconds())}`
}

const stringify = (date) => {
    return String(date).padStart(2, "0")
}

module.exports = convertDate
