const mysql = require('mysql2')

const env = process.env
const conn = mysql.createConnection({
    host: env.host,
    port: env.dbport,
    user: env.user,
    password: env.password,
    database: env.database
})

// server 정보 저장
const insertServerInfo = ({ name, protocol, host }) => {
    return new Promise(async (resolve, reject) => {
        let newId = -1
        try {
            const maxId = await getMaxPk("test_server_id", "TestServerInfo")
            newId = maxId + 1
            const qry = `INSERT INTO TestServerInfo (test_server_id, test_server_name, protocol, host) VALUES ('${newId}', '${name}', '${protocol}', '${host}' );`
            if (newId === -1) {
                reject("error");
            }
            conn.query(qry, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e)
        }
    });
}

// server 정보 가져오기
const selectServerInfo = (serverInfoId) => {    
    const qry = `SELECT * FROM TestServerInfo WHERE test_server_id = ${serverInfoId};`
    return new Promise((resolve, reject) => {
        conn.query(qry, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * @description - test data 저장
 * @param {testData} - 
 * {
		name: 'test data name'
        method: 'get',
        header: 'JSON',
        qry_parameter: 'id' | null,
        path_parameter: 3 | null,
        path: '/request/transaction/!/receipt',
        body: 'JSON',
        testCaseId: 3
    }
 */
const insertTestData = async (serverInfoId, testData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newId = -1
            const maxId = await getMaxPk("id", "WebTestData")
            newId = maxId + 1
            const qry = `INSERT INTO WebTestData (id, test_server_id, test_case_id, http_method, header, qry_parameter, path_parameter, path, body, name) 
            VALUES (${newId}, ${serverInfoId}, ${testData.testCaseId}, '${testData.method}', '${JSON.stringify(testData.header)}', '${testData.qry_parameter}', ${testData.path_parameter}, '${testData.path}', '${JSON.stringify(testData.body)}', '${testData.name}');`
            conn.query(qry, (error, results, fields) => {
                if (newId === -1) {
                    reject("error")
                }
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e)
        }
    });
}

/**
 * @description - test case 저장
 * @param {testCase} - 
 * {
		name: 'test case name',
        interval: 3000,
        test_start_date,
        test_end_date
    }
 */
const insertTestCase = async (testCase) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newId = -1
            const maxId = await getMaxPk("id", "TestCase")
            newId = maxId + 1
            const creationDate = Math.floor(Date.now() / 1000);
            const qry = `INSERT INTO TestCase (id, name, interval_, creation_date, test_start_date, test_end_date) VALUES (${newId}, '${testCase.name}', ${testCase.interval}, ${creationDate}, ${testCase.test_start_date}, ${testCase.test_end_date});`
            conn.query(qry, (error, results, fields) => {
                if (newId === -1) {
                    reject("error")
                }
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e)
        }
    });
}

const getTestDataCollection = (testDataId) => {
    return new Promise(async (resolve, reject) => {
        const qry = testDataCollectionQry(testDataId)
        try {
            conn.query(qry, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getTestDataIdsByTestCaseId = (testCaseId) => {
    const qry = `SELECT id FROM WebTestData WHERE test_case_id = ${testCaseId};`
    return new Promise(async (resolve, reject) => {
        try {
            conn.query(qry, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 
 * @param {*} testResult - 
 * {
        resMs,
        httpStatusCode,
        isSuccess,
        dataResult
    }
 */
const insertWebTestResult = async (testResult, testCaseId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newId = -1
            const maxId = await getMaxPk("id", "WebTestResult")
            newId = maxId + 1
            const qry = `INSERT INTO WebTestResult (id, test_case_id, res_ms, http_status_code, is_success, res_data) VALUES (${newId}, ${testCaseId}, ${testResult.resMs}, ${testResult.httpStatusCode}, ${testResult.isSuccess ? 1:0}, ${JSON.stringify(testResult.dataResult)});`
            conn.query(qry, (error, results, fields) => {
                if (newId === -1) {
                    reject("error")
                } 
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 
 * @param {*} testCaseResult -
 * {
        testSuccessRatio,
        testErrorRatio
    }
 */
const insertTestCaseResult = async (testCaseResult, testCaseId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newId = -1
            const maxId = await getMaxPk("id", "TestCaseResult")
            newId = maxId + 1
            const qry = `INSERT INTO TestCaseResult (id, test_case_id, test_success_ratio, test_error_ratio) VALUES (${newId}, ${testCaseId}, ${testCaseResult.testSuccessRatio}, ${testCaseResult.testErrorRatio});`
            conn.query(qry, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

// chain 정보 저장
const insertChainInfo = ({ label, network_id }) => {
    return new Promise(async (resolve, reject) => {
        let newId = -1
        try {
            const maxId = await getMaxPk("id", "TestChainInfo")
            newId = maxId + 1
            const qry = `INSERT INTO TestChainInfo (id, label, network_id) VALUES ('${newId}', '${label}', ${network_id});`
            if (newId === -1) {
                reject("error");
            }
            conn.query(qry, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e)
        }
    });
}

// TestTime table 저장

// TestTime table 컬럼 읽기

// TestTime table 컬럼 삭제

function connectDb() {
    conn.connect((err) => {
        if (err) console.error("Db connection error: ", err)
        else console.log("Db connected.")
    })
}

function destroyDb() {
    conn.destroy()
    console.log("Bye Mysql")
}

module.exports = {
    connectDb,
    destroyDb,
    insertServerInfo,
    selectServerInfo,
    insertTestData,
    insertTestCase,
    getTestDataCollection,
    getTestDataIdsByTestCaseId,
    insertWebTestResult,
    insertTestCaseResult,
    insertChainInfo
}

/**
 * 
 * @param {*} pkName
 * @param {*} tableName 
 * @returns 
 */
const getMaxPk = (pkName, tableName) => {
    const qry = `SELECT MAX(${pkName}) FROM ${tableName};`
    return new Promise((resolve, reject) => {
        conn.query(qry, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                const maxId = results[0][`MAX(${pkName})`]
                if (maxId !== null) {
                    resolve(maxId);
                } else {
                    resolve(0);
                }
            }
        });
    });
}

const testDataCollectionQry = (testDataId) => {
    return `
    SELECT 
    WebTestData.*, 
    TestServerInfo.*
    FROM WebTestData
    INNER JOIN TestServerInfo ON WebTestData.test_server_id = TestServerInfo.test_server_id
    WHERE WebTestData.id = ${testDataId};
    `
}