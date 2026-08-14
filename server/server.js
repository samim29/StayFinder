if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const app = require('./src/app');
const connectDb = require('./src/config/database.config');
const PORT = process.env.PORT || 3000;

connectDb();

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})