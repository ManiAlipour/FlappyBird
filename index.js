var cvs = document.getElementById("myCanvas");
var ctx = cvs.getContext("2d");

var DEGREE = Math.PI / 180;
var sprite = new Image();
sprite.src = "./img/sprite.png";
var frame = 0;

var SCORE = new Audio()
SCORE.src = './score.wav'

var FLAP = new Audio()
FLAP.src = './flap.wav'

var HIT = new Audio()
HIT.src = '/hit.wav'

var START = new Audio()
START.src = './start.wav'

var DIE = new Audio()
DIE.src = './die.wav'


var state = {
  curent: 0,
  gameReady: 0,
  game: 1,
  gameOver: 2,
};

var bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};
var fg = {
  sX: 276,
  sY: 0,
  dx: 1.5,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.curent == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};
var bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  w: 34,
  h: 26,
  speed: 0,
  gravity: 0.15,
  x: 50,
  y: 150,
  radius: 12,
  rotate: 0,
  animationIndex: 0,
  jump: 4.6,

  draw: function () {
    let bird = this.animation[this.animationIndex];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotate);

    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      0,
      0,
      this.w,
      this.h
    );
    ctx.restore();
  },
  update: function () {
    var period = state.curent == state.gameReady ? 10 : 5;
    this.animationIndex += frame % period == 0 ? 1 : 0;
    if (state.curent == state.gameReady) {
      this.y = 150;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.speed < this.jump) {
        this.rotate = -25 * DEGREE;
      } else {
        this.rotate = 90 * DEGREE;
      }
    }
    if (this.y + this.h / 2 >= cvs.height - fg.h) {
      this.y = cvs.height - fg.h - this.h;
      this.animationIndex = 1;
      if (state.curent == state.game) {
        DIE.play()
        state.curent = state.gameOver;
      }
    }
    this.animationIndex = this.animationIndex % this.animation.length;
  },
  flap: function () {
    this.speed = -this.jump;
  },
};

var getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    if (state.curent == state.gameReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

var gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 80,
  draw: function () {
    if (state.curent == state.gameOver) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

function clickHandler() {
  switch (state.curent) {
    case state.gameReady:
      START.play()
      state.curent = state.game;
      break;
    case state.game:
      FLAP.play()
      bird.flap();
      break;
    case state.gameOver:
      state.curent = state.gameReady;
      bird.speed = 0;
      pipes.position = [];
      score.score = 0;
      bird.rotate = 0;
      break;
  }
}

var pipes = {
  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },
  w: 53,
  h: 400,
  dx: 1.5,
  gap: 120,
  position: [],
  maxYPosition: -150,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPosition = p.y;
      let bottomYPosition = p.y + this.h + this.gap;
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPosition,
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPosition,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.curent != state.game) return;
    if (frame % 150 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPosition * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.score += 1;
        SCORE.play();
        score.hightScore = Math.max(score.score, score.hightScore);
        localStorage.getItem("hightScore", score.hightScore);
      }
      let bottomPipesPos = p.y + this.h + this.gap;
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        HIT.play()
        state.curent = state.gameOver;
      }
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipesPos &&
        bird.y - bird.radius < bottomPipesPos + this.h
      ) {
        HIT.play()
        state.curent = state.gameOver;
      }
    }
  },
};

var score = {
  hightScore: parseInt(localStorage.getItem("hightScore")) || 0,
  score: 0,
  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    if (state.curent == state.game) {
      ctx.linewidth = 2;
      ctx.font = "35px IMPACT";
      ctx.fillText(this.score, cvs.width / 2 - 10, 50);
      ctx.strokeText(this.score, cvs.width / 2 - 10, 50);
    } else if (state.curent == state.gameOver) {
      ctx.linewidth = 2;
      ctx.font = "35px IMPACT";
      ctx.fillText(this.score, 225, 180);
      ctx.strokeText(this.score, 225, 180);

      ctx.fillText(this.hightScore, 225, 228);
      ctx.strokeText(this.hightScore, 225, 228);
    }
  },
};

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", function (e) {
  if (e.which == 32) {
    clickHandler();
  }
});

function update() {
  pipes.update();
  bird.update();
  fg.update();
}

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function anime() {
  update();
  draw();
  frame++;
  requestAnimationFrame(anime);
}
anime();
