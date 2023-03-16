//declarando constantes
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

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
    res.render("index")
})



//startando o server
app.listen(8181,()=>{console.log("server on!")})