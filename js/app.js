var cardCount = 4,
	currCard  = 1,
	cardLeft  = 0,
	recReady = 0;


$("document").ready(function(){

	$("#errorpopup").enhanceWithin().popup();		
	$(".cpage").on("click",onChangePageButtonClick);
	$(".closePanel").on("click",onClosePanelClick);
	$("#reg").on("click",onRegistrationClick);
	$("#login").on("click",onLoginClick);
	$("#addCard").on("click",onAddCardClick);
	$("#logout").on("click",common.logout);
	$("#pPBtnPull").on("click",onPullButtonClick);
	$("#pPBtnPush").on("click",onPushButtonClick);
	$(".pPBtnAmt").on("click",onAmtButtonClick);
	$(".pSBtnAmt").on("click",onPushAmtButtonClick);
	$("#cnclPull").on("click",onCancelPullButtonClick);
	$("#cnclPush").on("click",onCancelPushButtonClick);
	$(".tPTill").on("click",onPeriodChange);
	$("body").pagecontainer({beforeshow: beforeshowpage,show:afterpageshow});
	$.event.special.swipe.horizontalDistanceThreshold = 10;
	$("#cardscontainer").on("swipeleft",onCardSwipeLeft);
	$("#cardscontainer").on("swiperight",onCardSwipeRight);
	
	 

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

	}else if(toPage.attr("id") == "cardPage"){

		onCardPageShow();
		
	}else if(toPage.attr("id") == "pullPage"){
			
		var el = $("#pPPrice");
		el.focus();
		
		
	}else if(toPage.attr("id") == "pushPage"){
		
		
		$("#pSPrice").focus();
		
	}
};

function onPeriodChange(){

	$("#transPanel").panel('close');
	localStorage.till = $(this).attr("data-till");
	onTransPageShow();
}

function onCardPageShow(){

	cardLeft = ($("#cardscontainer").width() - $(".card").eq(0).outerWidth())/2;
	$(".card").css("left",cardLeft+"px");
	currCard = 1;

}


function onCardSwipeLeft(){
	
	if(currCard < cardCount){

		var currLeft = $(".card").css("left");
		currLeft = currLeft.slice(0,currLeft.length-2);
		currCard++;		
		$(".card").animate({"left":(parseFloat(currLeft,10)-$(".card").eq(0).outerWidth())+"px"},200);
		

	}
	
	
}

function onCardSwipeRight(){


	if(currCard != 1){

		var currLeft = $(".card").css("left");
		currLeft = currLeft.slice(0,currLeft.length-2);
		currCard--;		
		$(".card").animate({"left":(parseFloat(currLeft,10)+$(".card").eq(0).outerWidth())+"px"},200);
		

	}
	
	
}

function onTransPageShow(){


	var till = localStorage.till;

	if(till == undefined){

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
				

				$("#tPTot").html(data["TOTAL"]+"$");
				$("#tPTR").html(data["TOTALREC"]+"$");
				$("#tPTS").html(data["TOTALSENT"]+"$");

				var str ='';
				for(var tr in data["TRANSREC"]){

					str += '<li>';
					str += '<div class="ui-grid-a">';
		        	str += '<div class="ui-block-a">';
		        	str += '<div class="fontBold">'+data["TRANSREC"][tr]["cardnum"]+'</div>';
		        	str += '<div class="tpTime">'+data["TRANSREC"][tr]["transtime"]+'</div>';
		        	str += '</div>';
		        	str += '<div class="ui-block-b alignRight">'+data["TRANSREC"][tr]["amount"]+'$</div>';
	        		str += '</div>';
					str += '</li>';

				}

				$("#tPListRec").html(str);
				$("#tPListRec").listview('refresh');

				str ='';
				for(var tr in data["TRANSSENT"]){

					str += '<li>';
					str += '<div class="ui-grid-a">';
		        	str += '<div class="ui-block-a">';
		        	str += '<div class="fontBold">'+data["TRANSSENT"][tr]["cardnum"]+'</div>';
		        	str += '<div class="tpTime">'+data["TRANSSENT"][tr]["transtime"]+'</div>';
		        	str += '</div>';
		        	str += '<div class="ui-block-b alignRight">'+data["TRANSSENT"][tr]["amount"]+'$</div>';
	        		str += '</div>';
					str += '</li>';

				}

				$("#tPListSent").html(str);
				$("#tPListSent").listview('refresh');

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

function getPhoneGapPath() {

    var path = window.location.pathname;
    var path = '/android_asset/www/index.html';
        
    return 'file://' + path;

};


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

				//get all the cards
				var cards = $.parseJSON(localStorage.cards);

				if(cards.length == 0){
					cards = new Object;
				}

				cards[data["CARD"].id] = data["CARD"];				
				//Store back all the cards
				localStorage.cards = JSON.stringify(cards);

				// If this is the default card
				if(data["CARD"].isdefault == 1){

					localStorage.defcard = JSON.stringify(data["CARD"]);
					localStorage.transcard = JSON.stringify(data["CARD"]);
				}



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

function onPushAmtButtonClick(){

	var amt = $(this).attr("data-amt");

	startSend(amt);
	
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


function onPushButtonClick(){

	var amt = $("#pSPrice").val();

	if(!( amt!="" && amt == parseInt(amt,10)) ){
		
		$("#errmsg").html("Please enter a valid amount.");
		$("#errorpopup").popup("open");
		return;
	}
   
	startSend(amt);
}




function startReceive(amt){

	$.mobile.loading('show');
	localStorage.amt = amt;
	$("#amtRec").html("$"+amt);	


	nfc.addTagDiscoveredListener(function(){
		if(recReady == 1){
			recReady = 0;
			initiateTransaction();
		}
	},function(){ 
		$("#popupReadyRec").popup('open');
		recReady = 1;
	},
	function(){
		console.log("Error");
	});


	
	/*window.setTimeout(function(){
		initiateTransaction();
	},2000);*/
}


function startSend(amt){

	$.mobile.loading('show');
	localStorage.amt = amt;
	$("#amtSen").html("$"+amt);
	$("#popupReadySen").popup('open');
	
	window.setTimeout(function(){
		initiateTransactionPush();
	},2000);
}


function onCancelPullButtonClick(){

	$("#popupReadyRec").popup('close');
	$.mobile.loading('hide');
	recReady = 0;
}

function onCancelPushButtonClick(){

	$("#popupReadySen").popup('close');
	$.mobile.loading('hide');
}

function initiateTransaction(){

	var sendid = "2",
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
					var snd = new Media("/android_asset/www/ALARM.wav",// success callback
             				function () { },
            				// error callback
             				function (err) {  }
        
				    	); 		
					snd.play();
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


function initiateTransactionPush(){

	var recid = "2",
		reccardid = "2",
	 	sendid  = localStorage.id,
	 	sendcardid = $.parseJSON(localStorage.defcard).id, // Change this
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
				str +="<p>Sent "+amt+"$</p>";
				str +="<p>Transaction ID : "+data["TRANSID"]+"</p>";
				$("#popupSenSuccess").html(str);

				$("#popupReadySen").on( "popupafterclose", function( event, ui ) {
					$("#popupReadySen").off("popupafterclose");
					$("#popupSenSuccess").popup('open',{transition:'fade'});
					var snd = new Media("/android_asset/www/ALARM.wav",// success callback
             				function () { },
            				// error callback
             				function (err) {  }
        
				    	); 		
					snd.play();
				});
				$("#popupReadySen").popup('close');

				window.setTimeout(function(){

					$("#popupSenSuccess").popup('close',{transition:'fade'});					

				},2200);
			}else{
				$.mobile.loading('hide');
				$("#errmsg").html(data["REQUEST_MESSAGE"]);

				$("#popupReadySen").on( "popupafterclose", function( event, ui ) {
					$("#popupReadySen").off("popupafterclose");
					$("#errorpopup").popup("open");
				});
				$("#popupReadySen").popup('close');

				
			}

		},
		error:function(err){
			
			$.mobile.loading('hide');
			$("#errmsg").html("Seems like we lost the connection.");
			$("#popupReadySen").on( "popupafterclose", function( event, ui ) {
					$("#errorpopup").popup("open");
			});
			$("#popupReadySen").popup('close');
			

		}

	});


}

