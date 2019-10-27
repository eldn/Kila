import { Vector3 } from "../math/Vector3";

//------------------------------------------------------------------------------
// Material Object
//------------------------------------------------------------------------------

class Material {
    public name;
    public color;
    constructor(name, r, g, b, a) {
        this.name = name;
        this.color = new Color(r, g, b, a);
    }
}


//------------------------------------------------------------------------------
// Vertex Object
//------------------------------------------------------------------------------
class Vertex {
    public x;
    public y;
    public z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

//------------------------------------------------------------------------------
// UV Object
//------------------------------------------------------------------------------
class UV {
    public x : number;
    public y : number;
    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}


//------------------------------------------------------------------------------
// Normal Object
//------------------------------------------------------------------------------
class Normal {
    public x;
    public y;
    public z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

//------------------------------------------------------------------------------
// Color Object
//------------------------------------------------------------------------------

class Color {
    public r;
    public g;
    public b;
    public a;
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}


//------------------------------------------------------------------------------
// OBJObject Object
//------------------------------------------------------------------------------

class OBJObject {

    public name;
    public faces;
    public numIndices;

    constructor(name) {
        this.name = name;
        this.faces = new Array(0);
        this.numIndices = 0;
    }

    addFace(face) {
        this.faces.push(face);
        this.numIndices += face.numIndices;
    }
}

//------------------------------------------------------------------------------
// Face Object
//------------------------------------------------------------------------------
class Face {
    public materialName : string;
    public vIndices : Array<any>;
    public nIndices : Array<any>;
    public uvIndices : Array<any>;
    public normal;
    public numIndices;
    constructor(materialName) {
        this.materialName = materialName;
        if (materialName == null) this.materialName = "";
        this.vIndices = new Array(0);
        this.nIndices = new Array(0);
        this.uvIndices = new Array(0);
    }
}

//------------------------------------------------------------------------------
// DrawInfo Object
//------------------------------------------------------------------------------
export class DrawingInfo {
    public vertices : Array<number>;
    public normals : Array<number>;
    public colors : Array<number>;
    public uvs : Array<number>;
    public indices : Array<number>;
    constructor(vertices : Array<number>, normals : Array<number>, colors : Array<number>, uvs : Array<number>, indices : Array<number>) {
        this.vertices = vertices;
        this.normals = normals;
        this.colors = colors;
        this.uvs = uvs;
        this.indices = indices;
    }
}

//------------------------------------------------------------------------------

class StringParser {
    public str;
    public index;

    constructor(str?: string) {
        this.str;   // Store the string specified by the argument
        this.index; // Position in the string to be processed
        this.init(str);
    }

    // Initialize StringParser object
    init(str) {
        this.str = str;
        this.index = 0;
    }

    // Skip delimiters
    skipDelimiters() {
        for (var i = this.index, len = this.str.length; i < len; i++) {
            let c = this.str.charAt(i);
            // Skip TAB, Space, '(', ')
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
            break;
        }
        this.index = i;
    }

    // Get the length of word
    getWordLength(str, start): number {
        let i: number;
        let len: number = str.length;
        for (i = start; i < len; i++) {
            let c: string = str.charAt(i);
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
                break;
        }
        return i - start;
    }

    // Skip to the next word
    skipToNextWord() {
        this.skipDelimiters();
        let n = this.getWordLength(this.str, this.index);
        this.index += (n + 1);
    }

    // Get word
    getWord() : string{
        this.skipDelimiters();
        let n : number = this.getWordLength(this.str, this.index);
        if (n == 0) return null;
        let word : string = this.str.substr(this.index, n);
        this.index += (n + 1);

        return word;
    }

    // Get integer
    getInt() {
        return parseInt(this.getWord());
    }

    // Get floating number
    getFloat() {
        return parseFloat(this.getWord());
    }
}



//------------------------------------------------------------------------------
// MTLDoc Object
//------------------------------------------------------------------------------
export class MTLDoc {
    public complete : boolean;
    public materials : Array<Material>;

    constructor() {
        this.complete = false; // MTL is configured correctly
        this.materials = new Array(0);
    }

    parseNewmtl(sp) : string {
        return sp.getWord();         // Get name
    }

    parseRGB(sp, name) : Material{
        var r = sp.getFloat();
        var g = sp.getFloat();
        var b = sp.getFloat();
        return (new Material(name, r, g, b, 1));
    }
}


//------------------------------------------------------------------------------
// OBJParser
//------------------------------------------------------------------------------

export class OBJDoc {

    public objFileString : string;
    public mtlFileString : string;
    public mtls: Array<MTLDoc>;
    public objects: Array<OBJObject>;
    public vertices: Array<Vertex>;
    public normals: Array<Normal>;
    public uvs : Array<UV>;

    
    constructor(objFileString : string, mtlFileString ?: string) {
        this.objFileString = objFileString;
        this.mtlFileString = mtlFileString;
        this.mtls = new Array(0);      // Initialize the property for MTL
        this.objects = new Array(0);   // Initialize the property for Object
        this.vertices = new Array(0);  // Initialize the property for Vertex
        this.normals = new Array(0);   // Initialize the property for Normal
        this.uvs = new Array(0);
    }

    // Parsing the OBJ file
    parse(scale: number, reverse: boolean) {
        let lines: Array<string> = this.objFileString.split('\n');  // Break up into lines and store them as array
        lines.push(null); // Append null
        let index: number = 0;    // Initialize index of line

        let currentObject: OBJObject = null;
        let currentMaterialName: string = "";

        // Parse line by line
        let line: string;          // A string in the line to be parsed
        let sp = new StringParser();  // Create StringParser
        while ((line = lines[index++]) != null) {
            sp.init(line);                  // init StringParser
            let command = sp.getWord();     // Get command
            if (command == null) continue;  // check null command

            switch (command) {
                case '#':
                    continue;  // Skip comments
                case 'mtllib':     // Read Material chunk
                    let mtl: MTLDoc = new MTLDoc();   // Create MTL instance
                    this.mtls.push(mtl);
                    this.onReadMTLFile(this.mtlFileString, mtl);
                    continue; // Go to the next line
                case 'o':
                case 'g':   // Read Object name
                    let object : OBJObject = this.parseObjectName(sp);
                    this.objects.push(object);
                    currentObject = object;
                    continue; // Go to the next line
                case 'v':   // Read vertex
                    let vertex : Vertex = this.parseVertex(sp, scale);
                    this.vertices.push(vertex);
                    continue; // Go to the next line
                case 'vt':   // Read UV
                    let uv : UV = this.parseUV(sp, scale);
                    this.uvs.push(uv);
                    continue; // Go to the next line
                case 'vn':   // Read normal
                    let normal = this.parseNormal(sp);
                    this.normals.push(normal);
                    continue; // Go to the next line
                case 'usemtl': // Read Material name
                    currentMaterialName = this.parseUsemtl(sp);
                    continue; // Go to the next line
                case 'f': // Read face
                    let face : Face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
                    currentObject.addFace(face);
                    continue; // Go to the next line
            }
        }

        return true;
    }

    // Analyze the material file
    onReadMTLFile(fileString : string, mtl : MTLDoc) {
        let lines : Array<string> = fileString.split('\n');  // Break up into lines and store them as array
        lines.push(null);           // Append null
        let index : number = 0;              // Initialize index of line

        // Parse line by line
        let line : string;      // A string in the line to be parsed
        let name : string = ""; // Material name
        let sp : StringParser = new StringParser();  // Create StringParser
        while ((line = lines[index++]) != null) {
            sp.init(line);                  // init StringParser
            let command : string = sp.getWord();     // Get command
            if (command == null) continue;  // check null command

            switch (command) {
                case '#':
                    continue;    // Skip comments
                case 'newmtl': // Read Material chunk
                    name = mtl.parseNewmtl(sp);    // Get name
                    continue; // Go to the next line
                case 'Kd':   // Read normal
                    if (name == "") continue; // Go to the next line because of Error
                    let material : Material = mtl.parseRGB(sp, name);
                    mtl.materials.push(material);
                    name = "";
                    continue; // Go to the next line
            }
        }
        mtl.complete = true;
    }

    parseMtllib(sp : StringParser, fileName : string) : string {
        // Get directory path
        let i : number = fileName.lastIndexOf("/");
        let dirPath : string = "";
        if (i > 0) dirPath = fileName.substr(0, i + 1);

        return dirPath + sp.getWord();   // Get path
    }

    parseObjectName(sp) : OBJObject {
        let name = sp.getWord();
        return (new OBJObject(name));
    }

    parseVertex(sp, scale) : Vertex{
        let x = sp.getFloat() * scale;
        let y = sp.getFloat() * scale;
        let z = sp.getFloat() * scale;
        return (new Vertex(x, y, z));
    }

    parseUV(sp, scale) : UV{
        let x : number = sp.getFloat() * scale;
        let y : number = sp.getFloat() * scale;
        return (new UV(x, y));
    }

    parseNormal(sp) : Normal {
        let x = sp.getFloat();
        let y = sp.getFloat();
        let z = sp.getFloat();
        return (new Normal(x, y, z));
    }

    parseUsemtl(sp) : string{
        return sp.getWord();
    }

    calcNormal(p0, p1, p2) {
        // v0: a vector from p1 to p0, v1; a vector from p1 to p2
        let v0 = new Float32Array(3);
        let v1 = new Float32Array(3);
        for (let i = 0; i < 3; i++) {
            v0[i] = p0[i] - p1[i];
            v1[i] = p2[i] - p1[i];
        }
    
        // The cross product of v0 and v1
        let c = new Float32Array(3);
        c[0] = v0[1] * v1[2] - v0[2] * v1[1];
        c[1] = v0[2] * v1[0] - v0[0] * v1[2];
        c[2] = v0[0] * v1[1] - v0[1] * v1[0];
    
        // Normalize the result
        let v = new Vector3(c[0], c[1], c[2]);
        v.normalize();
        return v.toArray();
    }

    parseFace(sp : StringParser, materialName : string, vertices : Array<Vertex>, reverse : boolean) : Face{
        let face : Face = new Face(materialName);
        // get indices
        for (; ;) {
            let word : string = sp.getWord();
            if (word == null) break;
            let subWords : Array<string> = word.split('/');

            if (subWords.length >= 1) {
                let vi : number = parseInt(subWords[0]) - 1;
                face.vIndices.push(vi);
            }

            if (subWords.length >= 3) {

                // uv
                if(subWords[1] != ""){
                    let uvi : number = parseInt(subWords[1]) - 1;
                    face.uvIndices.push(uvi);
                } else {
                    face.uvIndices.push(-1);
                }

                // normal
                let ni : number = parseInt(subWords[2]) - 1;
                face.nIndices.push(ni);

            } else {
                face.nIndices.push(-1);
            }
        }

        // calc normal
        let v0 = [
            vertices[face.vIndices[0]].x,
            vertices[face.vIndices[0]].y,
            vertices[face.vIndices[0]].z];
        let v1 = [
            vertices[face.vIndices[1]].x,
            vertices[face.vIndices[1]].y,
            vertices[face.vIndices[1]].z];
        let v2 = [
            vertices[face.vIndices[2]].x,
            vertices[face.vIndices[2]].y,
            vertices[face.vIndices[2]].z];

        // 面の法線を計算してnormalに設定
        let normal = this.calcNormal(v0, v1, v2);
        // 法線が正しく求められたか調べる
        if (normal == null) {
            if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
                let v3 = [
                    vertices[face.vIndices[3]].x,
                    vertices[face.vIndices[3]].y,
                    vertices[face.vIndices[3]].z];
                normal = this.calcNormal(v1, v2, v3);
            }
            if (normal == null) {         // 法線が求められなかったのでY軸方向の法線とする
                normal = [0.0, 1.0, 0.0];
            }
        }
        if (reverse) {
            normal[0] = -normal[0];
            normal[1] = -normal[1];
            normal[2] = -normal[2];
        }
        face.normal = new Normal(normal[0], normal[1], normal[2]);


        // Devide to triangles if face contains over 3 points.
        if (face.vIndices.length > 3) {
            let n = face.vIndices.length - 2;
            let newVIndices = new Array(n * 3);
            let newNIndices = new Array(n * 3);
            let newUVIndices = new Array(n * 3);
            for (let i = 0; i < n; i++) {
                newVIndices[i * 3 + 0] = face.vIndices[0];
                newVIndices[i * 3 + 1] = face.vIndices[i + 1];
                newVIndices[i * 3 + 2] = face.vIndices[i + 2];

                newNIndices[i * 3 + 0] = face.nIndices[0];
                newNIndices[i * 3 + 1] = face.nIndices[i + 1];
                newNIndices[i * 3 + 2] = face.nIndices[i + 2];

                newUVIndices[i * 3 + 0] = face.uvIndices[0];
                newUVIndices[i * 3 + 1] = face.uvIndices[i + 1];
                newUVIndices[i * 3 + 2] = face.uvIndices[i + 2];
            }
            face.vIndices = newVIndices;
            face.nIndices = newNIndices;
            face.uvIndices = newUVIndices;
        }
        face.numIndices = face.vIndices.length;

        return face;
    }

    // Check Materials
    isMTLComplete() {
        if (this.mtls.length == 0) return true;
        for (let i = 0; i < this.mtls.length; i++) {
            if (!this.mtls[i].complete) return false;
        }
        return true;
    }

    // Find color by material name
    findColor(name) {
        for (let i = 0; i < this.mtls.length; i++) {
            for (let j = 0; j < this.mtls[i].materials.length; j++) {
                if (this.mtls[i].materials[j].name == name) {
                    return (this.mtls[i].materials[j].color)
                }
            }
        }
        return (new Color(0.8, 0.8, 0.8, 1));
    }

    //------------------------------------------------------------------------------
    // Retrieve the information for drawing 3D model
    getDrawingInfo() : DrawingInfo{
        // Create an arrays for vertex coordinates, normals, colors, and indices
        let numIndices = 0;
        for (let i = 0; i < this.objects.length; i++) {
            numIndices += this.objects[i].numIndices;
        }
        let numVertices = numIndices;
        let vertices = new Array<number>(numVertices * 3);
        let normals = new Array<number>(numVertices * 3);
        let colors = new Array<number>(numVertices * 4);
        let indices = new Array<number>(numIndices);
        let uvs : Array<number> = new Array<number>(numIndices * 2);

        // Set vertex, normal and color
        let index_indices = 0;
        for (let i = 0; i < this.objects.length; i++) {
            let object : OBJObject = this.objects[i];
            for (let j = 0; j < object.faces.length; j++) {

                let face : Face = object.faces[j];
                let color : Color = this.findColor(face.materialName);
                let faceNormal : Normal = face.normal;
               
                for (let k : number = 0; k < face.vIndices.length; k++) {

                    // Set index
                    indices[index_indices] = index_indices;

                    // Copy vertex
                    let vIdx = face.vIndices[k];
                    let vertex = this.vertices[vIdx];
                    vertices[index_indices * 3 + 0] = vertex.x;
                    vertices[index_indices * 3 + 1] = vertex.y;
                    vertices[index_indices * 3 + 2] = vertex.z;

                    // Copy color
                    colors[index_indices * 4 + 0] = color.r;
                    colors[index_indices * 4 + 1] = color.g;
                    colors[index_indices * 4 + 2] = color.b;
                    colors[index_indices * 4 + 3] = color.a;

                    // Copy uv
                    let uvIdx : number = face.uvIndices[k];
                    if(uvIdx != -1){
                        let uv : UV = this.uvs[uvIdx];
                        uvs[index_indices * 2 + 0] = uv.x;
                        uvs[index_indices * 2 + 1] = uv.y;
                    }

                    // Copy normal
                    let nIdx = face.nIndices[k];
                    if (nIdx >= 0) {
                        let normal = this.normals[nIdx];
                        normals[index_indices * 3 + 0] = normal.x;
                        normals[index_indices * 3 + 1] = normal.y;
                        normals[index_indices * 3 + 2] = normal.z;
                    } else {
                        normals[index_indices * 3 + 0] = faceNormal.x;
                        normals[index_indices * 3 + 1] = faceNormal.y;
                        normals[index_indices * 3 + 2] = faceNormal.z;
                    }
                    index_indices++;
                }
            }
        }

        return new DrawingInfo(vertices, normals, colors, uvs, indices);
    }

}


