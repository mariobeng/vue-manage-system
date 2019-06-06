//import
const Mock = require('mockjs');
// Mock.Random 是一个工具类，用于生成各种随机数据
const Random = Mock.Random

//mock一组数据
const getusers = function() {
    let userArr = []
    for (let i = 0; i < 50; i++) {
        let newArr = {
            account: Random.natural(100000, 999999),
            name: Random.cname(),
            mymoney: Random.float(1, 99999),
            Kinfo: Random.float(1, 10),
            dmoney: Random.float(1, 99999),
        }
        userArr.push(newArr)
    }
    return {
        userArr: userArr
    }
}


Mock.mock('/user/api', 'get', getusers);