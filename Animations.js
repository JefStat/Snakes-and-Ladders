// Define the entry point
$(document).ready(function()
{
	animation.resetTokens();
});
var animation = new function(board_height, board_width, preamble){
	var self = this;
	var board_height = board_height;
	var board_width = board_width;
	
	function integerDivide(numerator, denominator){
		var remainder = numerator % denominator;
		return ( numerator - remainder ) / denominator;
	}
	
	var square_width = integerDivide( board_width, 10);
	var square_height = integerDivide( board_height, 10);
	
	//Assumes a 10*10 board, calculates the image top and left for position then moves the token.
	self.animateToken =	function(token, position) {
							var x = position % 10;
							var y = integerDivide(position,10);
							if (y % 2 == 1)
							{// if y is odd x is inversed for the alternating left to right movement
								x = 10 - x;
								if(x==10){x=x-1;} //special case for positions 10/30/50/70/90
							} else {
								if( x != 0){ x = x - 1;}//special case for 20/40/60/80/100
							}
							if (x == 0) {
								y = 10 - y; //special case for 20/40/60/80/100
							} else { //board is completed from bottom up.
								if (y % 2 == 1 && x==9 && position % 10 != 1) {//special case for 11/31/51/71/91
									y = 10 - y;
								} else {
									y = 9 - y;
								}
							}
							if (position == 0){
								x = -1;
								y = 9;
							}
							move(token,x,y);
						}
	
	function move(token,x,y){
		$("#" + token).animate({
				left: 		x*square_width,
				top:		y*square_height
			}, {
				queue:		true,
				duration:	"fast",
				easing:		"easeOutQuint"
			});
	}

	self.resetTokens = 	function(players){
							$(".tokens").clearQueue().stop();
							$(".tokens").css({
								top: 	function(index, value){
											return square_height * 9;
										},
								left:	function(index, value){
											return -square_width;
										}
							});
						}
}(1760,1760);