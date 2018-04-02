var MemoryGame = (function() {
  /*
   * Create a list that holds all of your cards
   */
  const CONTAINER = document.querySelector(".container");
  const CARDSHOLDER = CONTAINER.querySelector(".deck");
  const CARDSYMBOLS = ["fa-diamond", "fa-paper-plane-o","fa-anchor", "fa-bolt","fa-cube","fa-leaf","fa-bicycle", "fa-bomb"];
  let opencards =[];
  let matches = [];
  let card = "";
  /* timer */
  let seconds = 0;
  let minutes = 0;
  let t;
  let isActiveTimer = false;
  const TIMER = CONTAINER.querySelector(".timer");
  /*
  *  - shuffle the list of cards using the provided "shuffle" method below
  */
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /*
   *  - display the card's symbol (put this functionality in another function that you call from this one)
  */
  function cardsSymbols(array){
    let doubleArray = array.concat(array);
    return shuffle(doubleArray);
  }

  /*
  * Display the cards on the page
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
  function buildCards(array){
    let shuffledSymbols = cardsSymbols(array);
    for ( let i = 0; i < shuffledSymbols.length; i++) {
      const ITAG = document.createElement("i");
      const LITAG = document.createElement("li");

      ITAG.classList.add("fa", shuffledSymbols[i]);
      LITAG.classList.add("card");

      LITAG.append(ITAG);
      CARDSHOLDER.append(LITAG);
    }
    card = CARDSHOLDER.querySelectorAll(".card");
    return card;
  }
  /*
  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
  *  - if the list already has another card, check to see if the two cards match
  */
  function openCards(){
    CARDSHOLDER.addEventListener("click", function(e){
      if(e.target.classList.contains("card") && !e.target.classList.contains("open")){
        let openCard = e.target.querySelector("i").classList[1];
        opencards.push(openCard);
        e.target.classList.add("open", "show");
      }
    });
  }

  /*
  *  if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
  */
  function matchedCards(){
    CARDSHOLDER.addEventListener("click", function(e){
      if(opencards.length >= 2 && opencards[0] === opencards[1]){
        for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
          if(card[i].classList.contains("open")) {
            setTimeout(function() {
              card[i].classList.add("match");
            }, 500);
          }
        }
        matches.push(opencards[0]);
        opencards =[]
      }
    });
    return (opencards, matches)
  }

  /*
  * if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
  */
  function notMatchedCards(){
    CARDSHOLDER.addEventListener("click", function(e){
      if(opencards.length >= 2 && opencards[0] !== opencards[1]){


        for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
          if(card[i].classList.contains("open") && !card[i].classList.contains("match")) {
            card[i].classList.add("error");
            setTimeout(function() {
              card[i].classList.remove("error", "open", "show");
            }, 800);
          }
        }
        opencards =[]

      }
    });
    return opencards;
  }

  /*
  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  */

  function winLose(h2text, ptext){
      const H2TAG = document.createElement("h2");
      const PTAG = document.createElement("p");
      const BUTTONTAG = document.createElement("button");
      const LITAG = document.createElement("li");
      const BUTTONTEXT = document.createTextNode("Play Again");
      const H2TEXT = document.createTextNode(h2text);
      const PTEXT = document.createTextNode(ptext);

      LITAG.classList.add("final");
      BUTTONTAG.append(BUTTONTEXT);
      H2TAG.append(H2TEXT);
      PTAG.append(PTEXT);

      CARDSHOLDER.innerHTML = "";
      CARDSHOLDER.append(LITAG);
      LITAG.append(H2TAG);
      LITAG.append(PTAG);
      LITAG.append(BUTTONTAG);
      refreshPage(CARDSHOLDER.querySelector(".final button"));
  }

  function moves() {
    let moves = 0;
    let stars = CONTAINER.querySelectorAll(".stars .fa-star");

    CARDSHOLDER.addEventListener("click", function(e){
      if (matches.length === CARDSYMBOLS.length) {
          winLose("Congratulations, you won!!!!", "With " + moves + " moves, time: " + TIMER.textContent  + "  and " + stars.length + " starts" );
      }
      if(e.target.classList.contains("card")) {
        moves += 1;
        if (moves === 26 || moves === 54) {
          stars[0].classList.remove("fa-star");
          stars[0].classList.add("fa-star-o");
          console.log(stars);
          stars = CONTAINER.querySelectorAll(".stars .fa-star");
          console.log(stars);
        }
        CONTAINER.querySelector(".moves").textContent = moves;
      }
    });
  }

  function refreshPage(arg) {
    arg.addEventListener("click", function(e){
      location.reload();
      e.preventDefault()
    });
  }

  function buildTimer () {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
          minutes = 0;
          seconds = 0;
      }
    }
    TIMER.textContent = (minutes < 10 ? "0" + minutes.toString(): minutes) + ":" + (seconds < 10 ? "0" + seconds.toString(): seconds);
    return TIMER;
  }

  function timer(){
    CARDSHOLDER.addEventListener("click", function(e){
      if (isActiveTimer  === false){
        isActiveTimer  = true;
      } else if (matches.length === CARDSYMBOLS.length){
        isActiveTimer  = false;
        clearTimeout(t);
      }
      if (isActiveTimer  === true){
        clearTimeout(t);
        t = setInterval(buildTimer,1000);
      }
    });
  }

  return {
    buildCards: buildCards(CARDSYMBOLS),
    open: openCards(),
    match: matchedCards(),
    notMatched: notMatchedCards(),
    moves: moves(),
    playAgain: refreshPage(CONTAINER.querySelector(".restart")),
    timer: timer()
  }
})();








/*
* Play instructions
*/
var playMemoryGame = {
  openCardsList: [],
  init: function(){
    /*
    * Object inicializer
    */

    CARDSHOLDER.addEventListener("click", function(e){
      if(e.target.classList.contains("card") && !e.target.classList.contains("open")){
        playMemoryGame.openCards(e);
        let cards = playMemoryGame.isAMatch(e);
        playMemoryGame.isNotAmMatch(e, cards);
      }
    }, false);
  },
  openCards: function(e){
    /*
    * add the card to a *list* of "open" cards
    * on click open cards
    */

    let openCard = e.target.querySelector("i").classList[1];
    playMemoryGame.openCardsList.push(openCard);
    e.target.classList.add("open", "show");
  },
  isAMatch: function(e){
    /*
    *  if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
    */
    let cards = CARDSHOLDER.querySelectorAll(".card");

    if(playMemoryGame.openCardsList.length % 2 === 0 && playMemoryGame.openCardsList[playMemoryGame.openCardsList.length - 1] === playMemoryGame.openCardsList[playMemoryGame.openCardsList.length - 2]){
      for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
        if(cards[i].classList.contains("open")) {
          setTimeout(function() {
            cards[i].classList.add("match");
          }, 500);
        }
      }
    }
    return cards;
  },
  isNotAmMatch: function(e, array){
    /*
    * if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
    */
    if(playMemoryGame.openCardsList.length % 2 === 0 && playMemoryGame.openCardsList[playMemoryGame.openCardsList.length - 1] !== playMemoryGame.openCardsList[playMemoryGame.openCardsList.length - 2]){

      for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
        if(array[i].classList.contains("open") && !array[i].classList.contains("match")) {
          array[i].classList.add("error");
          setTimeout(function() {
            array[i].classList.remove("error", "open", "show");
          }, 800);
        }
      }
      playMemoryGame.openCardsList.splice(-2,2);
    }
  }
}      /*
      *  increment the move counter and display it on the page
      */
    /*  seconds: 0,
      minutes: 0,
      t: "",
      isActiveTimer: false,
      buildTimer: function(e){
        timeCount.seconds++;
        console.log(this.seconds);
        if (timeCount.seconds >= 60) {
          timeCount.seconds = 0;
          timeCount.minutes++;
          if (timeCount.minutes >= 60) {
            timeCount.minutes = 0;
            timeCount.seconds = 0;
          }
        }
        CONTAINER.querySelector(".timer" = (timeCount.minutes < 10 ? "0" + timeCount.minutes.toString(): timeCount.minutes) + ":" + (timeCount.seconds < 10 ? "0" + timeCount.seconds.toString(): timeCount.seconds);
        return timeCount.timerHolder;
      },
       */

      init: function(){
        var arg1 = CARDSYMBOLS.length * 2;
        var arg2 = PlayMemoryGame.openCardsList.length;
        if (this.isActiveTimer  === false){
          this.isActiveTimer  = true;
        } else if (arg1 === arg2){
          this.isActiveTimer  = false;
          clearTimeout(t);
        }
        if (this.isActiveTimer  === true){
          clearTimeout(this.t);
          t = setInterval(this.buildTimer,1000);
        }
      }
