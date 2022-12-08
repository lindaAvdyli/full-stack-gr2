const express = require('express')
const app = express()

const db = require('./database.js')

const db = require('./database/database.js')
const models = require('./models/index');
app.use(express.json())

// .      /user/Joe/ 9  /test
app.get('/user/:id/:name/test', (req, res) => {
  res.send(`Hello World ${req.params.id} ${req.params.name}`)
})

app.get('/', (req,res)=>{
    res.send('Get method')
})

app.post('/', (req,res)=>{
    res.send(req.body.name)
})

app.put('/', (req,res)=>{
    res.send('Second Post method put')
})

app.delete('/', (req,res)=>{
    res.send('Second Post method delete')
})

app.get('/users',(req,res)=>{
    const users = models.User.findAndCountAll({})
    .then( userResponse => {
      res.json( userResponse )
    })
})


app.get('/users/limit/:limit',(req,res)=>{
    db.query('SELECT * FROM students LIMIT '+req.params.limit, (err,result)=>{
        if(err){ throw err}
        res.json(result)
    })
})

app.get('/users/limit2',(req,res)=>{
    db.query('SELECT * FROM students LIMIT 5,5', (err,result)=>{
        if(err){ throw err}
        res.json(result)
    })
})

app.get('/users/:id',(req,res)=>{
    const users = models.User.findOne({
        where: {id: req.params.id},
    })
    .then( userResponse => {
      res.json( userResponse )
    })

})

app.get('/users/limit/:page',(req,res)=>{
    const page = (req.params.page - 1 ) * 10
    db.query(`SELECT * FROM subjects LIMIT ${page},10`, (err,result)=>{
        if(err){ throw err}
        res.json(result)
    })
})

app.delete('/users/:id',(req,res)=>{
    db.query('DELETE FROM students WHERE id='+req.params.id, (err,result)=>{
        if(err){ throw err}
        res.json(result)
    })
    const users = models.User.destroy({
        where: {id: req.params.id},
    })
    .then( userResponse => {
      res.json( userResponse )
    })
    // db.query('DELETE FROM students WHERE id='+req.params.id, (err,result)=>{
    //     if(err){ throw err}
    //     res.json(result)
    // })
})
app.post('/users',(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    db.query('INSERT INTO students(firstName,lastName,email) VALUES ("'+firstName+'","'+lastName+'","'+email+'")'
    , (err,result)=>{
        if(err){ throw err}
        res.json(result)
    })
})

app.put('/users/:id',(req,res)=>{

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const userId = req.params.id

    const getUser = `Select count(id) as count FROM students where id = '${userId}'`
    const sql = `UPDATE students SET firstName = '${firstName}', lastName = '${lastName}' WHERE (id = '${userId}')`;

    db.query(getUser,(err,result)=>{
        if(err){ throw err}
        if(result[0].count !== 0){
            db.query(sql ,(err,result)=>{
                if(err){ throw err}
                res.json({message:`Student with id ${userId} has been updated!`})
            })
        }else{
            res.json({message:`Student with id ${userId} is not found!`}, 404)
        }

    })
})

app.listen(3000)