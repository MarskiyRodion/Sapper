startGame(16, 16, 30);

// Таймер
const countDownTime = document.querySelector('.timer')
countDownTime.innerHTML = '40:00'
let time = 2400
const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    countDownTime.innerHTML = `${minutes}:${seconds}`;
    time--
}, 1000)

//секундомер
const countUpTime = document.querySelector('.seconds')
countUpTime.innerHTML = '00:00'
let miliseconds = 0;
let secondsTime = setInterval(() => {
    miliseconds += 10;
    let dateTimer = new Date(miliseconds)
    countUpTime.innerHTML = ('0' + dateTimer.getUTCMinutes()).slice(-2) + ':' + ('0' + dateTimer.getUTCSeconds()).slice(-2)
}, 10)



function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
    //Первый клик
    let firstClick = false

    // Кнопка Смайлик
    const smile = document.querySelector('.image__btn');
    smile.innerHTML = '<button class="smile_button"><img src="./image/smile.png" alt="" class="smile"></button>'

    // Поле сапёра
    const field = document.querySelector('.field');
    const cellsCount = WIDTH * HEIGHT;
    field.innerHTML = '<button class="button"><img src="./image/button.png" alt="" class="img_button"></button>'.repeat(cellsCount);
    const cells = [...field.children];
    let closedCount = cellsCount;
    let bombs = [...Array(cellsCount).keys()].sort(() => Math.random() - 0.5).slice(0, BOMBS_COUNT)
    const numbers = [
        '<img src=" ./image/button_one.png" alt="" class="img_button">',
        '<img src=" ./image/button_two.png" alt="" class="img_button">',
        '<img src=" ./image/button_tree.png" alt="" class="img_button">',
        '<img src=" ./image/button_four.png" alt="" class="img_button">'
    ]


    smile.addEventListener('click', (event) => {
        location.reload()
    })

    field.addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') {
            return;
        }

        smile.innerHTML = '<button class="smile_button"><img src="./image/smile.png" alt="" class="smile"></button>'
        const index = cells.indexOf(event.target.parentElement);
        const column = index % WIDTH;
        const row = Math.floor(index / WIDTH);
        open(row, column)
    });

    field.addEventListener('mousedown', (event) => {
        if (event.target.tagName !== 'IMG') {
            return;
        }
        smile.innerHTML = '<button class="smile_button"><img src="./image/smile_click.png" alt="" class="smile"></button>'
    })

    field.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        if (event.target.tagName !== 'IMG') {
            return;
        }

        smile.innerHTML = '<button class="smile_button"><img src="./image/smile.png" alt="" class="smile"></button>'

        const index = cells.indexOf(event.target.parentElement);
        const row = Math.floor(index / WIDTH);
        const column = index % WIDTH;
        flag(row, column)
    });

    function isValid(row, column) {
        return row >= 0
            && row < HEIGHT
            && column >= 0
            && column < WIDTH;
    }

    function getCount(row, column) {
        let count = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (isBomb(row + y, column + x)) {
                    count++
                }
            }
        }
        return count
    }

    function open(row, column) {
        if (!isValid(row, column)) return;

        const index = row * WIDTH + column;
        const cell = cells[index];

        if (cell.disabled === true) return;

        cell.disabled = true;
        cell.innerHTML = '<img src="./image/button_open.png" alt="" class="img_button">'

        if (isBomb(row, column)) {
            for (let i = 0; i < bombs.length; i++) {
                cells[bombs[i]].innerHTML = '<img src="./image/bomb.png" alt="" class="img_button">';
            }
            cell.innerHTML = '<img src="./image/bomb_open.png" alt="" class="img_button">'
            for (let i = 0; i < cells.length; i++) {
                cells[i].disabled = true;
            }

            smile.innerHTML = '<button class="smile_button"><img src="./image/smile_button.png" alt="" class="smile"></button>'

            clearInterval(secondsTime)
            clearInterval(interval)
            return;
        }

        closedCount--;
        if (closedCount <= BOMBS_COUNT) {
            smile.innerHTML = '<button class="smile_button"><img src="./image/smile_won.png" alt="" class="smile"></button>'
            clearInterval(secondsTime)
            clearInterval(interval)
            return
        }

        const count = getCount(row, column);

        if (count !== 0) {
            cell.innerHTML = numbers[count - 1];
            return;
        }

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                open(row + y, column + x);
            }
        }

    }

    function isBomb(row, column) {
        if (!isValid(row, column)) return false;
        const index = row * WIDTH + column;
        return bombs.includes(index);
    }

    function flag(row, column) {
        const index = row * WIDTH + column;
        const cell = cells[index];
        if (cell.innerHTML === '<img src="./image/flag.png" alt="" class="img_button">') {
            cell.innerHTML = '<img src="./image/question.png" alt="" class="img_button">'
        } else if (cell.innerHTML === '<img src="./image/question.png" alt="" class="img_button">') {
            cell.innerHTML = '<img src="./image/button.png" alt="" class="img_button">'
        } else {
            cell.innerHTML = '<img src="./image/flag.png" alt="" class="img_button">'
        }
    }
}