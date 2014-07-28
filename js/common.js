var common = {


	baseUrl:"http://mobile.mucoms.org",
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
        localStorage.setItem('cards',JSON.stringify(data.CARDS));

        if(data.CARDS.length != 0){

            for(var i in data.CARDS){
                if(data.CARDS[i].isdefault == 1){
                    localStorage.setItem('defcard',JSON.stringify(data.CARDS[i]));
                    break;
                }
            }
        }


    }



}