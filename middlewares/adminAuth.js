function adminAuth( req, res, next ) {

    if(req.session.user != undefined){// se tiver logado
        next();// continue
    }else{
        res.redirect("/login")//go to a login page
    }

}

module.exports = adminAuth