import * as http from "http";
import * as moment from "moment";
import * as WebSocket from "ws";

export class WebSocketServer {
  private wss: WebSocket.Server;
  constructor(private readonly server: http.Server) {
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on("connection", (ws: WebSocket) => {
      // @ts-ignore
      ws.isAlive = true;
      ws.on("pong", heartbeat);
      ws.on("message", (message: string) => {
        ws.send(`You sent ${message}`);
      });
      ws.send("Connection established to WebSocket server");
    });

    function noop(): void {}

    function heartbeat(): void {
      this.isAlive = true;
    }

    // Pings websocket clients to make sure they are alive
    setInterval(function ping(): void {
      if (this.wss) {
        this.wss.clients.forEach(function each(ws: WebSocket): void {
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
  public async broadcastMessage(message: string): Promise<void> {
    if (this.wss) {
      if (this.wss.clients.size === 0) {
        await Promise.resolve();
      } else {
        await Promise.all(
          Array.from(this.wss.clients).map((ws: WebSocket) => {
            return new Promise((resolve: any, reject: any) => {
              ws.send(message, (err: Error) => {
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
      await Promise.reject("WebSocket connection is not open");
    }
  }
}

export enum MessageType {
  SessionStart,
  SessionEnd,
  Message
}

export const WsMessage: (
  messageType: MessageType,
  message: string,
  userId?: number
) => string = (
  messageType: MessageType,
  message: string,
  userId?: number
): string =>
  JSON.stringify({ messageType, message, userId, timestamp: moment() });
