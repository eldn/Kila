import { RenderOptions } from "./RenderOptions";
import { log } from "../utils/Log";
import Texture from "../texture/Texture";
import Color from "../math/Color";

export class TextureOptions {

    uvTypes: Object = null;
    option: RenderOptions = null;


    reset(option : RenderOptions) {
        this.option = option;
        this.uvTypes = {};
        return this;
    }


    add(texture : Texture | Color, optionName : string, callback ?: Function) {
        if (texture && texture instanceof Texture) {
            const {
                uvTypes,
                option
            } = this;

            const uv : number = texture.uv || 0;
            uvTypes[uv] = 1;
            option[optionName] = uv;

            if (callback) {
                callback(texture);
            }
        }

        return this;
    }

    update() {
        const supportUV = [0, 1];
        const {
            uvTypes,
            option
        } = this;

        for (const type in uvTypes) {
            if (supportUV.indexOf(Number(type)) !== -1) {
                option[`HAS_TEXCOORD${type}`] = 1;
            } else {
                log.warnOnce(`Material._textureOption.update(${type})`, `uv_${type} not support!`);
                option.HAS_TEXCOORD0 = 1;
            }
        }

        return this;
    }
}