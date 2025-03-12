const mysql = require('mysql'), bcrypt = require('bcrypt'), jwt = require('jsonwebtoken'), {promisify} = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req,res)=>{
    const {name, dob, email, password, confirmPassword, degree, age, mobile, address, gender} = req.body;
    db.query("select email from students where email = ?",[email],async (err,result)=>{
        if(err){
            console.log(err);
        }
        if(result.length > 0){
            return res.render('register',{message: "Email id already taken",message_type:"error"})
        }
        else if(password !== confirmPassword){
            return res.render("register",{message:'password not match',message_type:"error"});
        }
        let hashedPassword = await bcrypt.hash(password,8);
        db.query("insert into students set ?",
            {name:name, dob:dob, email:email, password:hashedPassword, degree:degree, age: age, mobile:mobile, address: address, gender: gender},
            (err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                    return res.render("register",{message:'Student registration success!!',message_type:"good"});
                }
            }
        );
    })
};

exports.login = async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).render('login',{message:"Please enter your Email and Password",
            message_type:"error"});
        }
        db.query("select * from students where email = ?",[email], async (err,result)=>{
            if(result.length <= 0){
                return res.status(401).render('login',{message:"email incorrect!!",
                    message_type:"error"});
            }else{
                if(!(await bcrypt.compare(password,result[0].password))){
                    return res.status(401).render('login',{message:"password incorrect!!",
                        message_type:"error"});
                }else{
                    const id = result[0].id;
                    const token = jwt.sign({id: id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});
                    console.log("The Token is: "+token);
                    const cookieOptions =  {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                    }
                    res.cookie("student",token,cookieOptions);
                    res.status(200).redirect("/home");
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
};

exports.isLogin = async (req,res,next)=>{
    console.log(req.cookies);
    if(req.cookies.student){
        try{
        const decode = await promisify(jwt.verify)(
            req.cookies.student,
        process.env.JWT_SECRET
        );
        db.query("select * from students where id = ?", [decode.id], (err, result)=>{
            if(!result){
                return next();
            }
            req.student= result[0];
            return next();
        })
    }catch(error){
        console.log(error);
        return next();
    }
    }else{
        next();
    }
}