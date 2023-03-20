const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
})


router.post("/categories/save", adminAuth, (req, res)=>{
    var title = req.body.title

    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})


router.get("/admin/categories", adminAuth, (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index",{
            categories: categories
        })
    })

})


router.post("/categories/delete", adminAuth, (req, res)=>{
    var id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){//se for numero

            Category.destroy({
                where:{//destruir se tiver o id igual 
                    id: id
                }
            }).then(() =>{//se deletar ele faz o redirect pra listagem de categorias
                res.redirect("/admin/categories")
            })

        }else{
            res.redirect("/admin/categories")
        }
    }else{//se for nulo
        res.redirect("/admin/categories")
    }
})


router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id

    if(isNaN(id)) {//validacao pra somente aceitar numeros
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){

            res.render("admin/categories/edit",{
                category: category
            })

        }else{
            res.redirect("/admin/categories")
        }
    }).catch(error => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", adminAuth, (req, res)=>{
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, slug: slugify(title)},{//passa o que atualizar
        where: {//conferindo se o id for igual a id
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})


module.exports = router