import * as kila from "../index";

declare var global: any;

var globalObject = (typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : undefined);
if (typeof globalObject !== "undefined") {
    (<any>globalObject).KILA = KILA;
    (<any>globalObject).KILA = (<any>globalObject).KILA || {};
    var KILA = (<any>globalObject).KILA;
    KILA.Debug = KILA.Debug || {};


    for (var key in kila) {
        KILA[key] = (<any>kila)[key];
    }
}