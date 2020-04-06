import GameState from "./state";
import ChessType from "./chess/type";
import Color from "./chess/color";
import Factory from "./chess/factory";
import PlayerType from "./type";
import Player from "./player";
import io from 'socket.io-client';
import {executeStep} from './game-utils'
const defaultChesses = [
	[1, 7, 4, 9],
	[1, 6, 3, 9],
	[1, 6, 5, 9],
	[1, 5, 2, 9],
	[1, 5, 6, 9],
	[1, 4, 1, 9],
	[1, 4, 7, 9],
	[1, 3, 0, 9],
	[1, 3, 8, 9],
	[1, 2, 1, 7],
	[1, 2, 7, 7],
	[1, 1, 0, 6],
	[1, 1, 2, 6],
	[1, 1, 4, 6],
	[1, 1, 6, 6],
	[1, 1, 8, 6],

	[-1, 7, 4, 0],
	[-1, 6, 3, 0],
	[-1, 6, 5, 0],
	[-1, 5, 2, 0],
	[-1, 5, 6, 0],
	[-1, 4, 1, 0],
	[-1, 4, 7, 0],
	[-1, 3, 0, 0],
	[-1, 3, 8, 0],
	[-1, 2, 1, 2],
	[-1, 2, 7, 2],
	[-1, 1, 0, 3],
	[-1, 1, 2, 3],
	[-1, 1, 4, 3],
	[-1, 1, 6, 3],
	[-1, 1, 8, 3]
];
export let socket = io()
export class Game {
	constructor() {
		this.socket = socket;
		this.initialSituation = defaultChesses;

		this.state = GameState.UNINITIALIZED;

		this.history = [];

		this.situation = [];

		this.redPlayer = null;
		this.blackPlayer = null;
		this.currentPlayer = null;

		this.watchers = [];

		this.currentChess = null;
		this.undoList = [];
		this.redoList = [];
		this.chessUnderAttack = [];

		this.generals = [];

		this.chesses = [];
		this.moveablePlaces = [];

		this.loggers = [];
		this.socket.on('message', res => {
			if (JSON.stringify(res) === "{}") return;
			executeStep(res)
		});
		this.socket.on('init', res => {
			if (JSON.stringify(res) === "[]") return;
			res.forEach(item=>{
				executeStep(item)
			})
		});
		this.socket.on('reset', () => {
			this.initialSituation = defaultChesses;

			this.state = GameState.UNINITIALIZED;

			this.history = [];

			this.situation = [];

			this.redPlayer = null;
			this.blackPlayer = null;
			this.currentPlayer = null;

			this.watchers = [];

			this.currentChess = null;
			this.undoList = [];
			this.redoList = [];
			this.chessUnderAttack = [];

			this.generals = [];

			this.chesses = [];
			this.moveablePlaces = [];

			this.loggers = [];
			this.init();
			// ;
		});
        this.init();

	}

	init() {
        let redPlayer = new Player("Local Player 1", Color.RED, PlayerType.LOCAL);
        redPlayer.game = this;
        this.redPlayer = redPlayer;

        let blackPlayer = new Player("Local Player 2", Color.BLACK, PlayerType.LOCAL);
        blackPlayer.game = this;
        this.blackPlayer = blackPlayer;

		for (let i = 0; i < 9; i++) {
			this.situation[i] = [];
		}

		this.initialSituation.forEach(it => this.chesses.push(this.createChess(it)));
		this.currentPlayer = this.redPlayer;
	}

	destroy() {
		this.situation = null;
		this.currentChess = null;
		this.undoList = null;
		this.redoList = null;
		this.chessUnderAttack = null;
	}

	createChess(data) {
		let chess = Factory.createChess(data);
		// chess.game = this;
		this.situation[chess.x][chess.y] = chess;

		if (chess.type === ChessType.GENERAL) {
			this.generals.push(chess);
		}

		return chess;
	}

	addLogger(logger) {
		this.loggers.push(logger);
	}



	addWatcher(watcher) {
		this.watchers.push(watcher);
	}


	processHistory(history) {
		let newSteps = history.slice(this.history.length, history.length);
		let game = this;
		newSteps.forEach(step => this.executeStep(step));
	}

	undo() {
		if (this.undoList.length > 0) {
			let step = this.undoList.pop();
			this.executeStep(step, true);
		}
	}

	redo() {
		if (this.redoList.length > 0) {
			let step = this.redoList.pop();
			this.executeStep(step);
		}
	}

	serialize() {
		let json = {
			initialSituation: this.initialSituation,
			state: this.state
		};

		if (this.redPlayer) {
			json.redPlayer = this.redPlayer.user;
		}

		if (this.blackPlayer) {
			json.blackPlayer = this.blackPlayer.user;
		}

		return json;
	}
}
export default new Game();
