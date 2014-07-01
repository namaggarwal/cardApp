var cards = (function(){

	var init = function(){

		createFlipster();
		addEvents();
	},
	addEvents = function(){

		$(".emptycard").on("click",onEmptyCardClick);

	},
	onEmptyCardClick = function(){

		$("#cardsCont").slideUp();
		$("#addcard").slideDown();

	},
	createFlipster = function(){

		$('.flipster').flipster({

		 	style:"carousel",
		 	start:0
		 });
	};


	return {
		init:init
	}


})();


$(document).ready(function(){

	 cards.init();

});