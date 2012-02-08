var game = new function(){
	var gameSelf = this;
	var START = 0;
	var VICTORY = 100;
	var players = [];
	var playerTurn;
	var snakesAndLadders = [new SnakeOrLadder( 1,38), new SnakeOrLadder( 4,14), new SnakeOrLadder( 9,31), new SnakeOrLadder(17,7 ), new SnakeOrLadder(21,42), new SnakeOrLadder(28,84), 
							new SnakeOrLadder(51,67), new SnakeOrLadder(54,34), new SnakeOrLadder(62,19), new SnakeOrLadder(64,60), new SnakeOrLadder(71,91), new SnakeOrLadder(80,100), 
							new SnakeOrLadder(87,24), new SnakeOrLadder(93,73), new SnakeOrLadder(95,75), new SnakeOrLadder(98,79)];
	
	gameSelf.newGame = function(){
		players = [new Player("Player1"), new Player("Player2")];
		playerTurn = Math.floor(Math.random()*players.length);
		InvokeCB(gameStateChangedCallback, false);
		InvokeCB(playersChangedCallback, players);
	}
	
	gameSelf.getPlayers = function(){
		return players;
	}

	gameSelf.getPlayerTurn = function(){
		return players[ playerTurn ];
	}
	
	gameSelf.getPlayersNames = function(){
		var i = 0;
		var result = new Array(players.length);
		for (i=0;i<players.length;i++){
			result[i] = players[i].name;
		}
		return result;
	}

	function updateTurn(){
		playerTurn = ++playerTurn % players.length;
		InvokeCB(currentPlayerChangedCallback, game.getPlayerTurn());
	}

	gameSelf.rollDice = function(){
		return Math.ceil(Math.random()*6);
	}

	gameSelf.nextTurn = function(){
		if (!game.isGameOver()){
			game.getPlayerTurn().move(snakesAndLadders);
			updateTurn();
		}
	}

	gameSelf.isGameOver = function(){
		var result = false;
		for(var i = 0; i < players.length; i++){
			if (players[i].getPosition() >= VICTORY) {
				result = true;
			}
		}
		if (result == true) {
			InvokeCB(gameStateChangedCallback, true);
		}
		return result;
	}
	
	var playersChangedCallback = new Array();
	var currentPlayerChangedCallback = new Array();
	var gameStateChangedCallback = new Array();
	
	gameSelf.playersChanged = function(cb){
		playersChangedCallback.push(cb);
	}
	
	gameSelf.currentPlayerChanged = function(cb){
		currentPlayerChangedCallback.push(cb)
	}
	
	gameSelf.gameStateChanged = function(cb){
		gameStateChangedCallback.push(cb);
	}
	
	function InvokeCB(cb, arg)
	{
	   for(var i=0;i<cb.length;i++)
	   {
		  if (cb[i]){cb[i](arg);}
	   }
	}

	/**
	* Player represents a player in the game.
	*/
	function Player(name){
		var playerSelf = this;
		var name = name;
		var position = START;
		
		playerSelf.getPosition = function(){
			return position;
		}
		
		playerSelf.setName = function(newName){
			playerSelf.name = newName;
			InvokeCB(nameChangedCallback,newName);
		}
		
		playerSelf.getName = function(){
			return name;
		}
		
		
		var positionChangedCallback = new Array();
		var nameChangedCallback = new Array();
		
		playerSelf.positionChanged = function(cb){
			positionChangedCallback.push(cb);
		}
		playerSelf.nameChanged = function(cb){
			nameChangedCallback.push(cb);
		}
		
		function InvokeCB(cb, arg)
		{
		   for(var i=0;i<cb.length;i++)
		   {
			  if (cb[i]){cb[i](arg);}
		   }
		}
		
		playerSelf.move = function(snakesAndLadders){
			position = game.rollDice() + position;
			var i;
			for (i = 0; i < snakesAndLadders.length; i++){
				if (position == snakesAndLadders[i].getHead()){
					position = snakesAndLadders[i].getTail();
				}
			}
			InvokeCB(positionChangedCallback,position);
		}
	}
	
	/**
	* SnakeOrLadder represents a snake or ladder object. 
	* To create a snake the head value must be greater then the tail value.
	* To create a ladder the head value must be great then the tail value. 
	*/
	function SnakeOrLadder(head, tail){
		var snakeOrLadderSelf = this;
		var head = Math.abs(head);
		var tail = Math.abs(tail);
		
		snakeOrLadderSelf.getHead = function() {
			return head;
		}
		
		snakeOrLadderSelf.getTail = function() {
			return tail;
		}
	}
	
	gameSelf.gameState = function(){
		alert(players[0].getName() + " Position = " + players[0].getPosition() + "\n" + players[1].getName() + " Position = " + players[1].getPosition() );
	}
	
	gameSelf.testVictory = function() {
		while (!game.isGameOver()){
			game.nextTurn();
		}
		alert("Game Over player " + game.getPlayerTurn().getName() + " is the victor.");
	}
}();
