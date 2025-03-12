const express =require('express'), router = express.Router(), userController = require('../controllers/students');

router.get(['/','/login'],(req,res)=>{
    res.render('login');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/profile', userController.isLogin,(req,res)=>{
    if(req.student){
        res.render("home",{student: req.student});
    }else{
        res.redirect("/login");
    }
    res.render('profile');
});

router.get('/home', userController.isLogin, (req,res)=>{
if(req.student){
    res.render("home",{student: req.student});
}else{
    res.redirect("/login");
}

    res.render('home');
});

module.exports = router;