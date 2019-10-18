import { Message } from "./Message";
import { IMessageHandler } from "./IMessageHandler";

export type MessageCallback = ( message: Message ) => void;


export class MessageSubscriptionNode {

    public code: string;

    public handler: IMessageHandler;

    public callback: MessageCallback;

    public constructor( code: string, handler: IMessageHandler, callback: MessageCallback ) {
        this.code = code;
        this.handler = handler;
        this.callback = callback;
    }
}


export class MessageQueueNode {

  
    public message: Message;

    
    public handler: IMessageHandler;

   
    public callback: MessageCallback;

 
    public constructor( message: Message, handler: IMessageHandler, callback: MessageCallback ) {
        this.message = message;
        this.handler = handler;
        this.callback = callback;
    }
}