const express = require('express')
const port = 3000
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const getUsers = require('./user')
const session = require('express-session')


app.use(bodyParser.urlencoded({extended : true}))
app.use(session({
  secret: 'this-is-my-secret-you-fucker',
  resave: false,
  saveUninitialized: false
}))

app.engine('handlebars',exphbs({defaultLayout : 'main'}))
app.set('view engine','handlebars')

app.get('/', (req, res)=>{
  if(req.session.user){
    let user = req.session.user
    let name = user.firstName
    res.render('login',{user : name})
  } else{
    res.render('index')
  }
  
})

app.post('/login',(req, res)=>{
  
  let user = getUsers(req.body.id, req.body.passwords)
  if(typeof user === "string"){
    res.render('index', {notUser : user})
    return 
  } else{
    req.session.user = user
    res.render('login', {user : user.firstName})
    return
  }  
})

app.get('/logout',(req, res)=>{
  req.session.destroy()
  res.redirect('/')
})

app.listen(port,()=>{
  console.log('now is running')
})