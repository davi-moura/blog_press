const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

router.get("/admin/articles", (req, res) =>{
    Article.findAll({
        include: [{model: Category}]//join das tabelas
    }).then(articles =>{
        res.render("admin/articles/index",{articles: articles})
    })
})

router.get("/admin/articles/new", (req, res) =>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories})
    })
})

router.post("/articles/save", (req, res) =>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(error => {
        res.send(error)
    })

})

router.post("/articles/delete",(req, res)=>{
    var id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){//se for numero

            Article.destroy({
                where:{//destruir se tiver o id igual 
                    id: id
                }
            }).then(() =>{//se deletar ele faz o redirect pra listagem de categorias
                res.redirect("/admin/articles")
            })

        }else{
            res.redirect("/admin/articles")
        }
    }else{//se for nulo
        res.redirect("/admin/articles")
    }
})


module.exports = router