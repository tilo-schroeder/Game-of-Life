//TODO: Resolution Slider implementieren, ggf. Speichermöglichkeit und Presets

function togglePause() {
    if(!paused) {
        paused = true;
        document.getElementById("pauseBtn").innerHTML = "Start";
    } else if (paused) {
        paused = false;
        document.getElementById("pauseBtn").innerHTML = "Stop";
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for(let i=0; i<arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            let col = (x+i+cols) % cols;
            let row = (y+j+rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function initField(grid) {
    for(let i=0; i<cols; i++) {
        for(let j=0; j<rows; j++) {
            grid[i][j] = 0;//Math.floor(Math.random() * 2);
        }
    }
}

//let resolutionSlider = document.getElementById("resolution");

let paused;
let grid;
let cols;
let rows;
let resolution = 20;

function init() {
    window.requestAnimationFrame(draw);
    cols = canvas.clientWidth / resolution;
    rows = canvas.clientHeight / resolution;
    paused = true;
    document.getElementById("pauseBtn").innerHTML = "Start";

    grid = make2DArray(cols, rows);
    initField(grid);
}

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight); // clear canvas

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'lightgrey';

    let s = resolution
    let pL = 0
    let pT = 0
    let pR = 0
    let pB = 0
    
    ctx.beginPath()
    for (var x = pL; x <= canvas.clientWidth - pR; x += s) {
        ctx.moveTo(x, pT)
        ctx.lineTo(x, canvas.clientHeight - pB)
    }
    for (var y = pT; y <= canvas.clientHeight - pB; y += s) {
        ctx.moveTo(pL, y)
        ctx.lineTo(canvas.clientWidth - pR, y)
    }
   ctx.stroke()

    for(let i=0; i < cols; i++) {
        for(let j=0; j < rows; j++) {
            let x = i*resolution;
            let y = j*resolution;
            if(grid[i][j] == 1) {
                ctx.beginPath();
                ctx.fillRect(x, y, resolution-1, resolution-1);
                ctx.stroke();
                ctx.save();
            }
        }
    }

    if(!paused) {
        let next = make2DArray(cols,rows);

        for(let i=0; i < cols; i++) {
            for(let j=0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = countNeighbors(grid, i, j);

                if(state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                } else if(state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }

        grid = next;
    }

    window.requestAnimationFrame(draw);
}

init();

//setInterval(draw, 50);
let pauseButton = document.getElementById("pauseBtn");

pauseButton.addEventListener("click", function() {
    togglePause();
});

let resetButton = document.getElementById("resetBtn");

resetButton.addEventListener("click", function() {
    init();
    if(!paused) {
        paused = true;
    }
});

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, 
                "Coordinate y: " + y);

    let position_x = Math.floor(x / resolution);
    let position_y = Math.floor(y / resolution);
    
    if(grid[position_x][position_y] == 0) {
        grid[position_x][position_y] = 1;
    } else if(grid[position_x][position_y] == 1) {
        grid[position_x][position_y] = 0;
    }
    
}

canvas.addEventListener("mousedown", function(e) {
    getMousePosition(canvas, e);
});


/*Awesome Pattern

grid[midX][midY] = 1;
    grid[midX +1][midY] = 1;
    grid[midX -1][midY] = 1;
    grid[midX][midY +1] = 1;
    grid[midX][midY -1] = 1;

    grid[midX +6][midY] = 1;
    grid[midX +6+1][midY] = 1;
    grid[midX +6-1][midY] = 1;
    grid[midX +6][midY +1] = 1;
    grid[midX +6][midY -1] = 1;

    grid[midX +3][midY+6] = 1;
    grid[midX +3+1][midY+6] = 1;
    grid[midX +3-1][midY+6] = 1;
    grid[midX +3][midY +6+1] = 1;
    grid[midX +3][midY +6-1] = 1;


*/