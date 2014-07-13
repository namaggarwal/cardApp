$("document").ready(function(){

	$("#errorpopup").enhanceWithin().popup();		
	$(".cpage").on("click",onChangePageButtonClick);
	$(".closePanel").on("click",onClosePanelClick);
	$("#reg").on("click",onRegistrationClick);
	$("#login").on("click",onLoginClick);
	$("#addCard").on("click",onAddCardClick);
	$("#logout").on("click",common.logout);
	$("#pPBtnPull").on("click",onPullButtonClick);
	$(".pPBtnAmt").on("click",onAmtButtonClick);
	$("#cnclPull").on("click",onCancelPullButtonClick);
	$("body").pagecontainer({beforeshow: beforeshowpage,show:afterpageshow});

});

$(document).on("pageinit","#loginPage",onLoginPageInit);


var beforeshowpage = function( event, ui ) {
	var toPage = ui.toPage;
	if(toPage != "loginPage" && toPage != "regPage"){

		common.setDefaultPage(toPage.attr("id"));		
	}
	
};

var afterpageshow = function(event,ui){

	var toPage = ui.toPage;

	if(toPage.attr("id") == "transPage"){

		onTransPageShow();
	}
};


function onTransPageShow(){


	var till = localStorage.till;

	if(till == ""){

		localStorage.till = 1;
		till = 1;
	}
	$.mobile.loading('show');
	$("#popupTrans").popup('open');
	
        
	$.ajax({

		url:common.baseUrl+"/trans?act=list",
		data:{"till":till,"recid":localStorage.id},
		type:"POST",
		crossDomain :true,
		success:function(data){

			data = $.parseJSON(data);			
			$.mobile.loading('hide');
			if(data["REQUEST_STATUS"] == 1){				
				var str = '';
				str +="<p>Received "+amt+"$</p>";
				str +="<p>Transaction ID : "+data["TRANSID"]+"</p>";
				$("#popupRecSuccess").html(str);

				$("#popupTrans").on( "popupafterclose", function( event, ui ) {
					$("#popupTrans").off("popupafterclose");					
				});
				$("#popupTrans").popup('close');

				
			}else{			
				$("#errmsg").html(data["REQUEST_MESSAGE"]);

				$("#popupTrans").on( "popupafterclose", function( event, ui ) {
					$("#popupTrans").off("popupafterclose");					
					$("#errorpopup").popup("open");
				});
				$("#popupTrans").popup('close');

				
			}

		},
		error:function(err){
			
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#popupReadyRec").on( "popupafterclose", function( event, ui ) {
					$("#errorpopup").popup("open");
			});
			$("#popupReadyRec").popup('close');
			

		}

	});
}

function onLoginPageInit(){	
	
	if(common.checkIfLoggedIn()){
		
		common.gotoDefaultPage();
	}
	
}

function onClosePanelClick(){
	
	var btn = $(this);			
	$("#"+btn.attr("data-panel")).panel("close");
}

function onChangePageButtonClick(){
	
	var btn = $(this);
	$.mobile.changePage("#"+btn.attr("data-page"));
	
}

function onAddCardClick(){


	var userid = localStorage.id,
		name   = $("#cPName").val(),
		num    = $("#cPCardno").val(),
		valid  = $("#cPValid").val(),
		cvv    = $("#cPCvv").val();
	
	
	$("#addErr").hide();
	$.mobile.loading('show');
	$.ajax({

		url:common.baseUrl+"/card?act=add",
		data:{"userid":userid,"name":name,"num":num,"valid":valid,"cvv":cvv},
		type:"POST",
		crossDomain :true,
		success:function(data){
			
			data = $.parseJSON(data);
			$.mobile.loading('hide');				

			if(data["REQUEST_STATUS"] == 1){
				
				$("#popupAddCard").on( "popupafterclose", function( event, ui ) {

					$("#popupSuccess").popup('open',{transition:"fade"});
					window.setTimeout(function(){

						$("#popupSuccess").popup('close',{transition:"fade"});
					},1000);
					$("#popupAddCard").off("popupafterclose");
				});
				$("#popupAddCard").popup('close');
				
			}else{
				$("#addErr").html(data["REQUEST_MESSAGE"]);
				$("#addErr").show();

			}
		},
		error:function(err){
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#errorpopup").popup("open");
		}

	});


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
				common.setDefaultPage('cardPage');
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
			console.log(data);
			$.mobile.loading('hide');
			
			
			if(data["REQUEST_STATUS"] == 1){
				common.setUserData(data);
				common.setDefaultPage('cardPage');
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

function onAmtButtonClick(){

	var amt = $(this).attr("data-amt");

	startReceive(amt);
	
}

function onPullButtonClick(){

	var amt = $("#pPPrice").val();

	if(!( amt!="" && amt == parseInt(amt,10)) ){
		
		$("#errmsg").html("Please enter a valid amount.");
		$("#errorpopup").popup("open");
		return;
	}
   
	startReceive(amt);
}

function startReceive(amt){

	$.mobile.loading('show');
	localStorage.amt = amt;
	$("#amtRec").html(amt+"$");
	$("#popupReadyRec").popup('open');
	
	window.setTimeout(function(){
		initiateTransaction();
	},2000);
}

function onCancelPullButtonClick(){

	$("#popupReadyRec").popup('close');
	$.mobile.loading('hide');
}


function initiateTransaction(){

	var sendid = "1",
		sendcardid = "2",
	 	recid  = localStorage.id,
	 	reccardid = $.parseJSON(localStorage.defcard).id, // Change this
	 	amt = localStorage.amt;




	$.ajax({

		url:common.baseUrl+"/trans?act=add",
		data:{"sendid":sendid,"recid":recid,"sendcardid":sendcardid,"reccardid":reccardid,"amt":amt},
		type:"POST",
		crossDomain :true,
		success:function(data){

			data = $.parseJSON(data);
			$.mobile.loading('hide');

			if(data["REQUEST_STATUS"] == 1){				
				var str = '';
				str +="<p>Received "+amt+"$</p>";
				str +="<p>Transaction ID : "+data["TRANSID"]+"</p>";
				$("#popupRecSuccess").html(str);

				$("#popupReadyRec").on( "popupafterclose", function( event, ui ) {
					$("#popupReadyRec").off("popupafterclose");
					$("#popupRecSuccess").popup('open',{transition:'fade'});
				});
				$("#popupReadyRec").popup('close');

				window.setTimeout(function(){

					$("#popupRecSuccess").popup('close',{transition:'fade'});					

				},2200);
			}else{
				$.mobile.loading('hide');
				$("#errmsg").html(data["REQUEST_MESSAGE"]);

				$("#popupReadyRec").on( "popupafterclose", function( event, ui ) {
					$("#popupReadyRec").off("popupafterclose");
					$("#errorpopup").popup("open");
				});
				$("#popupReadyRec").popup('close');

				
			}

		},
		error:function(err){
			
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#popupReadyRec").on( "popupafterclose", function( event, ui ) {
					$("#errorpopup").popup("open");
			});
			$("#popupReadyRec").popup('close');
			

		}

	});


}