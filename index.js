//declarando constantes
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

//view engine
app.set('view engine','ejs')


//static
app.use(express.static('public'))


//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//database
connection
    .authenticate()
    .then(()=>{
        console.log("conexao feita")
    }).catch((error) => {
        console.log(error)
    })




//importando os dois controlles de rotas
app.use("/",categoriesController)
app.use("/",articlesController)



//rotas
app.get("/", (req,res) =>{

    Article.findAll({//pegando os artigos no bd
        order: [//ordenando por id
            ['id', 'DESC']
        ],
        limit: 4        
    }).then( articles =>{//achou
        Category.findAll().then( categories =>{//pesquisa tbm as categorias
            res.render("index", {//e manda tudo pra view
                articles: articles,
                categories: categories
            })
        })
    })
})

app.get("/:slug", (req,res) =>{
    var slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article =>{
        if(article != undefined){
            Category.findAll().then( categories =>{//pesquisa tbm as categorias
                res.render("article", {//e manda tudo pra view
                    article: article,
                    categories: categories
                })
            })
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/")
    })

})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then( category =>{
        if(category != undefined){

            Category.findAll().then( categories =>{//pesquisa tbm as categorias
                res.render("index", {//e manda tudo pra view
                    articles: category.articles,
                    categories: categories
                })
            })

        }else{//se for nula
            res.redirect("/")
        }
    }).catch(err =>{//se der algum b.o na pesquisa
        res.redirect("/")
    })
})

//startando o server
app.listen(8181,()=>{console.log("server on!")})