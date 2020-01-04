var express  = require("express");
var router =  express.Router();
var sqlite3 = require("sqlite3");
var expressSession =  require("express-session");
var striptags  = require("striptags");
var db = new sqlite3.Database('./bd/db.db');
var validation =  require("./validate.js");

var validate = new validation();



//configuracion de session
var sess = {
    secret: 'keyboard cat',
    cookie: {}
}

//return data a
var returnApi = {
    error:null,
    code:""
}


//agregamos expres Session a la app
router.use(expressSession(sess));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));



//api description
router.post('/registro',function(req,res){

    var body =  req.body;

    if(req.body.email){
        if(validate.email(req.body.email)){

            db.run(`INSERT INTO usuarios(id,email,password) VALUES(null,'${striptags(body.email)}','${striptags(body.password)}')`,function(err){
                if(err == null){
                    //null = error estandar solo codigo estandar
                    returnApi.error = null;
                    returnApi.code = "Usuario_Registrado";
                    res.end(JSON.stringify(returnApi));
        
                }else{
                    //1 = usuario duplicado
                    returnApi.error =  1;
                    returnApi.code = "Usuario_No_Registrado";
                    res.end(JSON.stringify(returnApi));
                }
            });

        }else{
            //2 email no valido
            returnApi.error =  2;
            returnApi.code = "Email_No_Valido";
            res.end(JSON.stringify(returnApi));

        }
    }

   
});

router.post('/login',function(req,res){

    //validateEmail
    if(req.body.email && req.body.password){

        db.all(`SELECT id,email,password FROM usuarios WHERE email = '${req.body.email}' AND password = '${req.body.password}'`,function(e,data){
            console.log(data.length);
            if(data.length > 0){
                console.log("Open session");
                returnApi.error = null;
                returnApi.code = "Open_Session";
                res.end(JSON.stringify(returnApi));
                req.session.user = data[0].id;
            }else{
                //3 = no Open session 
                console.log("no sessions");
                returnApi.error = 3;
                returnApi.code  = "No_Open_Session";
                res.end(JSON.stringify(returnApi));
            }
        });

    }else{
        //4 =  no parametros
        returnApi.error = 3;
        returnApi.code  = "No_Existen_Parametros";
        res.end(JSON.stringify(returnApi));
        
    }

});



//home principal
router.get('/',function(req,res){
    res.sendfile("./app/index.html");
});

//chek session,
router.get('/check',function(req,res) {
    res.end(JSON.stringify(req.session.user));
});
//login
router.get('/registro',function(req,res){
    res.sendfile("./app/registro.html");
});

//registro
router.get('/login',function(req,res){
    res.sendfile("./app/login.html");
});

module.exports = router;
