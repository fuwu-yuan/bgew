import {webSocket} from "rxjs/webSocket";
import {Room} from './room';
import {Response} from "./response";
import {SocketMessage} from "./socketMessage";
import {AxiosResponse} from 'axios';
import {AbstractNetworkManager} from "./networkmanager.abstract";

export class NetworkManager extends AbstractNetworkManager {

  public roomuid: string = "";

  /**
   * @override
   */
  joinRoom(uid: string): Promise<Response> {
    if (this.roomuid === "") this.roomuid = uid;
    return new Promise<Response>((resolve, reject) => {
      try {
        this.ws = webSocket(this.wsUrl + uid);
        this.ws.subscribe(
          (msg: SocketMessage) => {
            switch (msg.code) {
              case "player_join":
                this.board.step.onPlayerJoin(msg);
                break;
              case "player_leave":
                this.board.step.onPlayerLeave(msg);
                break;
              case "broadcast":
                this.board.step.onNetworkMessage(msg);
                break;
              case "msg_sent":
                this.board.networkManager.msgSentConfirmation(msg);
                break;
              case "connected":
                resolve({status:"success", code: "connected", data: msg.data});
                break;
              case "room_full":
                resolve({status:"error", code: "room_full", data: msg.data});
                break;
            }
          },
          err => {
            if (err instanceof CloseEvent) {
              this.board.step.onConnectionClosed();
            }
            console.log(err);
            reject();
          },
          this.board.step.onConnectionClosed
        );
      }catch(e) {
        reject(e);
      }
    });
  }

  /**
   * @override
   */
  createRoom(name: string, limit = 0, autojoinroom = true): Promise<Response> {
    console.log("Creating room " + name);
    return this.api.post<any, AxiosResponse<Response>>('/room', {
      game: this.board.name,
      version: this.board.version,
      name: name,
      limit: limit
    }).then((response) => {
      let resp = response.data;
      if (resp.status === "success") {
        this.roomuid = resp.data.uid;
        if (autojoinroom) {
          return this.joinRoom(this.roomuid);
        }else {
          return response.data;
        }
      }else {
        throw resp;
      }
    });
  }

  /**
   * @override
   */
  setRoomData(data: any, merge: boolean = false): Promise<Response> {
    return this.api.post<any, AxiosResponse<Response>>('/room/data/'+this.roomuid, {
      data: data,
      merge: merge
    }).then(function(response) {
      return response.data;
    });
  }

  /**
   * @override
   */
  closeRoom(uid: string, close: boolean = true): Promise<Response> {
    return this.api.post<any, AxiosResponse<Response>>('/room/close/'+this.roomuid, {
      close: close,
    }).then(function(response) {
      return response.data;
    });
  }

  /**
   * @override
   */
  openRoom(uid: string): Promise<Response> {
    return this.closeRoom(uid, false);
  }

  /**
   * @override
   */
  getOpenedRooms(): Promise<{status:string,servers:Room[]}> {
    return this.api.get<any, AxiosResponse<{status:string,servers:Room[]}>>('/room', {
      params: {
        open: true,
        game: this.board.name,
        version: this.board.version
      }
    }).then(function(response) {
      return response.data;
    });
  }

  /**
   * @override
   */
  getClosedRooms(): Promise<{status:string,servers:Room[]}> {
    return this.api.get<any, AxiosResponse<{status:string,servers:Room[]}>>('/room', {
      params: {
        open: false,
        game: this.board.name,
        version: this.board.version
      }
    }).then(function(response) {
      return response.data;
    });
  }
}
