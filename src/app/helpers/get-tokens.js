const axios = require("axios")

const getSolarmanToken = async () => {
    try {
        const url =
            "https://globalapi.solarmanpv.com/account/v1.0/token?appId=302309264764900&language=en&orgId=28188"

        const response = await axios.post(url, {
            appSecret: "fe13fd9185983d273242cb3c44a78da0",
            email: "solarmedianeira@hotmail.com",
            password:
                "1e95f7e739c5baf893dffa1947be3eeac14fa5f77fb58e5fea73c85bdf6d81e6",
            orgId: "28188",
        })

        return response.data.access_token
    } catch (error) {
        return { error: "Erro ao obter token" }
    }
}

module.exports = {
    getSolarmanToken,
}
