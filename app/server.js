//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
import multiply from './helpers/data/data-fetching/fetchData';

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  console.log(multiply(3, 4 )) 
  res.end( String(multiply(3, 4)));
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`); 
});