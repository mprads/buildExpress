const express = require('./express')
const app = express()

app.get('/', (req, res) => {
    res.writeHead(200);
    res.write('Hello world!');
    res.end();
});

app.post('/post',(req,res) => {
    res.writeHead(200);
    res.write('Data from post :)');
    res.end();
})


app.listen(3000, () => console.log('Example app listening on port 3000!'));