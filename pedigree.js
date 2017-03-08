$(document).ready(function() {
      $("button").click(function(){
        $("#populationCirc").animate({
		left: '+=50',
		height: 'toggle',
		width: 'toggle'
        }, "slow", 
		function() {
        		$("#populationCirc").animate({
	   		left: '-=50'
        	});
	  });
    });

});
