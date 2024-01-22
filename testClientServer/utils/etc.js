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


const getPath = (pathStr, query, parameter) => {
    const pathIndex = pathStr.indexOf("!")
    const queryIndex = pathStr.indexOf("?")
    if (pathIndex !== -1) {
        // path parameter
        const preStr = pathStr.slice(0, pathIndex)
        const inStr = parameter
        const postStr = pathStr.slice(pathIndex+1)
        return preStr + inStr + postStr
    }
    if (queryIndex !== -1) {
        // query parameter
        const preStr = pathStr.slice(0, queryIndex)
        const inStr = `?${query}=${parameter}`
        const postStr = pathStr.slice(queryIndex+1)
        return preStr + inStr + postStr
    }
    return pathStr
}

module.exports = {
    validateSuccess,
    getPath
}