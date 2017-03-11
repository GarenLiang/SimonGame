
//--------------------------
// Menu
//--------------------------
(function() {
var menu = {
  cacheDom: function() {
    this.$click = $('.hambclicker');
    this.$menuIcon = $('#hambmenu');
    this.$menu = $('.menu');
  },
  init: function() {
    this.cacheDom();
    this.bindEvents();
  },
  bindEvents: function() {
    this.$click.on('click', this.isOpen.bind(this));
  },
  isOpen: function() {
    this.$menuIcon.toggleClass('open');
    this.$menu.toggleClass("isopen");
    }
  };
  menu.init();
})();
//--------------------------
// Ready
//--------------------------
$(document).ready(function(){
    game.init();
    $('.restart > button').addClass('disabled');
});

//--------------------------
// Game Setup
//--------------------------
  var game = {
      sequence: [],
      isOn: false,
      counter: 0,
      mode: 'normal',
      init: function() {
        this.cacheDom();
        this.bindEvents();
        this.$counter.text('--');
      },
      cacheDom: function() {
        this.$button = $('.game > .button');
        this.$counter = $('#display');
        this.$power = $('.turnon');
        this.$reset= $('.restart > button');
        this.$strict = $('.strict > i');
      },
      bindEvents: function() {
        this.$power.on('click', this.turnOn.bind(this));
        this.$reset.on('click', this.reset.bind(this));
        this.$strict.on('click', this.changeMode.bind(this));
      },
      render: function() {
        this.$counter.text(this.counter);
      },
      playSound: function(id) {
      switch(id){
          case '1': this.sounds.sound1.play(); break;
          case '2': this.sounds.sound2.play(); break;
          case '3': this.sounds.sound3.play(); break;
          case '4': this.sounds.sound4.play(); break;
        }
      },
        sounds: {
          sound1: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
          sound2: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
          sound3: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
          sound4: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
        },
        litButtons: function(id) {
          $('#b' + id).addClass('lit');
          var blink = setTimeout(function() {
              $('#b' + id).removeClass('lit');
          }, 300);
        },
      turnOn: function() {
        if (!this.isOn) {
          this.$power.css('background', 'green');
          this.isOn = true;
          this.$button.addClass('disabled');
          this.$reset.removeClass('disabled');
          this.render();
          this.changeState('simonsTurn');
        } else {this.$power.css('background', '#d72638');
                    console.log('OFF');
                    this.$button.addClass('disabled');
                    this.$reset.addClass('disabled');
                    this.isOn = false;
                    this.$counter.text('--');
                    this.sequence = [];
                    this.counter = 0;
                    this.$counter.text('--');
                }
      },
      reset: function() {
        this.$counter.text('--');
        this.sequence = [];
        this.counter = 0;
        this.changeState();
      },
      changeState: function(turn) {
        if(turn === 'playersTurn') {

          player.init();
        } else {game.$button.addClass('disabled');
                    simon.addStep();
                  }
      },
      changeMode: function() {
        if(this.$strict.hasClass('fa-circle-o')) {
        this.$strict.removeClass('fa-circle-o').addClass('fa-check-circle-o');
        this.$strict.css('color', 'green');
        this.mode = 'strict';
      } else {
        this.$strict.removeClass('fa-check-circle-o').addClass('fa-circle-o');
        this.$strict.css('color', '#333333');
        this.mode = 'normal';
      }
      },
      loss: function() {
        this.$counter.text('!!');
        this.$counter.fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
        setTimeout(function() {
          game.reset();
        }, 1500);
      },

      win: function() {
        this.$counter.text('win');
        this.$counter.fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
      },
      timer: function(seq) {
        var speed = [1000, 800, 600, 400];
        if (seq < 5) {
          return speed[0];
        }
        if (seq < 10) {
          return speed[1];
        }
        if (seq < 15) {
          return speed[2];
        }
        if (seq < 20) {
          return speed[3];
        }
      },

  };

//--------------------------
// Simon
//--------------------------
var simon = {
  addStep: function() {
    game.sequence.push((Math.floor(Math.random()*4))+1);
    game.counter++;
    console.log('sequence ' + game.sequence);
    this.playStep();
  },
  playStep: function() {
    clearInterval(playSeq);
    game.render();
    var i = 0;
    var playSeq = setInterval(function(){
      var step = game.sequence[i].toString();
      game.playSound(step);
      game.litButtons(game.sequence[i]);
      if((i+1) === game.sequence.length) {
        clearInterval(playSeq);
        game.changeState('playersTurn');
      } else {
        i++;
      }
    }, game.timer(game.sequence.length));
  }
};
//--------------------------
// Player
//--------------------------
var player = {
  currAnswer: 0,
  init: function() {
    game.$button.removeClass('disabled');
    this.bindEvents();
    this.currAnswer = 0;
  },
  bindEvents: function() {
    $('.game > .button').unbind('click').on('click', this.playerClick.bind(this));
  },
  playerClick: function(e){
      var $clicked = ($(e.target).attr('id')).slice(1);
      game.playSound($clicked);
      game.litButtons($clicked);
      if($clicked==game.sequence[this.currAnswer]) {
        this.currAnswer++;
        if((this.currAnswer+1)>game.sequence.length && game.sequence.length < 20) {
          setTimeout(function() {
            game.changeState('simonsTurn');
          }, 500);
        }
        else if ((this.currAnswer+1)>game.sequence.length && game.sequence.length === 20) {
          game.win();
        }
      } else {
          if (game.mode === 'normal') {
            game.$counter.text('!!');
            game.$counter.fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
            setTimeout(function() {
              simon.playStep();
            }, 1500);
          }
          else {game.loss();}
      }
  }
};
