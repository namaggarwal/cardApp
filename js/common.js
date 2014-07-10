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
		$.mobile.changePage("#loginPage");
	},
    gotoDefaultPage:function(){

        var def = localStorage.defpage;
        console.log(def);
        if(def && def != ""){
            $.mobile.changePage("#"+def);
        }else{
            $.mobile.changePage("#loginPage");
        }
        

    },
    setDefaultPage:function(page){
        
        localStorage.setItem('defpage',page);
    },
    setUserData:function(data){

        localStorage.setItem('id',data.id);
        localStorage.setItem('pn',data.pn);
        localStorage.setItem('cc',data.cc);
        localStorage.setItem('cpn',data.cpn);
    }



}