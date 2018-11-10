const neo4j = require('./neo4j');

// Box Plot init
exports.getMost5 = async function(account) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:$account {ip:"10.0.0.1"})-[edge:SEND]->() WHERE RETURN node.dest_ip ORDER BY count(edge) SKIP 1 LIMIT 5',
            {account: account}
        );
        returnPromise.then(result => {
            console.log(result.records);
            let nodeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                nodeArray.push(data[i]['_fields'][0]['properties']);
            }
            let ret = new Object();
            ret.node = nodeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}

exports.getCountByIP = async function(account, destIp) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:$account)-[edge:SEND]-() WHERE edge.dest_ip = $destIp RETURN count(edge), edge.dest_ip AS ip GROUP BY edge.destIp ORDER BY count(edge) LIMIT 5',
            {account: account, ip: destIp}
        );
        returnPromise.then(result => {
            console.log(result.records);
            let nodeArray = new Array();
            let edgeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                nodeArray.push(data[i]['_fields'][0]['properties']);
                edgeArray.push(data[i]['_fields'][1]['properties']);
            }
            let ret = new Object();
            ret.node = nodeArray;
            ret.edge = edgeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}

exports.get2HopNet = async function(account) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:$account {ip:"10.0.0.1})-[:SEND*..2]->() RETURN node, edge',
            {account: account}
        );
        returnPromise.then(result => {
            console.log(result.records);
            let nodeArray = new Array();
            let edgeArray = new Array();
            let data = JSON.parse(JSON.stringify(result.records));
            for(let i = 0; i < data.length; i++){
                nodeArray.push(data[i]['_fields'][0]['properties']);
                edgeArray.push(data[i]['_fields'][1]['properties']);
            }
            let ret = new Object();
            ret.node = nodeArray;
            ret.edge = edgeArray;
            ret = JSON.stringify(ret);
            resolve(ret);
        })
    })
}
