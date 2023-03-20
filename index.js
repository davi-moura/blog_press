//declarando constantes
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const Users = require("./users/Users")

//view engine
app.set('view engine','ejs')


//static
app.use(express.static('public'))

//redis é melhor
//session
app.use(session({
    secret: 'secret123',
    cookie: {
        maxAge: 3600000,//1hr
    }
}))


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
app.use("/",usersController)



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

//teste de setar dados na sessao
// app.get("/session", (req,res) =>{
//     req.session.treinamento = "asdasgfdgsdfgsdfgsdf"
//     req.session.ano = 2023
//     req.session.email = "davimourabreu@gmail.com"
//     req.session.user = {
//         username: "davimourabreu",
//         email: "davimourabreu@gmail.com",
//         id: 1
//     }
//     res.send("sessao gerada")

// })

// app.get("/leitura", (req,res) =>{
//     res.json({
//         treinamento: req.session.treinamento,
//         ano: req.session.ano,
//         email: req.session.email,
//         user: req.session.user
//     })
// })

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