
class validate{
    
    email(email){

        //var expresion = /[A-Z]/gi;
        if(email.search("@") > -1){
            //filterdata
            return true;
        }else{
            return false
        }
        
        
    }
}

module.exports = validate;
