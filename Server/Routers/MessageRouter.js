const Events = require("../Events.js");

/**
 * Manages routes related to sending and viewing messages.
 * @author Cameron Burkholder
 * @date   03/09/2022
 */
class MessageRouter {
    /**
     * Publicly exposes all necessary routes to the server instance.
     * @author Cameron Burkholder
     * @date   03/09/2022
     */
    static serveRoutes(server, authenticator, io) {
        // EXPOSE THE SOCKET.IO HANDLERS.
        MessageRouter.io = io;
        io.on(Events.Connect, MessageRouter.handleConnection);
        io.on(Events.Disconnect, MessageRouter.handleDisconnect);
        io.on(Events.Error, MessageRouter.handleError);

        // EXPOSE THE ROUTE HANDLERS.
    }

    static broadcastMessage(message) {
        MessageRouter.io.emit(Events.Message, message);
    }
    static handleConnection(socket) {
        socket.on(Events.Message, MessageRouter.broadcastMessage);
    }
    static handleDisconnect(socket) {}
    static handleError(error) {}
}

module.exports = MessageRouter;
