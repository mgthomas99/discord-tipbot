import { EventEmitter } from "events";
import { StrictEventEmitter } from "strict-event-emitter-types";

export declare interface StrictEventEmitter<T>
extends StrictEventEmitter<EventEmitter, T> {}
