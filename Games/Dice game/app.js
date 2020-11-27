/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores,round_score,active_player;
var gameplaying = true;
init();



document.querySelector('.btn-roll').addEventListener('click', function(){
	
	if (gameplaying == true){
			//Random Number
		var dice = Math.floor(Math.random()*6)+1;

		//Display the result
		var diceDom = document.querySelector('.dice');
		diceDom.style.display = 'block';
		diceDom.src = 'dice-'+dice+'.png';

		//Updating the score
		if (dice !== 1){
			//add score
			round_score += dice;
			document.querySelector('#current-'+active_player).textContent = round_score;
		}
		else{
			//next player
			nextPlayer();
		}

	}
});

document.querySelector('.btn-hold').addEventListener('click' , function(){

	if (gameplaying == true){
			//Add current score to global score
		scores[active_player] += round_score;

		//update the UI
		document.querySelector('#score-' + active_player).textContent = scores[active_player];


		//check if player won the game
		if (scores[active_player]>=20){
			document.querySelector('#name-' + active_player).textContent = 'winner';
	        document.querySelector('.dice').style.display = 'none';		
	        document.querySelector('.player-' + active_player + '-panel').classList.add('winner');
	        document.querySelector('.player-' + active_player + '-panel').classList.remove('active');
	        gameplaying = false;
		}
		else{
			//next player 
			nextPlayer();
		}
	}

});

function nextPlayer(){
	active_player === 0 ? active_player = 1 : active_player = 0;
		round_score = 0;

	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	//document.querySelector('.player-0-panel').classList.remove('active');
	//document.querySelector('.player-1-panel').classList.add('active');

	document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click' , init);

function init(){
	scores = [0,0];
	active_player = 0;   
	round_score = 0;
	gameplaying = true;

	document.querySelector('.dice').style.display = 'none';

	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');

}

//document.querySelector('#current-'+active_player).textContent = dice; 
//console.log(dice)
