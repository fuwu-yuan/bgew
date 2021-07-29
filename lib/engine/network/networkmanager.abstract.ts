import {Board} from "../board";
import {WebSocketSubject} from "rxjs/webSocket";
import {default as axios} from "axios";
import * as Network from '.';
import {SocketMessage} from ".";

/**
 * A network manager is aim to manage communication with your server API and websocket server
 */
export abstract class AbstractNetworkManager {

    protected api;
    protected board: Board;
    protected webSocketSubject: WebSocketSubject<any>|null = null;
    protected msgsPromises: {
        timestamp: number,
        promise: {
            resolve: (value: (Network.SocketMessage | PromiseLike<Network.SocketMessage>)) => void,
            reject: (reason?: any) => void
        }
    }[] = [];

    constructor(board: Board) {
        this.board = board;
        this.api = axios.create();
        this.checkPageReload();
        this.init();
    }

    private init() {
        this.api = axios.create({
            baseURL: this.apiUrl,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'rejectUnauthorized': 'false',
            }
        });
        console.log("Networkmanager ready :");
        console.log("• API URL: " + this.apiUrl);
    }

    abstract ping(): Promise<string>;

    /**
     * You must initialize this.webSocketSubject as a WebSocketSubject<SocketMessage>
     * @param uid
     */
    abstract joinRoom(uid: string): Promise<Network.Response>;

    /**
     * Disconnect from websocket
     */
    leaveRoom() {
        if (this.webSocketSubject) {
            this.webSocketSubject.unsubscribe();
        }
    }

    /**
     * Call your API to create a new websocket server
     *
     * @param name
     * @param limit
     * @param data
     * @param autojoinroom
     */
    abstract createRoom(name: string, limit: number, data: {}, autojoinroom: boolean): Promise<Network.Response>;

    /**
     * Add some data to your server
     *
     * @param data
     * @param merge
     */
    abstract setRoomData(data: any, merge: boolean): Promise<Network.Response>;

    /**
     * Get data from server
     */
    abstract getRoomData(): Promise<Network.Response>;

    /**
     * Close a server
     *
     * @param uid
     * @param close
     */
    abstract closeRoom(uid: string, close: boolean): Promise<Network.Response>;

    /**
     * Return all opened rooms
     */
    abstract getOpenedRooms(): Promise<{status:string,servers:Network.Room[]}>;

    /**
     * Return all closed rooms
     */
    abstract getClosedRooms(): Promise<{status:string,servers:Network.Room[]}>;

    /**
     * Open a room (similar to closeRoom(uid, false)
     * @param uid
     */
    openRoom(uid: string): Promise<Network.Response> {
        return this.closeRoom(uid, false);
    }

    sendMessage(message: any): Promise<SocketMessage> {
        let timestamp = (new Date()).getTime();
        let promise = new Promise<SocketMessage>((resolve, reject) => {
            this.msgsPromises.push({timestamp: timestamp, promise: {resolve: resolve, reject: reject}});
        });
        this.webSocketSubject?.next({id: timestamp, msg: message});
        return promise;
    }

    msgSentConfirmation(message: SocketMessage) {
        let index = this.msgsPromises.findIndex((msgPromiseExec) => {
            return msgPromiseExec.timestamp === message.data.msg.id;
        });
        if (index > -1) {
            let promise = this.msgsPromises[index];
            promise.promise.resolve(message);
            this.msgsPromises.splice(index, 1);
        }
    }

    /**
     * This function check if page is reloaded and disconnect the socket
     *
     * @private
     */
    private checkPageReload() {
        window.addEventListener("unload", (event) => {
            console.log("The page is refreshing");
            if (this.webSocketSubject) {
                this.webSocketSubject.unsubscribe();
            }
        });
    }

    abstract get wsUrl(): string;
    abstract get apiUrl(): string;
}
