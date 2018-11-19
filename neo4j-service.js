const neo4j = require('./neo4j');

// Neo4j 데이터베이스의 관계 중심 탐색 기능 사용을 위한 서비스

// Box Plot init
exports.getMost5 = async function(account) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:'+ account +' {ip:"10.0.0.95"})-[edge:SEND]->() WHERE edge.destIp <> "10.0.0.1" RETURN edge.destIp, sum(edge.count) ORDER BY sum(edge.count) DESC LIMIT 5'
        );
        returnPromise.then(result => {
            console.log(result.records);
            let nodeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                nodeArray.push(data[i]['_fields'][0]);
            }
            let ret = new Object();
            ret.ip = nodeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}

// Ip별 트래픽 수 조회
exports.getListByIp = async function(account, destIp) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:'+ account +' {ip:"10.0.0.95"})-[edge:SEND]->() WHERE edge.destIp = "' + destIp + '" RETURN DISTINCT edge.count ORDER BY edge.count DESC LIMIT 30'
        );
        returnPromise.then(result => {
            console.log(result.records);
            let nodeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                nodeArray.push(data[i]['_fields'][0]["low"]);
            }
            let ret = new Object();
            ret.ip = nodeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}

// 최대 2홉의 네트워크 탐색 및 조회
exports.get2HopNet = async function(account) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:' + account + ' {ip:"10.0.0.95"})-[edge:SEND*..3]->() RETURN edge, node LIMIT 10 '
        );
        returnPromise.then(result => {
            let edgeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                edgeArray.push(data[i]['_fields'][0]);
            }
            let ret = new Object();
            ret.edge = edgeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}
