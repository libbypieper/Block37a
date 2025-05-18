const app = require('./app');
const port = 3000
const{client} = require("./db")

app.listen(port, async () => {
    client.connect()
    console.log(`Example app listening on port ${port}`)
})