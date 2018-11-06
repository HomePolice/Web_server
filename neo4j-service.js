const neo4j = require('./neo4j');

exports.getCountByIP = async function(destIp) {
    return new Promise((resolve, reject) => {
        let returnPromise = neo4j.session.run(
            'MATCH (node:test)-[r]-() RETURN node, r',
            {ip: destIp}
        );
        returnPromise.then(result => {
            resolve(JSON.stringify(result.records));
        })
    })
}