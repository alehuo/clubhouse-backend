import http from "http";
import moment from "moment";
import WebSocket from "ws";

export class WebSocketServer {
  private wss: WebSocket.Server;
  constructor(private readonly server: http.Server) {
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on("connection", (ws: WebSocket) => {
      // @ts-ignore
      ws.isAlive = true;
      ws.on("pong", heartbeat);
      ws.on("message", (message) => {
        ws.send(`You sent ${message}`);
      });
      ws.send("Connection established to WebSocket server");
    });

    function noop() {}

    function heartbeat() {
      this.isAlive = true;
    }

    // Pings websocket clients to make sure they are alive
    setInterval(function ping() {
      if (this.wss) {
        this.wss.clients.forEach(function each(ws: WebSocket) {
          // @ts-ignore
          if (ws.isAlive === false) {
            return ws.terminate();
          }
          // @ts-ignore
          ws.isAlive = false;
          ws.ping(noop);
        });
      }
    }, 30000);
  }

  /**
   * Broadcasts a websocket message
   *
   * @param {string} message Message
   * @returns {Promise<void>} Promise
   * @memberof WebSocketServer
   */
  public async broadcastMessage(message: string) {
    if (this.wss) {
      if (this.wss.clients.size > 0) {
        await Promise.all(
          Array.from(this.wss.clients).map((ws) => {
            return new Promise((resolve, reject) => {
              ws.send(message, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            });
          })
        );
      }
    } else {
      throw new Error("WebSocket connection is not open");
    }
  }
}

export enum MessageType {
  SessionStart,
  SessionEnd,
  Message
}

export const WsMessage = (
  messageType: MessageType,
  message: string,
  userId?: number
) => JSON.stringify({ messageType, message, userId, timestamp: moment() });
