import http from 'http';

http.get('http://localhost:3000/api/debug/db-check', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('DB Check Response:', data);
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
