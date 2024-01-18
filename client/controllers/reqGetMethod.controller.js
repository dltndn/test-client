// get method test
const axios = require("axios")

async function reqGetTest(endPointUrl, routeName) {
    console.log(endPointUrl)
    try {
        const resData = await axios.get(`${endPointUrl}/${routeName}`)
        console.log("getData: ", resData.data)
    } catch (e) {
        console.log("reqGetTest error: ", e)
    }
}

module.exports  = {
    reqGetTest
}

