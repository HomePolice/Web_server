const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(
    process.env.NEO_HOST, 
    neo4j.auth.basic(
        process.env.NEO_USER, 
        process.env.NEO_PASSWORD
    )
);

const session = driver.session();

exports.session = session;