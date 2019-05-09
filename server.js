const express = require("express");
const mongoose = require("mongoose");
const connectDB =  require('./config/db');

const app= express();

//Connect Database
connectDB();

//Bodyparser Middleware
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('API Running')
});




app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))