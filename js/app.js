$("document").ready(function(){

	$("#errorpopup").enhanceWithin().popup();		
	$(".cpage").on("click",onChangePageButtonClick);
	$(".closePanel").on("click",onClosePanelClick);
	$("#reg").on("click",onRegistrationClick);
	$("#login").on("click",onLoginClick);	
});

$(document).on("pageinit","#loginPage",onLoginPageInit);
$(document).on("pageinit","#regPage",onRegPageInit);
$(document).on("pageinit","#cardPage",onCardPageInit);

function moveAndSetDefault(page){

	if(common.checkIfLoggedIn()){
		
		common.gotoDefaultPage();
	}else{

		common.setDefaultPage(page);
	}

}


function onLoginPageInit(){	
	
	moveAndSetDefault('loginPage');
	
}

function onRegPageInit(){

	moveAndSetDefault('regPage');

}

function onCardPageInit(){

	moveAndSetDefault('cardPage');

}

function onClosePanelClick(){
	
	var btn = $(this);			
	$("#"+btn.attr("data-panel")).panel("close");
}

function onChangePageButtonClick(){
	
	var btn = $(this);
	$.mobile.changePage("#"+btn.attr("data-page"));
	
}

function onRegistrationClick(){


	var cc = $("#regCnCode").val(),
		pn = $("#regPNum").val(),
		pwd = $("#regpw1").val(),
		cpwd = $("#regpw1").val();
	
	$.mobile.loading('show');
	$.ajax({

		url:common.baseUrl+"/register",
		data:{"cc":cc,"pn":pn,"pwd":pwd,"cpwd":cpwd},
		type:"POST",
		crossDomain :true,
		success:function(data){
			
			data = $.parseJSON(data);
			$.mobile.loading('hide');				

			if(data["REQUEST_STATUS"] == 1){
				common.setUserData(data);
				$.mobile.changePage("#cardPage");	
			}else{
				$("#errmsg").html(data["REQUEST_MESSAGE"]);
				$("#errorpopup").popup("open");
			}
		},
		error:function(err){
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#errorpopup").popup("open");
		}

	});


}


function onLoginClick(){


	var cc = $("#lgnCnCode").val(),
		pn = $("#lgnPNum").val(),
		pwd = $("#lgnPwd").val();
				
	$.mobile.loading('show');
	$.ajax({

		url:common.baseUrl+"/login",
		data:{"cc":cc,"pn":pn,"pwd":pwd},
		type:"POST",
		crossDomain :true,
		success:function(data){

			data = $.parseJSON(data);
			$.mobile.loading('hide');
			
			
			if(data["REQUEST_STATUS"] == 1){
				common.setUserData(data);
				$.mobile.changePage("#cardPage");	
			}else{
				$("#errmsg").html(data["REQUEST_MESSAGE"]);
				$("#errorpopup").popup("open");
			}
		},
		error:function(err){
			
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#errorpopup").popup("open");
			

		}

	});


}
