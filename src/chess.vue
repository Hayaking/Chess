<template>
    <svg height="620" version="1.1" width="560" xmlns="http://www.w3.org/2000/svg">
        <desc>Chinese Chess</desc>
        <defs>
            <g id="canGo">
                <rect fill="#3333aa"
                      height="30"
                      stroke="#3333aa"
                      stroke-width="3"
                      width="30"
                      x="15"
                      y="15"/>
            </g>
            <g id="canAttack">
                <rect fill="#ff0000"
                      height="50"
                      stroke="#ff0000"
                      stroke-width="3"
                      width="50"
                      x="5"
                      y="5"/>
            </g>
            <g id="red-general">
                <circle fill="#eeeeee"
                        r="24"
                        stroke="#000"
                        stroke-width="3"/>
                <text fill="#ff0000"
                      stroke="none"
                      text-anchor="middle">
                    <tspan dy="13">帅</tspan>
                </text>
            </g>
            <g id="red-guard">
                <circle fill="#eeeeee"
                        r="24"
                        stroke="#000"
                        stroke-width="3"/>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">仕</tspan>
                </text>
            </g>
            <g id="red-staff">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">相</tspan>
                </text>
            </g>
            <g id="red-horse">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">馬</tspan>
                </text>
            </g>
            <g id="red-chariot">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">車</tspan>
                </text>
            </g>
            <g id="red-cannon">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">砲</tspan>
                </text>
            </g>
            <g id="red-soldier">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#ff0000" stroke="none" text-anchor="middle">
                    <tspan dy="13">兵</tspan>
                </text>
            </g>

            <g id="black-general">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">将</tspan>
                </text>
            </g>
            <g id="black-guard">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">士</tspan>
                </text>
            </g>
            <g id="black-staff">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">象</tspan>
                </text>
            </g>
            <g id="black-horse">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">马</tspan>
                </text>
            </g>
            <g id="black-chariot">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">车</tspan>
                </text>
            </g>
            <g id="black-cannon">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">炮</tspan>
                </text>
            </g>
            <g id="black-soldier">
                <circle fill="#eeeeee" r="24" stroke="#000" stroke-width="3"></circle>
                <text fill="#000000" stroke="none" text-anchor="middle">
                    <tspan dy="13">卒</tspan>
                </text>
            </g>
        </defs>

        <g>
            <rect fill="none"
                  stroke="#000000"
                  stroke-width="3"
                  v-bind:height="height"
                  v-bind:width="width"
                  v-bind:x="chessboard.offsetX"
                  v-bind:y="chessboard.offsetY"/>
            <path fill="none"
                  stroke="#000000"
                  v-bind:d="path"
                  v-for="path in chessboard.pathArr"/>
        </g>

        <use v-bind:x="chessX(chess.x)"
             v-bind:y="chessY(chess.y)"
             v-for="chess in game.chesses"
             v-on:click="game.currentPlayer.doSelect(chess)"
             xlink:href="{{symbol(chess)}}"/>
        <use v-bind:x="canGoX(position.x)"
             v-bind:y="canGoX(position.y)"
             v-for="position in game.moveablePlaces"
             v-on:click="game.currentPlayer.doMove(position)"
             xlink:href="#canGo"/>

        <use v-bind:x="canAttackX(position.x)"
             v-bind:y="canAttackY(position.y)"
             v-for="position in game.chessUnderAttack"
             v-on:click="game.currentPlayer.doAttack(position)"
             xlink:href="#canAttack"/>
    </svg>
</template>

<script>
    import Setting from "./setting";
    import game from "./game";
    import ChessBoard from "./chessboard";

    const colors = {
        "1": "red",
        "0": "",
        "-1": "black"
    };

    const types = ["blank", "soldier", "cannon", "chariot", "horse", "staff", "guard", "general"];
    // const game = new Game();
    const chessboard = new ChessBoard();

    export default {
        data() {
            return {
                game,
                chessboard
            }
        },

        computed: {
            width() {
                return this.chessboard.gridSize * 8;
            },
            height() {
                return this.chessboard.gridSize * 9;
            }
        },

        methods: {
            symbol(chess) {
                return "#" + colors[chess.color] + "-" + types[chess.type];
            },

            chessX(x) {
                return Setting.offsetX + x * Setting.gridSize;
            },

            chessY(y) {
                return Setting.offsetY + y * Setting.gridSize;
            },

            canGoX(x) {
                return Setting.offsetX + (x - 0.5) * Setting.gridSize;
            },

            canGoY(y) {
                return Setting.offsetY + (y - 0.5) * Setting.gridSize;
            },

            canAttackX(x) {
                return Setting.offsetX + (x - 0.5) * Setting.gridSize;
            },

            canAttackY(y) {
                return Setting.offsetY + (y - 0.5) * Setting.gridSize;
            }
        }

    }
</script>
