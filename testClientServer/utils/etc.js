const XLSX = require('xlsx');

const LIMIT_TIME = 500

const validateWebSuccess = (resMs, httpStatusCode) => {
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
        } else if (val === "!") {
            path += pathParaList[pathIndex]
            pathIndex++
        } else {
            path += val
        }
    }
    return path
}

const xlsxBufferToJson = (buffer) => {

    const workbook = XLSX.read(buffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData
}

module.exports = {
    validateWebSuccess,
    getPath,
    xlsxBufferToJson
}