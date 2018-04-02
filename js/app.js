/*
@description: memory Game dynamically generated
@param: Requires a {elem.container > ul.deck} HTML element
@param: .timer // timer placeholder
@param: .restart // refresh page placeholder
@param: .moves // placeholder to record the player's moves
@param: .stars .fa-star //manipulas the stars
*/
var MemoryGame = (function(){
  /*
  * shared variables
  */
  const CARDSYMBOLS = ["fa-diamond", "fa-paper-plane-o","fa-anchor", "fa-bolt","fa-cube","fa-leaf","fa-bicycle", "fa-bomb"];
  const CONTAINER =  document.querySelector(".container");
  const CARDSHOLDER = CONTAINER.querySelector(".deck");

  var BuildMemoryGame = {
    /*
    * Object purpose: Create cards for the game and add the outcome to the Dom;
    */
    shuffle: function(array) {
      // Shuffle function from http://stackoverflow.com/a/2450976

      var currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    shuffleCards: function(array){
      /*
      * converts the array of symbols into pairs
      * shuffle pairs of symbols and return the result
      */
      let doubleArray = array.concat(array);

      return this.shuffle(doubleArray);
    },
    init: function(){
      /*
      * uses the shuffleCards to dynamically create the cards for the game and add them to the DOM
      */
      let shuffledSymbols = this.shuffleCards(CARDSYMBOLS);
      const fragment = document.createDocumentFragment();

      for ( let i = 0; i < shuffledSymbols.length; i++) {
        const ITAG = document.createElement("i");
        const LITAG = document.createElement("li");

        ITAG.classList.add("fa", shuffledSymbols[i]);
        LITAG.classList.add("card");

        LITAG.append(ITAG);
        fragment.append(LITAG);
      }

      CARDSHOLDER.append(fragment);
     }
  };

  var GameManager = {
    init: function(){
      /*
      * @description:
      * handle all games interaction
      * manipulate the PlayMemoryGame object
      * manipulate the GameResults object
      */

      /*
      * @returns:: restart game functionality
      */
      refreshPage(CONTAINER.querySelector(".restart"));

      CARDSHOLDER.addEventListener("click", function(e){
        if(e.target.classList.contains("card") && !e.target.classList.contains("open")){
          // @returns: all cards in the game
          let cards = CARDSHOLDER.querySelectorAll(".card");
          // @returns: list of opened cards
          let openCards = PlayMemoryGame.openCards(e);
          // @returns: total number of opened cards
          GameResults.movesUpdates();
          // @returns: remaining starts
          GameResults.stars();

          if(openCards.length % 2 === 0){
            if(openCards[openCards.length -1] === openCards[openCards.length -2]){
              PlayMemoryGame.isAMatch(cards);
            } else {
              PlayMemoryGame.isNotAmMatch(cards);
            }
          }

          /*
          * @description: timer start/stop control
          */
          if(CARDSYMBOLS.length * 2 === openCards.length) {
            timeCount.stopTimer();
            GameResults.congratulations();
          } else {
            timeCount.updateTimer();
          }
        }
      }, false);
    }
  };

  var PlayMemoryGame = {
    /*
    *  Object purpose: handle the player's interactions
    */
    openCardsList: [],
    openCards: function(e){
      /*
      * add the card to a *list* of "open" cards
      * on click open cards
      */
      let openCard = e.target.querySelector("i").classList[1];
      this.openCardsList.push(openCard);
      e.target.classList.add("open", "show");
      return this.openCardsList;
    },
    isAMatch: function(cards){
      /*
      * handles interaction if the open cards match
      */
      for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
        if(cards[i].classList.contains("open")) {
          setTimeout(function() {
            cards[i].classList.add("match");
          }, 500);
        }
      }
    },
    isNotAmMatch: function(cards){
      /*
      * handles interaction if the open cards do not match
      */
      for(let i = 0; i < CARDSYMBOLS.length * 2; i++){
        if(cards[i].classList.contains("open") && !cards[i].classList.contains("match")) {
          cards[i].classList.add("error");
          setTimeout(function() {
            cards[i].classList.remove("error", "open", "show");
          }, 800);
        }
      }

      this.openCardsList.splice(-2,2);
    }
  };

  var GameResults = {
    /*
    * @description:
    * handle users performance
    * generate starts points
    * generates total moves scores
    */
    moves: 0,
    starsTotal: 0,
    CongratulationsBuilder: function(h2text, ptext){
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
    },
    movesUpdates: function(){
      this.moves += 1;

      CONTAINER.querySelector(".moves").textContent = this.moves;

      return this.moves;
    },
    stars: function(){
      let stars = CONTAINER.querySelectorAll(".stars .fa-star");
      if (this.moves === 26 || this.moves === 40) {
        stars[0].classList.remove("fa-star");
        stars[0].classList.add("fa-star-o");
        stars = CONTAINER.querySelectorAll(".stars .fa-star");
        this.starsTotal = stars.length;
        return this.starsTotal;
      }
    },
    congratulations: function(){
      this.CongratulationsBuilder("Congratulations, you won!!!!", "With " + this.moves + " moves, and " + this.starsTotal + " starts. You time was: " + CONTAINER.querySelector(".timer").textContent);
    }
  };

  /* timer */
  var timeCount = {
    time: "00:00",
    seconds: 0,
    minutes: 0,
    timeBuilder: function(){
      let timeHolder;
      timeCount.seconds++;
      if (timeCount.seconds >= 60) {
        timeCount.seconds = 0;
        timeCount.minutes++;
        if (timeCount.minutes >= 60) {
          timeCount.minutes = 0;
          timeCount.seconds = 0;
        }
      }
      timeHolder = (timeCount.minutes < 10 ? "0" + timeCount.minutes.toString(): timeCount.minutes) + ":" + (timeCount.seconds < 10 ? "0" + timeCount.seconds.toString(): timeCount.seconds);
      CONTAINER.querySelector(".timer").textContent = timeHolder;
    },
    updateTimer: function(){
      clearTimeout(this.time);
      this.time = setInterval(this.timeBuilder,1000);
    },
    stopTimer: function(){
      clearTimeout(this.time);
    }
  };

  /*
  * @description: Restart the game function
  */
  var refreshPage = function(arg) {
    arg.addEventListener("click", function(e){
      location.reload();
      e.preventDefault();
    });
  };

  /*
  * @description: Game initializer
  */
  return {
    buildCards: BuildMemoryGame.init(CARDSYMBOLS),
    gamaeManager: GameManager.init()
  };
})();
