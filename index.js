//third-Part libraries 
const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator')

// PORT
const PORT = process.env.PORT || 8000

// DATA
const db = require('./data/database')
const Article = require('./data/models')

db.sync({ force: false }).then(() => "Db is binded successfully..." )

// SET UP
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('public'))

// ROOT URL
app.get('/', async function(req,res){
    let articles = null
    let categories = {
        0: "Business",
        1: "IT",
        2: "Law",
        3: "Medical"
    } 

    try{
        articles = await Article.findAll()
        let id = req.query.id != undefined ? req.query.id : undefined
        res.render('index', {
            articles: articles,
            categories: categories,
        })


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
app.post('/create-article',
    body("title").isLength({ min: 1 }).withMessage("Title must not be empty"),
    body("category").isLength({ min: 1 }).withMessage("Please choose category"),
    body("description").isLength({ min: 10 }).withMessage("Description must contain at least 10 characters"),
    async (req,res) => {
        let id = req.params.id
        let article = await Article.findByPk(id)
        // VALIDATION
        const err = validationResult(req)
        let titleError = null
        let categoryError = null
        let descriptionError = null
        if(!err.isEmpty()) {
            const errors = err.array()
            for (error of errors){
                console.log(error);
                if (error.param == "title") {
                    titleError = error.msg
                }
                if (error.param == "category") {
                    categoryError = error.msg
                }
                if (error.param == "description") {
                    descriptionError = error.msg
                }
            }
            
            res.render('createUpdate', { 
                article: article,
                titleError: titleError,
                categoryError: categoryError,
                descriptionError: descriptionError
            })
            // IF NO ERROR, RENDERING...
        } else {
            let formArticle = req.body
            const article = await Article.create(formArticle)
            res.redirect(`/?id=${ article.id }`)
        }
}) 

// EDITING get-req
app.get(`/edit-article/:id`, async (req,res) => {
    let id = req.params.id
    let article = await Article.findByPk(id)
    let categories = {
        0: "Business",
        1: "IT",
        2: "Law",
        3: "Medical"
    } 
    res.render('createUpdate', { 
        article: article,
        categories: categories
    })
})

// POSTING UPDATE REQ
app.post('/update-article/:id',
    body("title").isLength({ min: 1 }).withMessage("Title must not be empty"),
    body("category").isLength({ min: 1 }).withMessage("Please choose category"),
    body("description").isLength({ min: 10 }).withMessage("Description must contain at least 10 characters"),

    async (req, res) => {
        let id = req.params.id
        let article = await Article.findByPk(id)
        let categories = {
            0: "Business",
            1: "IT",
            2: "Law",
            3: "Medical"
        } 

        const err = validationResult(req)
        let titleError = null
        let categoryError = null
        let descriptionError = null
        if(!err.isEmpty()) {
            const errors = err.array()
            for (error of errors){
                console.log(error);
                if (error.param == "title") {
                    titleError = error.msg
                }
                if (error.param == "category") {
                    categoryError = error.msg
                }
                if (error.param == "description") {
                    descriptionError = error.msg
                }
            }
            
            res.render('createUpdate', { 
                article: article,
                categories: categories,
                titleError: titleError,
                categoryError: categoryError,
                descriptionError: descriptionError
            })

        }
        else {
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
        }
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