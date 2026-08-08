require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/databse');


connectDb();

app.listen(3000, () => {
    console.log("server is listening on port 3000");
})