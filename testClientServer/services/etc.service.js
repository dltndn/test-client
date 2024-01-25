const axios = require("axios")

// slack error data 알림 봇
const sendSlack = async (text) => {
    const slackInstance = axios.create({
        baseURL: `https://slack.com/api`,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    });
    const data = {
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.SLACK_CHANNEL,
        text
    }
    try {
        const res = await slackInstance.post("/chat.postMessage", data)
        return res.data.ok
    } catch (e) {
        console.log("slack error:", e)
        return false
    }
}

module.exports = {
    sendSlack
}