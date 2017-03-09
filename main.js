var animateCir = function() {
    $("#populationCirc").animate({
        width: 120,
        height: 120,
        top: '+= 100',
        left: '44%',
	}); 
    $("#populationCirc").animate({
        width: 100,
        height: 100,
        top: '-= 100',
        left: '45%'
	});
	//$("populationText").fadeOut(1000);
	setTimeout(function() {animateCir() }, 5000);
}

$(document).ready(function() {
      $("button").click(function(){
        animateCir();
    });
});
