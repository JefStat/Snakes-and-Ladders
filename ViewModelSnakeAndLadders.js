var gameVM = new function(game){
	var self = this;
	self.players = ko.observableArray();
	self.currentTurn = ko.observable();
	self.gameState = ko.observable();
	var model = game;

	self.newGame = function(){
		model.newGame();
		animation.resetTokens();
	}
	
	self.nextTurn = function(){
		model.nextTurn();
	}

	self.isGameOver = ko.computed( function(){
		return self.gameState();
	});
	
	model.playersChanged(function(newPlayers){
		self.players($.map(newPlayers,function(item)
				{
					return new PlayerVM(item);
				}			)
		);
	});
	
	model.currentPlayerChanged(function(whoseTurn){
		self.currentTurn(new PlayerVM(whoseTurn));
	});
	
	model.gameStateChanged(function(newState){
		self.gameState(newState);
	});
	
	function PlayerVM(aPlayer){
		var playerSelf = this;
		var model = aPlayer;
		playerSelf.position = ko.observable(aPlayer.getPosition());
		playerSelf.name = ko.observable(aPlayer.getName());		
		
		playerSelf.setName = function(newName){
			model.setName(newName);
			playerSelf.name(newName);
		}
		
		model.positionChanged(function(newPosition){
			playerSelf.position(newPosition);
			if (newPosition > 100) {
				animation.animateToken(model.getName(), 100);
			} else {
				animation.animateToken(model.getName(), newPosition);
			}
		});
		model.nameChanged(function(newName){
			playerSelf.name(newName);
		});
	}
	self.newGame();
}(game);
ko.applyBindings(gameVM);
