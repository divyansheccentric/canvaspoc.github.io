requestAnimationFrame(mainLoop);
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const storedRects = [];
// const baseImage = loadImage("https://www.w3schools.com/css/img_fjords.jpg");
var refresh = true;
const rect = (() => {
  var x1, y1, x2, y2;
  var show = false;
  function fix() {
    rect.x = Math.min(x1, x2);
    rect.y = Math.min(y1, y2);
    rect.w = Math.max(x1, x2) - Math.min(x1, x2);
    rect.h = Math.max(y1, y2) - Math.min(y1, y2);
  }
  function draw(ctx) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "cyan";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  const rect = { x: 0, y: 0, w: 0, h: 0, draw };
  const API = {
    restart(point) {
      x2 = x1 = point.x;
      y2 = y1 = point.y;
      fix();
      show = true;
    },
    update(point) {
      x2 = point.x;
      y2 = point.y;
      fix();
      show = true;
    },
    toRect() {
      show = false;
      return Object.assign({}, rect);
    },
    draw(ctx) {
      if (show) {
        rect.draw(ctx);
      }
    },
    show: false
  };
  return API;
})();

const mouse = {
  button: false,
  x: 0,
  y: 0,
  down: false,
  up: false,
  element: null,
  event(e) {
    const m = mouse;
    m.bounds = m.element.getBoundingClientRect();
    m.x = e.pageX - m.bounds.left;
    m.y = e.pageY - m.bounds.top;
    if (e.type === "mousedown") {
      m.down = true;
      m.button = true;
    }
    if (e.type === "mouseup") {
      m.up = true;
      m.button = false;
    }
  },
  start(element) {
    mouse.element = element;
    "down,up,move"
      .split(",")
      .forEach(name => document.addEventListener("mouse" + name, mouse.event));
  }
};
mouse.start(canvas);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "cyan";
  storedRects.forEach(rect => rect.draw(ctx));
  const img_h = 40;
  const img_w = 40;
  if (storedRects.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.drawImage(
      renderImage,
      storedRects[0].x + storedRects[0].w / 2 - img_h / 2,
      storedRects[0].y + storedRects[0].h / 2 - img_w / 2,
      img_h,
      img_w
    );
  }
  rect.draw(ctx);
}
let renderImage;
function loadImage(url) {
  const image = new Image();
  image.src = url;
  renderImage = image;
}

loadImage(
  "https://cdn1.iconfinder.com/data/icons/human-body-parts-1-3/100/a-03-512.png"
);

function mainLoop() {
  if (refresh || mouse.down || mouse.up || mouse.button) {
    refresh = false;
    if (mouse.down) {
      console.log(storedRects);
      storedRects.pop();
      mouse.down = false;
      rect.restart(mouse);
    } else if (mouse.button) {
      rect.update(mouse);
    } else if (mouse.up) {
      mouse.up = false;
      console.log();
      rect.update(mouse);
      storedRects.push(rect.toRect());
    }
    draw();
  }
  requestAnimationFrame(mainLoop);
}
