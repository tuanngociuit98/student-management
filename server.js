const express =  require('express')
const connectDB =   require('./config/db')

const app = express();
app.get('/',(req,res)=>res.send('API Running'))

//Connect database
connectDB()


//Initial MiddleWare
app.use(express.json({ extend:false }))
app.get('/register',(req,res)=> res.send('API running ...'))



//Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server start on port ${PORT}`))