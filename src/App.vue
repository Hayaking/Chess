<template>
    <div id="app">
        <chess></chess>
        <br/>
        <button @click="reset"><h1>重置棋盘</h1></button>
        <div>{{user_list}}</div>
    </div>
</template>

<script>
    import Chess from "./chess.vue";
    import {socket} from "./game";

    let name;
    if (location.hash) {
        name = location.hash;
        localStorage.setItem("name", name);
    } else if (localStorage.getItem("name")) {
        name = localStorage.getItem("name");
    } else {
        name = prompt('用户名：');
        localStorage.setItem("name", name);
    }
    socket.emit('sign', name);

    window.onbeforeunload = () => {
        socket.emit('disconnected');
    };
    export default {
        components: {
            Chess
        },
        created() {
            socket.on("userList", res => {
                this.$nextTick(() => {
                    this.user_list = res
                })
            })
        },
        data() {
            return {
                user_list: []
            }
        },
        methods: {
            reset() {
                socket.emit('reset')
            }
        }
    }
</script>

<style>
    body {
        background-color: rgb(200, 255, 200);
        /*font-family: Helvetica, sans-serif;*/
    }
</style>
