const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
// const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");

const findOpp  = document.querySelector("#find_opp");
findOpp.addEventListener("click", () => {
  prompt(
    "Copy this link and send it to people you want to play with",
    window.location.href
  );
});




myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

// showChat.addEventListener("click", () => {
//   document.querySelector(".main__right").style.display = "flex";
//   document.querySelector(".main__right").style.flex = "1";
//   document.querySelector(".main__left").style.display = "none";
//   document.querySelector(".header__back").style.display = "block";
// });

const user = prompt("Enter your name");

var peer = new Peer({
  host: '127.0.0.1',
  port: 3030,
  path: '/peerjs',
  config: {
    'iceServers': [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      }
    ]
  },

  debug: 3
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log('someone call me');
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

// inviteButton.addEventListener("click", (e) => {
//   prompt(
//     "Copy this link and send it to people you want to meet with",
//     window.location.href
//   );
// });

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b ><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
    }</span> </b>
        <span ${userName===user ? "class=outgoing" 
       : "class=incoming"}>${message}</span>
    </div>`;
});



myTurn = true, symbol;

// One of the rows must be equal to either of these
// value for
// the game to be over
var matches = ['XXX', 'OOO'];


function getBoardState() {
    var obj = {};

    // We will compose an object of all of the Xs and Ox
    // that are on the board into an array of cells 
    // Every cell contains either 'X', 'O' or ''
    $('.cell').each(function () {
        obj[$(this).attr('id')] = $(this).text() || '';
    });

    console.log("state: ", obj);
    return obj;
}

function isGameOver() {
    var state = getBoardState();
    console.log("Board State: ", state);

    // These are all of the possible combinations
    // that would win the game
    var rows = [
        state.a0 + state.a1 + state.a2,
        state.b0 + state.b1 + state.b2,
        state.c0 + state.c1 + state.c2,
        state.a0 + state.b1 + state.c2,
        state.a2 + state.b1 + state.c0,
        state.a0 + state.b0 + state.c0,
        state.a1 + state.b1 + state.c1,
        state.a2 + state.b2 + state.c2
    ];

    // Loop over all of the rows and check if any of them compare
    // to either 'XXX' or 'OOO'
    for (var i = 0; i < rows.length; i++) {
        if (rows[i] === matches[0] || rows[i] === matches[1]) {
            return true;
        }
    }
    return false;
}

function renderTurnMessage() {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
        $('#messages').text('Your opponent\'s turn');
        //$('.board button').attr('disabled', true);
        $('.cell').attr('disabled', true);

        // Enable the board if it is your turn
    } else {
        $('#messages').text('Your turn.');
        //$('.board button').removeAttr('disabled');
        $('.cell').removeAttr('disabled');

    }
}

function makeMove(e) {
    e.preventDefault();
    // It's not your turn
    if (!myTurn) {
        return;
    }

    // The space is already checked
    if ($(this).text().length) {
        return;
    }

    // Emit the move to the server
    socket.emit('make.move', {
        symbol: symbol,
        position: $(this).attr('id')
        
    });
    

}

// Event is called when either player makes a move
socket.on('move.made', function (data) {
    // Render the move, data.position holds the target cell ID
    $('#' + data.position).text(data.symbol);

    // If the symbol is the same as the player's symbol,
    // we can assume it is their turn
    myTurn = (data.symbol !== symbol);

    // If the game is still going, show who's turn it is
    if (!isGameOver()) {
        return renderTurnMessage();
    }

    // If the game is over Show the message for the loser
    if (myTurn) {
        $('#messages').text('Game over. You lost.');
        // Show the message for the winner
    } else {
        $('#messages').text('Game over. You won!');
    }

    // Disable the board
    //$('.board button').attr('disabled', true);
    $('.cell').attr('disabled', true);
});

// Set up the initial state when the game begins
// This method is called from the server
socket.on('game.begin', function (data) {
    // The server will asign X or O to the player
    $("#symbol").html(data.symbol);  // Show the players symbol
    symbol = data.symbol;
    console.log(symbol)
    // Give X the first turn
    myTurn = (data.symbol === 'X');
    renderTurnMessage();
});

// Disable the board if the opponent leaves
socket.on('opponent.left', function () {
    $('#messages').text('Your opponent left the game.');
    //$('.board button').attr('disabled', true);
    $('.cell').attr('disabled', true);
});

$(function () {
    $('.board button').attr('disabled', true);
    //$('.board > button').on('click', makeMove);
    $(".cell").on("click", makeMove);
});
