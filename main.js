/**
 * 这是生命游戏主文件
 * @type {HTMLElement | null}
 */
const gameDOM = document.getElementById('gameContainer')
let gameCanvas;
let gameContext;

let gameOption = {
    itemTotalX: 50,
    itemTotalY: 50,
    refreshTime: 50,
    aliveItems: [2],
    bornItems: [3]
}

let itemPixelWidth = 0
let itemPixelHeight = 0

let items = []

for (let i = 0, len = gameOption.itemTotalX * gameOption.itemTotalY; i < len; i++) {
    items[i] = 0
}

let frameInterval;

function initGameContainer() {
    let width = gameDOM.offsetWidth
    let height = gameDOM.offsetHeight
    gameCanvas = document.createElement('canvas')
    gameCanvas.setAttribute('width', width + 'px')
    gameCanvas.setAttribute('height', height + 'px')
    gameCanvas.style.width = width + 'px'
    gameCanvas.style.height = height + 'px'
    gameDOM.appendChild(gameCanvas)
    gameContext = gameCanvas.getContext('2d')
    itemPixelWidth = width / gameOption.itemTotalX
    itemPixelHeight = height / gameOption.itemTotalY
}

function initCommonStyle() {
    gameContext.fillStyle = '#000';
}

function initGamePanel() {
    for (let i = 0, len = items.length; i < len; i++) {
        if (Math.random() < 0.28) {
            items[i] = 1
        }
    }
    drawItems()
}

function refreshItemsByRule() {
    let itemsNext = []
    for (let i = 0, len = gameOption.itemTotalX * gameOption.itemTotalY; i < len; i++) {
        itemsNext[i] = isItemAlive(i)
    }
    items = itemsNext
    drawItems()
}

function isItemAlive(index) {
    let cnt = 0
    let x = gameOption.itemTotalX
    const ruleIndexMap = {
        topLeft: function(index) {
            return index - x -1
        },
        top: function (index) {
            return index - x
        },
        topRight: function (index) {
            return index - x + 1
        },
        left: function (index) {
            return index - 1
        },
        right: function (index) {
            return index + 1
        },
        bottomLeft: function (index) {
            return index + x -1
        },
        bottom: function (index) {
            return index + x
        },
        bottomRight: function (index) {
            return index + x + 1
        }
    }
    for (let position in ruleIndexMap) {
        let positionIndex = ruleIndexMap[position](index)
        if (positionIndex >= 0 && positionIndex < gameOption.itemTotalX * gameOption.itemTotalY) {
            if (items[positionIndex]) {
                cnt++
            }
            if (cnt > 3) {
                break
            }
        }
    }
    if (gameOption.aliveItems.includes(cnt)) {
        return items[index]
    } else if (gameOption.bornItems.includes(cnt)) {
        return 1
    } else {
        return 0
    }
}

function drawItem(x, y) {
    if (x < 0 || x >= gameOption.itemTotalX) {
        console.error(`像素点x轴越界：（${x}, ${y}）`)
        return
    }
    if (y < 0 || y >= gameOption.itemTotalY) {
        console.error(`像素点y轴越界：（${x}, ${y}）`)
        return
    }
    gameContext.fillRect(x * itemPixelWidth, y * itemPixelHeight, itemPixelWidth, itemPixelHeight)
}

function clearItem(x, y) {
    gameContext.save()
    gameContext.fillStyle = '#fff'
    gameContext.fillRect(x * itemPixelWidth, y * itemPixelHeight, itemPixelWidth, itemPixelHeight)
    gameContext.restore()
}

function drawItems() {
    gameContext.clearRect(0, 0, gameOption.itemTotalX, gameOption.itemTotalY);
    items.forEach((item, index) => {
        let x = index % gameOption.itemTotalX
        let y = Math.floor(index / gameOption.itemTotalX)
        if (item === 1) {
            drawItem(x, y)
        } else {
            clearItem(x, y)
        }
    })
}

function initGame() {
    initGameContainer()
    initCommonStyle()
    initGamePanel()
    frameInterval = setInterval(function () {
        refreshItemsByRule()
    }, gameOption.refreshTime)
}

window.onload = function () {
    initGame()
}