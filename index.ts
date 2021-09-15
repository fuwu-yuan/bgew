(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process');

export { Board } from "./lib/engine/board";
export { GameStep } from './lib/engine/gamestep'
export { Entity } from './lib/engine/entity'
export * as Entities from './lib/engine/entities';
export * as Network from './lib/engine/network';
export { AbstractNetworkManager } from './lib/engine/network/networkmanager.abstract'
export { Timer } from './lib/engine/timer';
