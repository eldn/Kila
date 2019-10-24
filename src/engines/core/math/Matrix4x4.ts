import { Vector3 } from "./Vector3";

export class Matrix4x4 {

    private _data: number[] = [];


    private constructor() {
        this._data = [
            1.0, 0, 0, 0,
            0, 1.0, 0, 0,
            0, 0, 1.0, 0,
            0, 0, 0, 1.0
        ];
    }

    public get data(): number[] {
        return this._data;
    }

    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    public static orthographic( left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let lr: number = 1.0 / ( left - right );
        let bt: number = 1.0 / ( bottom - top );
        let nf: number = 1.0 / ( nearClip - farClip );

        m._data[0] = -2.0 * lr;

        m._data[5] = -2.0 * bt;

        m._data[10] = 2.0 * nf;

        m._data[12] = ( left + right ) * lr;
        m._data[13] = ( top + bottom ) * bt;
        m._data[14] = ( farClip + nearClip ) * nf;

        return m;
    }

  
    public static perspective( fov: number, aspect: number, nearClip: number, farClip: number ): Matrix4x4 {
        let f = 1.0 / Math.tan( fov / 2 );
        let nf = 1 / ( nearClip - farClip );

        // data
        let m = new Matrix4x4();
        m._data = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, ( nearClip + farClip ) * nf, -1,
            0, 0, nearClip * farClip * nf * 2, 0
        ];
        return m;
    }

   
    public static translation( position: Vector3 ): Matrix4x4 {
        let m = new Matrix4x4();

        m._data[12] = position.x;
        m._data[13] = position.y;
        m._data[14] = position.z;

        return m;
    }

 
    public static rotationX( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[5] = c;
        m._data[6] = s;
        m._data[9] = -s;
        m._data[10] = c;

        return m;
    }

   
    public static rotationY( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[0] = c;
        m._data[2] = -s;
        m._data[8] = s;
        m._data[10] = c;

        return m;
    }

   
    public static rotationZ( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[0] = c;
        m._data[1] = s;
        m._data[4] = -s;
        m._data[5] = c;

        return m;
    }


    public static rotationXYZ( xRadians: number, yRadians: number, zRadians: number ): Matrix4x4 {
        let rx = Matrix4x4.rotationX( xRadians );
        let ry = Matrix4x4.rotationY( yRadians );
        let rz = Matrix4x4.rotationZ( zRadians );

        // ZYX
        return Matrix4x4.multiply( Matrix4x4.multiply( rz, ry ), rx );
    }

  
    public static scale( scale: Vector3 ): Matrix4x4 {
        let m = new Matrix4x4();

        m._data[0] = scale.x;
        m._data[5] = scale.y;
        m._data[10] = scale.z;

        return m;
    }

 
    public static multiply( a: Matrix4x4, b: Matrix4x4 ): Matrix4x4 {
        let m = new Matrix4x4();

        let b00 = b._data[0 * 4 + 0];
        let b01 = b._data[0 * 4 + 1];
        let b02 = b._data[0 * 4 + 2];
        let b03 = b._data[0 * 4 + 3];
        let b10 = b._data[1 * 4 + 0];
        let b11 = b._data[1 * 4 + 1];
        let b12 = b._data[1 * 4 + 2];
        let b13 = b._data[1 * 4 + 3];
        let b20 = b._data[2 * 4 + 0];
        let b21 = b._data[2 * 4 + 1];
        let b22 = b._data[2 * 4 + 2];
        let b23 = b._data[2 * 4 + 3];
        let b30 = b._data[3 * 4 + 0];
        let b31 = b._data[3 * 4 + 1];
        let b32 = b._data[3 * 4 + 2];
        let b33 = b._data[3 * 4 + 3];
        let a00 = a._data[0 * 4 + 0];
        let a01 = a._data[0 * 4 + 1];
        let a02 = a._data[0 * 4 + 2];
        let a03 = a._data[0 * 4 + 3];
        let a10 = a._data[1 * 4 + 0];
        let a11 = a._data[1 * 4 + 1];
        let a12 = a._data[1 * 4 + 2];
        let a13 = a._data[1 * 4 + 3];
        let a20 = a._data[2 * 4 + 0];
        let a21 = a._data[2 * 4 + 1];
        let a22 = a._data[2 * 4 + 2];
        let a23 = a._data[2 * 4 + 3];
        let a30 = a._data[3 * 4 + 0];
        let a31 = a._data[3 * 4 + 1];
        let a32 = a._data[3 * 4 + 2];
        let a33 = a._data[3 * 4 + 3];

        m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return m;
    }


    public static setLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4x4 {
        let fx: number = center.x - eye.x;
        let fy: number = center.y - eye.y;
        let fz: number = center.x - eye.z;

        let rlf: number = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;


        let sx: number = fy * up.z - fz * up.y;
        let sy: number = fz * up.x - fx * up.z;
        let sz: number = fx * up.y - fy * up.x;


        let rls: number = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;


        let ux: number = sy * fz - sz * fy;
        let uy: number = sz * fx - sx * fz;
        let uz: number = sx * fy - sy * fx;


        let m: Matrix4x4 = new Matrix4x4();
        let e = m.data;
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;

        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;

        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;

        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;

        return Matrix4x4.translation(new Vector3(-eye.x, -eye.y, -eye.z));
    }

    // public static setLookAt(from: Vector3, to: Vector3, tmp: Vector3 = new Vector3(0, 1, 0)): Matrix4x4 {

    //     let forward : Vector3 = from.subtract(to).normalize();
    //     let right : Vector3  =   tmp.normalize().cross(forward);
    //     let up : Vector3 = forward.cross(right);

    //     let m : Matrix4x4 = new Matrix4x4();
    //     let camToWorld = m.data;

    //     camToWorld[0] = right.x;
    //     camToWorld[1] = right.y;
    //     camToWorld[2] = right.z;
    //     camToWorld[4] = up.x;
    //     camToWorld[5] = up.y;
    //     camToWorld[6] = up.z;
    //     camToWorld[8] = forward.x;
    //     camToWorld[9] = forward.y;
    //     camToWorld[10] = forward.z;

    //     camToWorld[11] = from.x;
    //     camToWorld[12] = from.y;
    //     camToWorld[13] = from.z;

    //     return m;
    // }


    public lookAt(eye: Vector3, center: Vector3, up: Vector3) {
        return Matrix4x4.multiply(this, Matrix4x4.setLookAt(eye, center, up));
    }


    public toFloat32Array(): Float32Array {
        return new Float32Array(this._data);
    }


    public copyFrom(m: Matrix4x4): void {
        for (let i = 0; i < 16; ++i) {
            this._data[i] = m._data[i];
        }
    }

    public set(x: number, y: number, v: number): Matrix4x4 {
        this._data[x][y] = v;
        return this;
    }

    public get(x: number, y: number): number {
        return this._data[x][y];
    }
}