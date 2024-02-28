const CircularJSON = require("circular-json")

const processJSON = async (json) => {
    try {
        return JSON.parse(CircularJSON.stringify(json))
    } catch (error) {
        return error
    }
}

module.exports = processJSON
