var incycle = true;

var outerbound = 120;

var prevbound = outerbound;

var tochange = 0;

var animateCir = function() {
	var offset = 10;
	if(incycle) {
		if(prevbound != outerbound){
   	 	$("#populationCirc").animate({
        	width: prevbound,
        	height: prevbound,
        	left: '-=' + parseInt(offset),
			}, 500); 
   	 	prevbound = outerbound;
		} else {
   	 	$("#populationCirc").animate({
        	width: outerbound,
        	height: outerbound,
        	left: '-=' + parseInt(offset),
			}, 500); 
   	 	}
        if(parseInt(tochange) != 0) {
    		$("#populationCirc").animate({
        		width: outerbound - 20,
        		height: outerbound - 20,
        		left: '+=' + (parseInt(offset) + parseInt(tochange)),
				}, 500);
        } else {
    		$("#populationCirc").animate({
        		width: outerbound - 20,
        		height: outerbound - 20,
        		left: '+=' + parseInt(offset),
				}, 500);
        }
	tochange = 0;
	$("#populationText").fadeOut(500);
	$("#populationText").fadeIn(500);
	setTimeout(function() {animateCir() }, 5000);
	}
}

function outputUpdate(num) {
    tochange = ((outerbound-20)-parseInt(num))/8;
    document.querySelector('#output').value = num;
    document.getElementById('populationText').innerHTML = 'n=' + num;
    outerbound = parseInt(num) + 20;
    document.getElementById('populationText').innerHTML = tochange;
}

$(document).ready(function() {
	setTimeout(function() {animateCir() }, 5000);
    $("button").click(function(){
        incycle = !incycle;
    });

});
