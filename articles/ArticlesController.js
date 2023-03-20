const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req, res) =>{
    Article.findAll({
        include: [{model: Category}]//join das tabelas
    }).then(articles =>{
        res.render("admin/articles/index",{articles: articles})
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) =>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories})
    })
})

router.post("/articles/save", adminAuth, (req, res) =>{
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

router.post("/articles/delete", adminAuth, (req, res)=>{
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

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id

    if(isNaN(id)) {//validacao pra somente aceitar numeros
        res.redirect("/admin/articles")
    }

    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit",{
                    article: article,
                    categories: categories
                })
            })

        }else{
            res.redirect("/admin/articles")
        }
    }).catch(error => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", adminAuth , (req, res)=>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    },{//passa o que atualizar
        where: {//conferindo se o id for igual a id
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.get("/articles/page/:num",(req, res) => {//paginacao
    var page = req.params.num
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [//ordenando por id
            ['id', 'DESC']
        ]
    }).then(articles => {

        var next;

        if( offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles

        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{
                result: result,
                categories: categories
            })
        })

    })

})

module.exports = router