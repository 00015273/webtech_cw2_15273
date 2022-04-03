//third-Part libraries 
const express = require('express')
const app = express()

// PORT
const PORT = process.env.PORT || 8000

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('public'))

// ROOT URL
app.get('/', function(req,res){
    res.render('index')
})



app.listen(PORT, function(){
    console.log(`Server is running on port ${ PORT }`);
})