const neo4j = require('./neo4j');

exports.getCountByIP = async function(destIp) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:test)-[edge]-() RETURN node, edge',
            {ip: destIp}
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