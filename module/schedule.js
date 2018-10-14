const schedule = require('node-schedule');
const db = require('./db');
const neoConfig = require('../config/neoConfig').neoConfig;
const async = require('async');
const request = require('request');
const fs = require('fs');

const scheduler = schedule.scheduleJob('*/3 * * * * *', async ()=>{

    //key: user_idx, value: ipList
    let ipList = {};
    //temp
    ipList[0] = [];

    //key: user_idx, value: domainList
    let domainList = {};
    //temp
    domainList[0] = [];

    //key: user_idx, value: networkList
    let networkList = {};
    //temp
    networkList[0] = [];

    //dictionary
    let ip2Dict = {};
    ip2Dict[0] = {};

    //태스크 리스트 !
    let taskArray = [
        //태스크 1 - 사용자별 ip List 뽑기
        function(callback) {
            console.log(1, "Task");
            let options = {
                uri: "http://52.79.250.244:7474/db/data/transaction/commit",
                headers : {
                    "Authorization" : neoConfig.auth,
                    "Content-Type":"application/json"
                },
                method: "POST",
                json: {
                    statements: [{
                        "statement":"MATCH(n:node) RETURN DISTINCT n.ip AS ip"
                    }]
                }
            };

            request(options, (err, res, body) => {
                if(err) throw err;
                else {
                    //ip List 만들기
                    let temp = body.results[0].data;
                    temp.forEach((data) => {
                        ipList[0].push(data.row[0]);
                    });

                    //ip to dict 딕셔너리 만들기
                    let dictTemp = {};
                    for (let i = 0; i < ipList[0].length; i++) {
                        dictTemp[ipList[0][i]] = i;
                    }

                    ip2Dict[0] = dictTemp;
                }

                callback();
            });
        },

        //태스크 2 - 사용자별 domain List 뽑기
        function(callback) {
            console.log(2, "Task");
            let options = {
                uri: "http://52.79.250.244:7474/db/data/transaction/commit",
                headers : {
                    "Authorization" : neoConfig.auth,
                    "Content-Type":"application/json"
                },
                method: "POST",
                json: {
                    statements: [{
                        "statement":`MATCH(n) - [rel:SEND] - () WHERE n.dns <> "s3-r-w.ap-northeast-2.amazonaws.com" AND n.dns <> "Unknown Host" RETURN DISTINCT n.dns, SUM(rel.count)`
                    }]
                }
            };

            request(options, (err, res, body) => {
                if(err) throw err;
                else {
                    //워드클라우드를 위한 도메인을 csv 파일 형태로 저장하기!
                    let domain2csv = "text, frequency\n";
                    let temp = body.results[0].data;
                    temp.forEach((data) => {
                        domainList[0].push(data.row);
                    });

                    callback();
                }
            });
        },

        //태스크 3 - 사용자별 network Diagram 뽑기
        function(callback) {
            console.log(3, "Task");
            let options = {
                uri: "http://52.79.250.244:7474/db/data/transaction/commit",
                headers : {
                    "Authorization" : neoConfig.auth,
                    "Content-Type":"application/json"
                },
                method: "POST",
                json: {
                    statements: [{
                        "statement":`MATCH(source:node)-[rel]->(dest:node) RETURN distinct source.ip,dest.ip, count(source.ip) order by source.ip`
                    }]
                }
            };

            request(options, (err, res, body) => {
                if(err) throw err;
                else {

                    //네트워크 리스트 만들기
                    let temp = body.results[0].data;
                    temp.forEach((data) => {
                        networkList[0].push(data.row);
                    });
                    callback();
                }
            });
        },

        //태스크 n - sample
        function(callback) {
            console.log('n',"'Task'");
            callback();
        }
    ];

    //태스크 리스트 실행, 실행 후 결과 콜백
    async.parallel(taskArray, () => {
        console.log("parallel");

        //domin을 csv 포맷으로 변환하기 !
        let domain2csv = "text, frequency\n";
        domainList[0].forEach((data) => {
            domain2csv = domain2csv + data[0] + ',' + data[1] + '\n';
        });

        //변환된 csv 파일 저장하기 !
        fs.writeFile('../public/data/idx0/domain.csv', domain2csv, 'utf-8', function(err) {
            if(err) console.log(err);
            else{
                console.log('DNS WRITE DONE !');
            }
        });

        //network 리스트를 netowrk 그래프 그릴 수 있는 적절한 포맷으로 변환
        let network2csv = {};

        //네트워크의 각 노드 정의
        let nodes = [];
        ipList[0].forEach((data) => {
            nodes.push({"name":data})
        });

        network2csv["nodes"] = nodes;

        //네트워크의 엣지 정의
        console.log(networkList);
        console.log(1);
    });
});

scheduler;

module.exports = scheduler;
