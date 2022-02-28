document.addEventListener('DOMContentLoaded', () => {

  let game = document.getElementById('memory-game');
  let score = 0;
  let scoreTable = [20, 25, 40, 50, 70, 100, 150, 200, 1000];
  
  if (localStorage.getItem('game-score')) {
    scoreTable = JSON.parse(localStorage.getItem('game-score'));
  }
  
  selectGame();

  function selectGame() {
    let selectBox = document.createElement('div');
    selectBox.classList.add('select-game');

    let j = 12;
    for(let i = 1; i <= 4; i++) {
      selectBox.append(createButton(j))
      j +=4;
    }

    game.append(selectBox);

    let select = game.querySelector('.select-game');
    
    //запуск игры
    select.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-button')) {
        game.innerHTML = '';
        score = 0;
        game.classList.add('play');
        let numberOfcards = parseInt(e.target.textContent);

        let memoryGame = document.createElement('div');
        memoryGame.classList.add('memory-game');
        memoryGame.classList.add(`card-${numberOfcards}`);

        let gameScore = document.createElement('div');
        gameScore.classList.add('game-score');
        
        gameScore.textContent = `Steps: ${score}`;

        game.append(memoryGame, gameScore);

        for(let i = 1; i <= numberOfcards; i++) {
          memoryGame.append(createCard(Math.ceil(i / 2)));
        }

        getGame(numberOfcards / 2);
      }
    })
  }

  function createButton(howCards) {
    let button = document.createElement('button');
    button.classList.add('select-button');
    button.textContent= `${howCards} cards`
    return button;
  }

  function getGame(numberOfPairs) {
    const cards = document.querySelectorAll('.memory-card');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let count = numberOfPairs;
  
    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;

      this.classList.add('flip');
  
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return
      }

      secondCard = this;
      checkForMatch();
    }

    function checkForMatch() {
      let isMatch = firstCard.dataset.key === secondCard.dataset.key;
      game.querySelector('.game-score').textContent = `Steps: ${++score}`;

      isMatch ? disableCards() : unflipCards();     
    }

    function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);

      resetBoard();
      count--;
      
      if (count < 1) {
        game.append(congratulation());
        gameAgain();
      }
    }

    function unflipCards() {
      lockBoard = true;

      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
      }, 1500);
    }

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }
  
    cards.forEach(card => card.addEventListener('click', flipCard));
  }
  
  function createCard(frontFace) {
    let face = document.createElement('div');
    face.classList.add('front-face');
    face.textContent = `${frontFace}`;

    let back = document.createElement('img');
    back.classList.add('back-face');
    back.src = './img/back-face.png';
    back.alt = 'Memory Card';

    let card =  document.createElement('div');
    card.classList.add('memory-card');
    card.setAttribute('data-key', `${frontFace}`);
    card.style.order = Math.floor(Math.random() * 100);
    card.append(face, back);
    
    return card;
  }

    function congratulation() {    
    let gameEnd = document.createElement('div');
    gameEnd.classList.add('winner');

    let сongrats = document.createElement('span');
    сongrats.classList.add('winner-descr');
    сongrats.textContent = 'Congratulation';

    let button = document.createElement('button');
    button.classList.add('winner-btn');
    button.textContent = 'Again';

    let scoreBoard = document.createElement('div');
    scoreBoard.classList.add('score-game');
    scoreTable.push(score);

    if(scoreTable.length > 1) {
      scoreTable.sort((a, b) => a - b);
    }

    if(scoreTable.length > 10) {
      scoreTable.length = 10;
    }
    
    for (let i = 0; i < 10; i++) {
      let place = document.createElement('span');
      place.classList.add('game-place');
      place.textContent = `#${i + 1}    -    ${scoreTable[i]}`
      scoreBoard.append(place);
    }  

    localStorage.setItem('game-score', JSON.stringify(scoreTable));

    gameEnd.append(сongrats,scoreBoard, button);

    return gameEnd;
  }

  function gameAgain() {
    let buttonAgain = game.querySelector('.winner-btn')

    buttonAgain.addEventListener('click', function () {
      game.classList.remove('play');
      game.querySelector('.winner').classList.remove('isOpen');
      
      game.innerHTML = '';

      game.append(selectGame());
    })
  }
});


