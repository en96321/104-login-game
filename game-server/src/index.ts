import Arena, { listen } from "@colyseus/arena"
import { monitor } from "@colyseus/monitor"

import { GameRoom } from './rooms/GameRoom'


const arena = Arena({
    getId: () => "104-login-game",

    initializeGameServer: (gameServer) => {

        // Define "reconnection" room
        gameServer.define("GameRoom", GameRoom)
            .enableRealtimeListing();

        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
          });


    },

    initializeExpress: (app) => {
        app.use('/colyseus', monitor());
    }
});

listen(arena)