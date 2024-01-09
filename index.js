const express = require('./express')

const app = express()

app.get('/', (req, res, next) => {
    console.log(next);
    next();
});

// Do not need to call res.end() to close the body because we do in the send function
app.get('/', (req, res) => {
    res.send({ hello: 'world' })
});

app.get('/json', (req, res) => {
    res.json({ hello: 'world' })
});

app.post('/post',(req,res) => {
    res.writeHead(200);
    res.write('Data from post :)');
    res.end();
})


app.listen(3000, () => console.log('Example app listening on port 3000!'));