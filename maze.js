const mazeSize = 31;
let playerPosition = [1, 1];
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let maze = Array(mazeSize)
  .fill(0)
  .map((line, index) => {
    if (index % 2 === 0) {
      return Array(mazeSize).fill("#");
    }
    return Array(mazeSize)
      .fill(0)
      .map((col, index) => {
        return index % 2 === 0 ? "#" : " ";
      });
  });

function getNeighbors(node) {
  return [
    [node[0], node[1] + 2],
    [node[0] + 2, node[1]],
    [node[0] - 2, node[1]],
    [node[0], node[1] - 2],
  ].filter(
    (neighbor) =>
      neighbor[0] > 0 &&
      neighbor[0] < maze.length - 1 &&
      neighbor[1] > 0 &&
      neighbor[1] < maze.length - 1
  );
}

function getWall(node1, node2) {
  //Math.abs(node1[0]-node2[0])/2
  if (node1[0] === node2[0]) {
    return [node1[0], node2[1] > node1[1] ? node1[1] + 1 : node2[1] + 1];
  }
  return [node1[0] > node2[0] ? node2[0] + 1 : node1[0] + 1, node1[1]];
}

function testGetNeighbors() {
  maze.map((line, i) =>
    line.map((val, j) => {
      return console.log(getNeighbors([i, j]));
    })
  );
}

function generateMaze(currentNode) {
  maze[currentNode[0]][currentNode[1]] = 1; //a voir
  while (
    getNeighbors(currentNode).filter((node) => maze[node[0]][node[1]] === " ")
      .length !== 0
  ) {
    let potentialNeighbors = getNeighbors(currentNode).filter(
      (node) => maze[node[0]][node[1]] === " "
    );
    let randomIndex = Math.floor(Math.random() * potentialNeighbors.length);
    deletedWall = getWall(currentNode, potentialNeighbors[randomIndex]);
    maze[deletedWall[0]][deletedWall[1]] = " ";
    maze[potentialNeighbors[randomIndex]] = 1;
    generateMaze(potentialNeighbors[randomIndex]);
  }
}

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    10 + 20 * playerPosition[1],
    10 + 20 * playerPosition[0],
    9,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();
}

function clearPlayer() {
  ctx.clearRect(playerPosition[1] * 20, playerPosition[0] * 20, 20, 20);
  //ctx.clearRect(0, 0, 100, 100);
}

function movePlayer(direction) {
  switch (direction) {
    case "ArrowUp":
      if (maze[playerPosition[0] - 1][playerPosition[1]] !== "#") {
        playerPosition[0] -= 1;
      }
      break;
    case "ArrowDown":
      if (maze[playerPosition[0] + 1][playerPosition[1]] !== "#") {
        playerPosition[0] += 1;
      }
      break;
    case "ArrowLeft":
      if (maze[playerPosition[0]][playerPosition[1] - 1] !== "#") {
        playerPosition[1] -= 1;
      }
      break;
    case "ArrowRight":
      if (maze[playerPosition[0]][playerPosition[1] + 1] !== "#") {
        playerPosition[1] += 1;
      }
      break;
    default:
  }
}

document.addEventListener("keydown", logKey);

function logKey(e) {
  console.log(e.key);
  clearPlayer();
  movePlayer(e.key);
  drawPlayer();
}

function drawMaze() {
  ctx.canvas.width = 800;
  ctx.canvas.height = 800;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 800, 800);
  maze.forEach((line, i) => {
    line.forEach((val, j) => {
      if (val === "#") {
        ctx.fillStyle = "black";
        ctx.fillRect(20 * j, 20 * i, 20, 20);
      }
    });
  });
}

//let start = new Node([1, 1]);

generateMaze([1, 1]);
drawMaze();
drawPlayer();
