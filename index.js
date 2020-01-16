// implement your API here
const express = require('express');

const server = express();

server.listen(4000, (req, res) => {
    console.log(`server listening on port 4000`);
});

server.get('/api/users')