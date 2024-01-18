const axios = require("axios")

const reqToTarget = async (testData) => {
    const instance = axios.create({
        baseURL: testData.host,
        headers: testData.header
    });

    const path = getPath(testData.path, testData.query, testData.parameter)
    let result;
    try {
        switch (testData.http_method) {
            case "get":
                result = await instance.get(path)
                return result
            case "post":
                result = await instance.post(path, testData.body)
                return result
            case "put":
                result = await instance.put(path, testData.body)
                return result
            case "patch":
                result = await instance.patch(path, testData.body)
                return result
            case "options":
                result = await instance.options(path)
                return result
            case "delete":
                result = await instance.delete(path)
                return result
            default:
                return null
        }
    } catch (e) {
        return e
    }
}

module.exports = {
    reqToTarget
}

const getPath = (pathStr, query, parameter) => {
    const pathIndex = pathStr.indexOf("!")
    const queryIndex = pathStr.indexOf("?")
    if (pathIndex !== -1) {
        // path parameter
        const preStr = pathStr.slice(0, pathIndex-1)
        const inStr = parameter
        const postStr = pathStr.slice(pathIndex+1)
        return preStr + inStr + postStr
    }
    if (queryIndex !== -1) {
        // query parameter
        const preStr = queryIndex.slice(0, queryIndex-1)
        const inStr = `?${query}=${parameter}`
        const postStr = queryIndex.slice(queryIndex+1)
        return preStr + inStr + postStr
    }
    return pathStr
}