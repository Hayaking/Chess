import GameState from "./state";
import PlayerType from "./type";
import game from "./game";
import ChessType from "./chess/type";
import Color from "./chess/color";
import ChessFactory from "./chess/factory";


export function isEmpty(x, y) {
    if (x===0 && y===0)return false
    return !game.situation[x][y];
}

export function moveTo(position) {
    let step = moveChess(game.currentChess, position.x, position.y);
    game.moveablePlaces = [];
    game.chessUnderAttack = [];
    return step;
}

export function moveChess(chess, newX, newY) {
    let step = {
        fromX: chess.x,
        fromY: chess.y,
        toX: newX,
        toY: newY
    };
    executeStep(step);
    console.info(game.situation)
    // game.socket.emit('change_state', game.situation);
    game.socket.emit('nextStep', step);
    return step;
}

export function isFriendly(color, x, y) {
    if (isEmpty(x, y)) {
        return false;
    }
    return color + getChess(x, y).color !== 0;
}

export function getChess(x, y) {
    return game.situation[x][y];
}

function checkFinish() {
    if (game.state === GameState.FINISHED) {
        prompt("棋局已终止！");
        return true;
    }
    return false;
}

function prompt(text) {
    alert(text);
}

export function select(chess) {
    if (checkFinish()) {
        return;
    }

    if (game.currentPlayer.type !== PlayerType.LOCAL) {
        prompt("等待远程棋手落子！");
        return;
    }

    if (chess.color !== game.currentPlayer.color) {
        prompt("不该你走！");
        return;
    }

    game.currentChess = chess;
    game.moveablePlaces = [];
    game.chessUnderAttack = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 10; j++) {
            if (chess.canGo(i, j)) {
                if (isEmpty(i, j)) {
                    game.moveablePlaces.push({
                        x: i,
                        y: j
                    });
                } else {
                    game.chessUnderAttack.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
    }

}

export function attack(position) {
    if (checkFinish()) {
        return;
    }

    let chess = game.situation[position.x][position.y];

    if (game.currentChess) {
        if (game.currentChess.color + chess.color === 0) {
            let canKill = game.chessUnderAttack.filter(it => (it.x === chess.x) && (it.y === chess.y)).length;

            if (canKill) {
                return moveChess(game.currentChess, chess.x, chess.y, false);
            } else {
                prompt("吃不到这个棋子！");

            }
        }
    }
}


export function executeStep(step, isUndo) {
    let chess = game.situation[step.fromX][step.fromY];
    let killedChess = game.situation[step.toX][step.toY];
    delete game.situation[step.fromX][step.fromY];
    game.situation[step.toX][step.toY] = chess;
    chess.x = step.toX;
    chess.y = step.toY;

    if (killedChess) {
        for (let i = 0; i < game.chesses.length; i++) {
            if (killedChess === game.chesses[i]) {
                game.chesses.splice(i, 1);
                break;
            }
        }

        if (killedChess.type === ChessType.GENERAL) {
            let winner = (killedChess.color === Color.RED) ? "黑" : "红";
            prompt("结束啦，" + winner + "方胜利！");
            game.state = GameState.FINISHED;
        }
    }

    if (isUndo) {
        if (step.deadColor) {
            let deadChess = ChessFactory.createChess([step.deadColor, step.deadType, step.fromX, step.fromY]);
            game.situation[step.fromX][step.fromY] = deadChess;

            game.chesses.push(deadChess);
        }

        game.redoList.push(step);
    } else {
        if (killedChess) {
            step.deadType = killedChess.type;
            step.deadColor = killedChess.color;
        }
        game.undoList.push(step);
    }

    game.currentPlayer = (game.currentPlayer === game.redPlayer) ? game.blackPlayer : game.redPlayer;
    game.currentChess = null;
    game.moveablePlaces = [];
    game.chessUnderAttack = [];
    game.history.push(step);

    check();
    log(step);
    notify(step);
}

function log(step) {
    let chess = game.situation[step.toX][step.toY];
    game.loggers.forEach(logger => logger.log(chess, step));
}

function notify(step) {
    game.watchers.forEach(watcher => watcher.notify(step));
}

function check() {
    for (let i = 0; i < game.generals.length; i++) {
        for (let j = 0; j < game.situation.length; j++) {
            for (let k = 0; k < game.situation[j].length; k++) {
                // try{
                    if (game.situation[j][k] && game.situation[j][k].canGo(game.generals[i].x, game.generals[i].y)) {
                        prompt("将军！");
                        return;
                    }
                // }catch (e) {
                //     console.info(e)
                //     console.info(j,k)
                //     console.info(e)
                // }
            }
        }
    }
}
