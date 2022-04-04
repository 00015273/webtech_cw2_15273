//third-Part libraries 
const express = require('express')
// const { all } = require('express/lib/application')
const app = express()

// PORT
const PORT = process.env.PORT || 8000

// DATA
const db = require('./data/database')
const Article = require('./data/models')

db.sync({ force: true }).then(() => "Db is binded successfully..." )

// SET UP
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('public'))

// ROOT URL
app.get('/', async function(req,res){
    let articles = null

    try{
        articles = await Article.findAll()

        let id = req.query.id != undefined ? req.query.id : undefined
        let isDeleted = req.query.isDeleted == 'true' ? true : false
        let isUpdated = req.query.isUpdated == 'true' ? true : false

        res.render('index', {
            articles: articles,
            id: id,
            deleted: isDeleted,
            updated: isUpdated
        })
        // console.log(articles)
    } catch {
        articles = []
        res.render('index', { articles: articles })
    }

})

// CREATE - get req
app.get('/createNew', (req, res) => {
    res.render('createUpdate')
})

// CREATE post req
app.post('/create-article', async (req,res) => {
    let formArticle = req.body
    const article = await Article.create(formArticle)
    res.redirect(`/?id=${ article.id }`)
}) 

// EDITING get-req
app.get(`/edit-article/:id`, async (req,res) => {
    let id = req.params.id
    let article = await Article.findByPk(id)
    res.render('createUpdate', { article: article })
})

// POSTING UPDATE REQ
app.post('/update-article/:id', async (req, res) => {
    let id = req.params.id
    let result = await Article.update({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description
    }, {
        where: {
            id: id
        }
    })

    res.redirect(`/?updated=true`)
})

// Delete
app.get('/delete-article/:id', async (req,res) => {
    let id = req.params.id
    let result = await Article.destroy({
        where: {
            id: id
        }
    })

    res.redirect(`/?deleted=true`)
})


app.listen(PORT, function(){
    console.log(`Server is running on port ${ PORT }`);
})