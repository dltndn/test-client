require("dotenv").config()
const readline = require("readline");
const { reqGetMethod } = require('./controllers')



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ENDPOINT_URL = "http://localhost:8080/user"

function main() {
    console.log("Test client system")
    rl.on("line", async (line) => {
        // 한 줄씩 입력받은 후 실행할 코드
        // 입력된 값은 line에 저장된다.
        if (line === "y") {
            console.log("test")
        } else if (line === "allUsers") {
            reqGetMethod.reqGetTest(ENDPOINT_URL, line)
        }else if (line === "q") {
            rl.close(); 
        } else {
            console.log("잘못 입력함")
        }
    });
    rl.on('close', () => {
        // 입력이 끝난 후 실행할 코드
        console.log("종료")
        // db connection 종료 코드 추가
    })
}

main()