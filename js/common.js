var common = {


	baseUrl:"http://localhost/CardAppBackend",
	checkIfLoggedIn:function(){

        if(localStorage.id){
            return true;
        }else{
        	return false;
        }
    },
    logout:function(){

		localStorage.clear();
		window.location.replace("../index.html");
	},
    gotoDefaultPage:function(){

        window.location.replace("html/home.html");

    }



}