// const playername1 = "vaibhav";
// const playername2 = "vibhav";

// const player1 = {
//   name: "vaibhav",
//   age: 31,
// };

// const player2 = {
//   name: "vibhav",
//   age: 45,
// };

function player(name, age) {
  (this.age = age),
    (this.name = name),
    (this.sayName = function () {
      console.log(name);
    });
}

const Player1 = new player("keshav", 13);

// console.log(player1);
// console.log(playername2);
// console.log(playername1);

function gameover(player) {
  console.log("congratulations!!!");
  console.log(player.name + " is the winner");
}

gameover(Player1);
Player1.sayName();
