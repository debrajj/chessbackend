var board;
var game;

let roomidd;
socket.on("ooproom", (data) => {
  roomidd = data;
  console.log("------------" + data);
})

window.onload = function () {
  initGame();
};

var initGame = function () {

  var cfg = {
    draggable: true,
    showNotation: false,
    position: 'start',
    moveSpeed: 'slow',
    snapbackSpeed: 500,
    snapSpeed: 100,
    onDragStart: onDragStart,
    onDrop: handleMove,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  };
  board = new ChessBoard('myBoard', cfg);
  game = new Chess();

};

var handleMove = function (source, target) {
  var move = game.move({ from: source, to: target });
  if (move === null) return 'snapback';
};

// var socket = io();

// window.onclick = function (e) {
//   socket.emit('message', 'I am client');
// };

var handleMove = function (source, target) {
  var move = game.move({ from: source, to: target });

  if (move === null) return 'snapback';
  else socket.emit('move', {
    room: roomidd,
    // color: turn, 
    from: move.from,
    to: move.to,
    piece: move.piece

  });


  /////saurav   
  //   socket.emit('chessMove', {
  //           room: roomidd,
  //           // color: turn, 
  //           from: move.from, 
  //           to: move.to,
  //           piece: move.piece





  //  });    
};


socket.on('move', function (msg) {
  game.move(msg);
  board.position(game.fen());
});


var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart(source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

function onSnapEnd() {
  board.position(game.fen())
}







/////////////////experiment

$(document).on('click', '.setOrientation', function () {

  roomidd = $(this).data('room')


  let notidiv=document.getElementById("notification");
  notidiv.innerHTML="";

  roomidd=$(this).data('room')
        

  socket.emit('setOrientation', {
    room: $(this).data('room'),
    color: ($(this).data('color') === 'black') ? 'white' : 'black'
  });

  board.orientation($(this).data('color'));
  board.start();
  if ($(this).data('color') == 'black') {
    $('.notification')
      .html('<div class="alert alert-success">Great ! Let\'s start game. You choose Black. Wait for White Move.</div>');
  } else {
    $('.notification')
      .html('<div class="alert alert-success">Great ! Let\'s start game. You choose White. Start with First Move.</div>');
  }
});


socket.on('setOrientationOppnt', (requestData) => {
  console.log("abc" + requestData);
  board.orientation(requestData.color);
  board.start();
  $('#onlinePlayers li#' + requestData.id).addClass('active');
  if (requestData.color == 'white') {
    $('.notification')
      .html('<div class="alert alert-success">Game is initialized by <strong>' + requestData.name + '</strong>. Let\'s start with First Move.</div>');
  } else {
    $('.notification')
      .html('<div class="alert alert-success">Game is initialized by <strong>' + requestData.name + '</strong>. Wait for White Move.</div>');
  }

});






socket.on('oppntChessMove', (requestData) => {
  // console.log(requestData);
  // let color = requestData.color;
  let source = requestData.from;
  let target = requestData.to;
  let promo = requestData.promo || '';


  game.move({ from: source, to: target, promotion: promo });
  board.position(game.fen());
  //chess.move(target);
  //chess.setFenPosition();

});

$('#ruyLopezBtn').on('click', function () {
  board.position('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R')
})
$('#clearBoardBtn').on('click', () => {
  board.clear(false)
})
$('#startBtn').on('click', initGame)