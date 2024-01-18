const httpStatus = require('http-status')
const TestApiDb = require('mysql2')

const env = process.env
const conn = TestApiDb.createConnection({
    host: env.host,
    port: env.dbport,
    user: env.user,
    password: env.password,
    database: env.database
})


const insertServerInfo = ({ name, protocol, host }) => {
    const id = 0
    const qry = `INSERT INTO TestServerInfo (test_server_id, test_server_name, protocol, host) VALUES ('${id}', '${name}', '${protocol}', '${host}' );`
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
const createServerInfo = async (req, res) => {
    try {
        const serverInfo = {
            name: 'eqbrdf',
            protocol: 'https',
            host: 'https://ag.eqhub.eqbr.com/api/v2'
        }
        console.log(serverInfo)
        // mysql 저장
        try {
            const data = await insertServerInfo(serverInfo)
            console.log("data: ", data)
        } catch (e) {
            console.log("err2", e)
        }
        
        
        res.status(httpStatus.OK).send({ data: serverInfo })
    } catch (e) {
        SERVER_ERROR(res)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(null)
    }
}

function connect() {
    conn.connect((err) => {
        if (err) console.error("Mysql connection error: ", err)
        else console.log("Hello Mysql.")
    })
}

function destroy() {
    conn.destroy()
    console.log("Bye Mysql.")
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User', function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    connect,
    destroy,
    getAllUsers,
    createServerInfo
}

