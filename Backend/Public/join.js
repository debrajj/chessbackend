const socket = io("http://localhost:3000/", { transports: ["websocket"] });
// const RegisterUserDataBase =
localStorage.getItem("name") || [];
// const username = sessionStorage.getItem("name");
let username
function getName(username) {
  Swal.fire({
    title: 'Enter Your Name',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter your name!';
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Store the name in a JavaScript variable
      username = result.value;
      console.log('Name:', username);
      socket.emit("username", username);
      // You can perform further actions with the name variable
    }
  });
}


console.log(username);
console.log(socket);


let namediv = document.getElementById("names");

socket.on("roomDetail", (detail) => {
  console.log(detail);

  namediv.innerHTML = "";

  detail.forEach((el) => {
    let player = document.createElement("h3");
    player.innerHTML = el.name;
    namediv.append(player);

    player.addEventListener("click", () => {
      sendrequest(el);
    });
  });
});

let notidiv = document.getElementById("notification");

function sendrequest(el) {
  socket.emit("sendJoinRequest", el);
  alert("request has been sent");
}

socket.on("joinRequestRecieved", (userData) => {
  notidiv.innerHTML = "";
  let notification = document.createElement("p");
  let joinbutton = document.createElement("button");
  notification.innerText = `Recieved a game request from ${userData.name}`;

  joinbutton.innerText = "join";
  joinbutton.classList.add("joinbutton");

  joinbutton.addEventListener("click", () => {
    acceptrequest(userData);
  });
  notidiv.append(notification, joinbutton);
});

function acceptrequest(userData) {
  let room = userData.room;
  socket.emit("acceptGameRequest", room);

  notidiv.innerHTML = "";
  alert("Please wait for game initialize from host");
}

socket.on("gameRequestAccepted", (userData) => {
  notidiv.innerHTML = "";
  let sentnote = document.createElement("p");
  sentnote.innerText = `Game request accepted from ${userData.name}`;

  let choicediv = document.createElement("div");
  let choice_text = document.createElement("p");
  choice_text.innerHTML =
    'choose rotetion Choose rotation. <button data-room="' +
    userData.room +
    '" data-color="black" type="button" class="btn btn-primary btn-sm setOrientation">Black</button> or <button data-room="' +
    userData.room +
    '" data-color="white" type="button" class="btn btn-primary btn-sm setOrientation">White</button>';

  choicediv.append(choice_text);

  notidiv.append(sentnote, choicediv);
});

// code added by vamshi
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

// text.addEventListener("keydown", (e) => {
//   if (e.key === "Enter" && text.value.length !== 0) {
//     socket.emit("message", text.value);
//     text.value = "";
//   }
// });

// document.addEventListener("click", (e) => {
//   if (e.target !== send && e.target !== text) {
//     e.preventDefault();
//   }
// });
getName(username);
socket.on("createMessage", (message, username) => {
  var time = new Date();
  let cur_time = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  
  // let currentUser = RegisterUserDataBase.find(
  //   (user) => user.email === userName
  // );
  // let displayName = currentUser ? currentUser.name : userName;

  messages.innerHTML += `<div class="message">
  <span  ${true === true ? "class=outgoing" : "class=incoming"
}>${message}  <span class="time">   (From ${username} ${cur_time}) <span></span>
</div>`;

});
