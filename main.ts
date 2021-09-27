radio.onReceivedNumber(function (receivedNumber) {
    if (started == 1) {
        if (receivedNumber == 60) {
            started = 2
            basic.showIcon(IconNames.Yes)
            basic.pause(2000)
            reset()
        } else {
            checkSendPos(receivedNumber)
        }
    } else if (started == 0) {
        if (receivedNumber == 20) {
            if (myStart == 1) {
                startGame()
                hasPong = 1
            } else {
                enemyStart = 1
            }
        }
    }
})
function startGame () {
    basic.clearScreen()
    started = 1
    led.plot(0, height)
}
function checkSendPos (num: number) {
    if (hasPong == 0) {
        posX = 4
        if (num >= 40) {
            posY = 4
        } else if (num >= 30) {
            posY = 3
        } else if (num >= 20) {
            posY = 2
        } else if (num >= 10) {
            posY = 1
        } else {
            posY = 0
        }
        up = num - posY * 10
        hasPong = 1
        comeBack = 1
        led.plot(posX, posY)
    }
}
input.onButtonPressed(Button.A, function () {
    moveHeight(1)
})
function movePong () {
    if (hasPong == 1) {
        led.unplot(posX, posY)
        if (comeBack == 0) {
            if (posX == 4) {
                radio.sendNumber(posY * 10 + up)
                hasPong = 0
                led.unplot(posX, posY)
            } else {
                if (posX < 4) {
                    posX = posX + 1
                }
                setHeight()
            }
        } else {
            if (posX == 1) {
                if (height == posY) {
                    comeBack = 0
                } else {
                    radio.sendNumber(60)
                    started = 2
                    basic.showIcon(IconNames.No)
                    basic.pause(2000)
                    reset()
                }
            } else {
                if (posX > 0) {
                    posX = posX - 1
                }
                setHeight()
            }
        }
        if (hasPong == 1) {
            led.plot(posX, posY)
            basic.pause(500)
        }
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (started == 0) {
        if (enemyStart == 1) {
            startGame()
        } else {
            myStart = 1
        }
        radio.sendNumber(20)
    }
})
function setHeight () {
    if (up == 0) {
        if (posY > 0) {
            posY = posY - 1
        } else {
            up = 1
        }
    } else {
        if (posY < 4) {
            posY = posY + 1
        } else {
            up = 0
        }
    }
}
radio.onReceivedString(function (receivedString) {
    connected = 100
})
input.onButtonPressed(Button.B, function () {
    moveHeight(0)
})
function reset () {
    basic.clearScreen()
    height = 2
    started = 0
    enemyStart = 0
    myStart = 0
    posY = 2
    posX = 1
    hasPong = 0
}
function moveHeight (up: number) {
    if (connected > 0 && started == 1) {
        led.unplot(0, height)
        if (up == 0) {
            if (height > 0) {
                height = height - 1
            } else {
                height = 4
            }
        } else {
            if (height < 4) {
                height = height + 1
            } else {
                height = 0
            }
        }
        led.plot(0, height)
    }
}
let connected = 0
let comeBack = 0
let up = 0
let posY = 0
let posX = 0
let height = 0
let enemyStart = 0
let hasPong = 0
let myStart = 0
let started = 0
radio.setGroup(420)
reset()
basic.forever(function () {
    radio.sendString("c")
    if (connected > 0) {
        connected = connected - 1
        if (started == 1) {
            movePong()
        } else if (started == 0) {
            if (myStart == 1) {
                basic.showString("..")
            } else {
                basic.showLeds(`
                    . . # . .
                    . # # # .
                    # . # . #
                    . . # . .
                    . . # . .
                    `)
            }
        }
    } else {
        basic.showString("c")
    }
})
