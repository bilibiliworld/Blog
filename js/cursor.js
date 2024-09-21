function init() {
	// 创建一个 div 元素
	var div = document.createElement('div');
	div.className = 'curzr-arrow-pointer';
	div.hidden = true;  // 根据需要，这里可以设置为 false 来显示元素
	// 设置 div 的内部 HTML
	div.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
	<path class="inner" d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" fill="#F2F5F8" />
	<path class="outer" d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z" fill="#111920" />
  </svg>
`;
	// 将 div 添加到 body 的末尾
	document.body.appendChild(div);
	class ArrowPointer {
		constructor() {
			this.root = document.body
			this.cursor = document.querySelector(".curzr-arrow-pointer")

			this.position = {
				distanceX: 0,
				distanceY: 0,
				distance: 0,
				pointerX: 0,
				pointerY: 0,
			},
				this.previousPointerX = 0
			this.previousPointerY = 0
			this.angle = 0
			this.previousAngle = 0
			this.angleDisplace = 0
			this.degrees = 57.296
			this.cursorSize = 20

			this.cursorStyle = {
				boxSizing: 'border-box',
				position: 'fixed',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				zIndex: '2147483647',
				width: `${this.cursorSize}px`,
				height: `${this.cursorSize}px`,
				transition: '250ms, transform 100ms',
				userSelect: 'none',
				pointerEvents: 'none'
			}

			this.init(this.cursor, this.cursorStyle)
		}

		init(el, style) {
			Object.assign(el.style, style)
			setTimeout(() => {
				this.cursor.removeAttribute("hidden")
			}, 500)
			this.cursor.style.opacity = 1
		}

		move(event) {
			this.previousPointerX = this.position.pointerX
			this.previousPointerY = this.position.pointerY
			this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x
			this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y
			this.position.distanceX = this.previousPointerX - this.position.pointerX
			this.position.distanceY = this.previousPointerY - this.position.pointerY
			this.distance = Math.sqrt(this.position.distanceY ** 2 + this.position.distanceX ** 2)

			this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`

			if (this.distance > 1) {
				this.rotate(this.position)
			} else {
				this.cursor.style.transform += ` rotate(${this.angleDisplace}deg)`
			}
		}

		rotate(position) {
			let unsortedAngle = Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) * this.degrees
			let modAngle
			const style = this.cursor.style
			this.previousAngle = this.angle

			if (position.distanceX <= 0 && position.distanceY >= 0) {
				this.angle = 90 - unsortedAngle + 0
			} else if (position.distanceX < 0 && position.distanceY < 0) {
				this.angle = unsortedAngle + 90
			} else if (position.distanceX >= 0 && position.distanceY <= 0) {
				this.angle = 90 - unsortedAngle + 180
			} else if (position.distanceX > 0 && position.distanceY > 0) {
				this.angle = unsortedAngle + 270
			}

			if (isNaN(this.angle)) {
				this.angle = this.previousAngle
			} else {
				if (this.angle - this.previousAngle <= -270) {
					this.angleDisplace += 360 + this.angle - this.previousAngle
				} else if (this.angle - this.previousAngle >= 270) {
					this.angleDisplace += this.angle - this.previousAngle - 360
				} else {
					this.angleDisplace += this.angle - this.previousAngle
				}
			}
			style.left = `${-this.cursorSize / 2}px`
			style.top = `${0}px`
			style.transform += ` rotate(${this.angleDisplace}deg)`
		}

		hidden() {
			this.cursor.style.opacity = 0
			setTimeout(() => {
				this.cursor.setAttribute("hidden", "hidden")
			}, 500)
		}
	}
	let cursor = new ArrowPointer()
	document.onmousemove = function (event) {
		cursor.move(event)
	}
	document.ontouchmove = function (event) {
		cursor.move(event.touches[0])
	}
	document.onclick = function () {
		if (typeof cursor.click === 'function') {
			cursor.click()
		}
	}
}
// document.addEventListener('DOMContentLoaded', function(){
// 	console.log(111);
// 	init();
// });

// init()

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} 
else {
	init() // DOMContentLoaded 已经发生
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let { innerWidth, innerHeight } = window;
const mPos = { x: innerWidth / 2, y: innerHeight / 2 };
const lines = [];

let length = 60,
  startColor = [53, 246, 158],
  endColor = [0, 158, 252],
  size = 5,
  speed = 0.45;

let animationFrame;
let initialized = false;

function initCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  window.addEventListener('resize', handleResize);
  document.body.addEventListener('mousemove', handleMouseMove);

  drawLine();
}

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function handleMouseMove({ clientX, clientY }) {
  mPos.x = clientX;
  mPos.y = clientY;

  if (!initialized) {
    initialized = true;
    for (let i = 0; i < length; i++) {
      let pos = { x: mPos.x, y: mPos.y };
      lines.push(pos);
    }
  }
}

function lerpColor(a, b, amount) {
  amount = Math.min(1, Math.max(0, amount));
  const result = [];
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(a[i] + amount * (b[i] - a[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

function drawLine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let points = [];
  let x = mPos.x;
  let y = mPos.y;

  lines.forEach((line, index, arr) => {
    let nextLine = arr[index + 1] || arr[0];
    line.x = x;
    line.y = y;
    const colorIndex = index / lines.length;
    const color = lerpColor(startColor, endColor, colorIndex);
    points.push({ x, y, color });

    x += (nextLine.x - line.x) * speed;
    y += (nextLine.y - line.y) * speed;
  });

  ctx.lineCap = 'round';
  ctx.lineWidth = size;

  points.forEach((point, index) => {
    if (index > 0) {
      ctx.strokeStyle = point.color;
      ctx.beginPath();
      ctx.moveTo(points[index - 1].x, points[index - 1].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  });

  animationFrame = requestAnimationFrame(drawLine);
}

initCanvas();

