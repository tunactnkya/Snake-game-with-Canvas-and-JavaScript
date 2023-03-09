const canvas = document.getElementById('canvas'); // Önceden html'de belirlediğim canvas dosyasına ulaşıyorum.


const ctx = canvas.getContext('2d') // Canvas üzerinde 2d bir çizim yapmak istediğimi belirtiyorum.

let initialState = {  // Oyunun başlangıç durumları.
    cols: 30, //Sütunlar.
    rows: 20,
    score: 0,
    tail: [],  //Kuyruk.
    static: 20,  //Bütün değişkenleri static üzerinden yapıyorum.
    snakeX: 0,  //Yılanın pozisyon durumları x ve y.
    snakeY: 0,
    eatX: null,  //Yılanın haritada ki yiyecekleri.
    eatY: null,
    velX: 0,
    velY: 0,
    gameOver: false  //Oyunun başlama bitme olayları.
}

//Çizim aracı üzerinden oluşacak canvasın boyutları.
canvas.width = initialState.static * initialState.cols //600
canvas.height = initialState.static * initialState.rows //400

//Kare çizmek için.
class Square {
    constructor(x, y, width, height, color) {  //Dışardan veriler alıcam.
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    //Çizim aracı.
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}



//Oyun bittiğinde 'game over'yazısının çıkacağı ve oyunu yeniden başlatabileceğimiz class.
class Text {
    constructor(text, x, y, textAlign, fontSize) {
        this.text = text
        this.x = x
        this.y = y
        this.textAlign = textAlign
        this.fontSize = fontSize
    }
    draw() {
        ctx.fillStyle = "red"
        ctx.font = `${this.fontSize}px Roboto Mono`
        ctx.textAlign = this.textAlign
        ctx.fillText(this.text, this.x, this.y)   //Yazıları tamamıyla ekrana bastırıcam.
    }
}

//Klavye tuşlarını kullanmak için.
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            initialState.velX = 0
            initialState.velY = -1
            break;
        case 's':
            initialState.velX = 0
            initialState.velY = 1
            break;
        case 'a':
            initialState.velX = -1
            initialState.velY = 0
            break;
        case 'd':
            initialState.velX = 1
            initialState.velY = 0
            break;

        default:
            break;
    }

    //Score işlemleri.
    document.getElementById('score').innerText = initialState.score
})


//Yiyeceklerin geleceği koordinatları rastgele verir.
const generateEat = () => {
    initialState.eatX = Math.floor(Math.random() * initialState.cols) * initialState.static //x'ler cols'tan
    initialState.eatY = Math.floor(Math.random() * initialState.rows) * initialState.static //y'ler rows'tan oluşturduk.
}

generateEat();


const loop = () => {
    setInterval(() => {   //Canvas her update uğradığında bi önceki çizimi temizlemek için clearRect komutu ile kullanıyorum.
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        new Square(0, 0, canvas.width, canvas.height, '#8FFC50').draw() //Background
        new Square(initialState.snakeX, initialState.snakeY, initialState.static, initialState.static, '#EE1616').draw() //Snake
        new Square(initialState.eatX, initialState.eatY, initialState.static, initialState.static, '#0E3188').draw()


        initialState.snakeX += initialState.velX * initialState.static
        initialState.snakeY += initialState.velY * initialState.static

        if (initialState.snakeX == initialState.eatX && initialState.snakeY == initialState.eatY) {
            initialState.tail.push([initialState.eatX, initialState.eatY])
            initialState.score += 1
            generateEat()
        }

        for (let i = initialState.tail.length - 1; i >= 1; i--) {
            initialState.tail[i] = initialState.tail[i - 1];
        }

        if (initialState.tail.length) {
            initialState.tail[0] = [initialState.snakeX, initialState.snakeY]
        }

        for (let i = 0; i < initialState.tail.length; i++) { // Yılanın yedikçe büyümesi için.
            new Square(initialState.tail[i][0], initialState.tail[i][1], initialState.static, initialState.static, '#EE1616').draw()
        }

        //Oyunun bitince yeniden başlaması için.
        if (initialState.snakeX < 0 || initialState.snakeX > initialState.cols * initialState.static || initialState.snakeY < 0 || initialState.snakeY > initialState.rows * initialState.static) {
            gameOverFunc()
        }

        if (initialState.gameOver) {
            new Text('GAME OVER!!', canvas.width / 2, canvas.height / 2 - 25, 'center', 50).draw() // Yazı canvasın genişliğinin yarısına denk gelecek.
            new Text('Click To Start Again', canvas.width / 2, canvas.height / 2 + 25, 'center', 20).draw()
        }

    }, 1000 / 10);
}
//Skor sıfırlama.
const gameOverFunc = () => {
    initialState.score = 0,
        initialState.tail = [],
        initialState.static = 0,
        initialState.snakeX = 0,
        initialState.snakeY = 0,
        initialState.velX = 0,
        initialState.velY = 0,
        initialState.gameOver = true
}

addEventListener('click', () => {
    initialState.gameOver = false,
        initialState.static = 20
})

loop(); 