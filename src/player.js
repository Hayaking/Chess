import {select,moveTo,attack} from "./game-utils";

export default class Player {
	constructor(user, color, type) {
		// this.game = null;
		this.user = user;
		this.color = color;
		this.type = type;
	}

	doSelect(chess) {
		// this.game.select(chess);
		select(chess);
	}

	doMove(position) {
		// this.game.moveTo(position);
		moveTo(position);
	}

	doAttack(position) {
		// this.game.attack(position);
		attack(position);
	}
}
