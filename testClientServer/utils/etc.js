const LIMIT_TIME = 500

const validateSuccess = (resMs, httpStatusCode) => {
    if (resMs > LIMIT_TIME) {
        return false
    }
    if (!(httpStatusCode >= 200 && httpStatusCode < 300)) {
        return false
    }
    if (httpStatusCode === 204) {
        return false
    }
    return true
}


const getPath = (pathStr, qryStrList, pathStrList) => {
    const qryParaList = JSON.parse(qryStrList)
    const pathParaList = JSON.parse(pathStrList)
    let path = ""
    let qryIndex = 0
    let pathIndex = 0
    for (const val of pathStr) {
        if (val === "?") {
            path += qryParaList[qryIndex]
            qryIndex++
        } else if (pathStr[i] === "!") {
            path += pathParaList[pathIndex]
            pathIndex++
        } else {
            path += val
        }
    }
    return path
}

module.exports = {
    validateSuccess,
    getPath
}