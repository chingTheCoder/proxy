const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // handle GET request
  if (req.method === 'GET' && req.url === '/') {
    // read index.html file
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
  // handle POST request
  else if (req.method === 'POST' && req.url === '/domain') {
    let domain = '';
    req.on('data', (chunk) => {
      domain += chunk;
    });
    req.on('end', () => {
      fs.readFile('blocklist.json', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error loading blocklist.json');
        } else {
          let blocklist = JSON.parse(data);
          if (blocklist.includes(domain)) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Domain '${domain}' already exists in blocklist`);
          } else {
            blocklist.push(domain);
            fs.writeFile('blocklist.json', JSON.stringify(blocklist), (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error updating blocklist.json');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Added domain '${domain}' to blocklist`);
              }
            });
          }
        }
      });
    });
  }
  
  // handle 404 not found
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(80, () => {
  console.log('Server running on port 80');
});
