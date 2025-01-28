const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;
const dbConnect = require('./config/dbConnect');
const initRoutes = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dbConnect();

app.use(express.json()); // express đọc hiểu data từ client gửi lên
app.use(express.urlencoded({ extended: true })); // đọc hiểu dữ liệu dạng urlencoded do client gửi lên
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(cookieParser()); // đọc cookie

initRoutes(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

