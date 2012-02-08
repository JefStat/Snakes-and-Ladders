var gameVM = new function(game){
	var self = this;
	self.players = ko.observableArray();
	self.currentTurn = ko.observable();
	self.gameState = ko.observable();
	var model = game;

	self.defaultSetup = function(){
		self.players.removeAll();
		game.defaultSetup();
	}
	
	self.newGame = function(){
		model.newGame();
	}
	
	self.nextTurn = function(){
		model.nextTurn();
	}
	
	self.isGameOver = ko.computed( function(){
		return self.gameState();
	});
	
	self.addPlayer = function(){
		model.addPlayer();
	}
	
	model.playerAdded(function(addedPlayer){
		self.players.push( new PlayerVM(addedPlayer));
		animation.animateToken(addedPlayer.getName(), 0);
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
		playerSelf.diceRoll = ko.observable();
		playerSelf.editing = ko.observable(false);
		playerSelf.edit = function() { playerSelf.editing(true); }
		
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
		model.diceRolled(function(diceRollValue){
			playerSelf.diceRoll(diceRollValue);
		});
	}
	game.defaultSetup();
}(game);

/** Validate player names idea code from http://knockoutjs.com/documentation/extenders.html
ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
 
    //define a function to do validation
    function validate(newValue) {
       target.hasError(newValue ? false : true);
       target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }
 
    //initial validation
    validate(target());
 
    //validate whenever the value changes
    target.subscribe(validate);
 
    //return the original observable
    return target;
};
function AppViewModel(first, last) {
    this.firstName = ko.observable(first).extend({ required: "Please enter a first name" });
    this.lastName = ko.observable(last).extend({ required: "" });
} */

ko.applyBindings(gameVM);
