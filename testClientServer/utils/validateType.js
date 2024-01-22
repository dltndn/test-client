
// check isNumber
const checkNum = (val) => {
    const data = Number(val)
    if (data.toString() === "NaN") {
        return undefined
    }
    return data
}

// check isJSON
const checkJson = (val) => {
    const data = val
    if (data.length !== undefined) {
        return undefined
    }
    return data
}

module.exports = {
    checkNum,
    checkJson
}