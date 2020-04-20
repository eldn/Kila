import { TObject } from "../objects/Object";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Transform } from "../math/Transform";
import { Shader } from "../gl/shaders/Shader";
import { Vector3 } from "../math/Vector3";
import { SceneGraph } from "./SceneGraph";
import { IComponent } from "../components/IComponent";
import { IBehavior } from "../behaviors/IBehavior";
import { Quaternion } from "../math/Quaternion";
import { JsonAsset } from "../assets/JsonAssetLoader";

const v3_a = new Vector3();
const q_a = new Quaternion();

export class GameObject extends TObject {

    private _children: GameObject[] = [];
    private _parent: GameObject;
    private _isLoaded: boolean = false;
    private _sceneGraph: SceneGraph;
    private _components: IComponent[] = [];
    private _behaviors: IBehavior[] = [];
    private _isVisible: boolean = true;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    public name: string;

    /** The transform of this entity. */
    public transform: Transform = new Transform();

    /**
     * Creates a new entity.
     * @param name The name of this entity.
     */
    public constructor(name: string) {
        super();
        this.name = name;
    }

    /** Returns the parent of this entity. */
    public get parent(): GameObject {
        return this._parent;
    }

    /** Returns the world transformation matrix of this entity. */
    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    /** Indicates if this entity has been loaded. */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    /** Indicates if this entity is currently visible. */
    public get isVisible(): boolean {
        return this._isVisible;
    }

    /** Sets visibility of this entity. */
    public set isVisible(value: boolean) {
        this._isVisible = value;
    }

    /**
     * Adds the provided entity as a child of this one.
     * @param child The child to be added.
     */
    public addChild(child: GameObject): void {
        child._parent = this;
        this._children.push(child);
        child.onAdded(this._sceneGraph);
    }

    /**
     * Attempts to remove the provided entity as a child of this one, if it is in fact 
     * a child of this entity. Otherwise, nothing happens.
     * @param child The child to be added.
     */
    public removeChild(child: GameObject): void {
        let index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = undefined;
            this._children.splice(index, 1);
        }
    }

    protected static _findComponent (node: GameObject, constructor: Function) {
        // const cls = constructor as any;
        const comps = node._components;
        // if (cls._sealed) {
        //     for (let i = 0; i < comps.length; ++i) {
        //         const comp = comps[i];
        //         if (comp.constructor === constructor) {
        //             return comp;
        //         }
        //     }
        // } else {
            for (let i = 0; i < comps.length; ++i) {
                const comp = comps[i];
                if (comp instanceof constructor) {
                    return comp;
                }
            }
        // }
        return null;
    }

    protected static _findComponents ( node: GameObject, constructor: Function, components: IComponent[]) {
        // const cls = constructor as any;
        const comps = node._components;
        // if (cls._sealed) {
        //     for (let i = 0; i < comps.length; ++i) {
        //         const comp = comps[i];
        //         if (comp.constructor === constructor) {
        //             components.push(comp);
        //         }
        //     }
        // } else {
            for (let i = 0; i < comps.length; ++i) {
                const comp = comps[i];
                if (comp instanceof constructor) {
                    components.push(comp);
                }
            }
        // }
    }


    protected static _findChildComponent (children: GameObject[], constructor) {
        for (let i = 0; i < children.length; ++i) {
            const node = children[i];
            let comp = GameObject._findComponent(node, constructor);
            if (comp) {
                return comp;
            } else if (node._children.length > 0) {
                comp = GameObject._findChildComponent(node._children, constructor);
                if (comp) {
                    return comp;
                }
            }
        }
        return null;
    }

    protected static _findChildComponents (children: GameObject[], constructor, components) {
        for (let i = 0; i < children.length; ++i) {
            const node = children[i];
            GameObject._findComponents(node, constructor, components);
            if (node._children.length > 0) {
                GameObject._findChildComponents(node._children, constructor, components);
            }
        }
    }

    public getComponent<T extends IComponent> (classConstructor: Constructor<T>): T | null;
    public getComponent (typeOrClassName: Function) {
        const constructor = typeOrClassName;
        if (constructor) {
            return GameObject._findComponent(this, constructor);
        }
        return null;
    }


    public getComponents<T extends IComponent> (classConstructor: Constructor<T>): T[];
    public getComponents(typeOrClassName : Function) : IComponent[]{
        const constructor = typeOrClassName;
        const components: IComponent[] = [];
        if (constructor) {
            GameObject._findComponents(this, constructor, components);
        }
        return components;
    }


    public getComponentInChildren<T extends IComponent> (classConstructor: Constructor<T>): T | null;
    public getComponentInChildren (typeOrClassName: Function) {
        const constructor = typeOrClassName;
        if (constructor) {
            return GameObject._findChildComponent(this._children, constructor);
        }
        return null;
    }


    public getComponentsInChildren<T extends IComponent> (classConstructor: Constructor<T>): T[];
    
    public getComponentsInChildren (typeOrClassName: Function) {
        const constructor = typeOrClassName;
        const components: IComponent[] = [];
        if (constructor) {
            GameObject._findComponents(this, constructor, components);
            GameObject._findChildComponents(this._children, constructor, components);
        }
        return components;
    }


    /**
    * Recursively attempts to retrieve a behavior with the given name from this entity or its children.
    * @param name The name of the behavior to retrieve.
    */
    public getBehaviorByName(name: string): IBehavior {
        for (let behavior of this._behaviors) {
            if (behavior.name === name) {
                return behavior;
            }
        }

        for (let child of this._children) {
            let behavior = child.getBehaviorByName(name);
            if (behavior !== undefined) {
                return behavior;
            }
        }

        return undefined;
    }

    /**
    * Recursively attempts to retrieve a child entity with the given name from this entity or its children.
    * @param name The name of the entity to retrieve.
    */
    public getEntityByName(name: string): GameObject {
        if (this.name === name) {
            return this;
        }

        for (let child of this._children) {
            let result = child.getEntityByName(name);
            if (result !== undefined) {
                return result;
            }
        }

        return undefined;
    }

    /**
     * Adds the given component to this entity.
     * @param component The component to be added.
     */
    public addComponent(component: IComponent): void {
        this._components.push(component);
        component.setOwner(this);

        
    }

    /**
     * Adds the given behavior to this entity.
     * @param behavior The behavior to be added.
     */
    public addBehavior(behavior: IBehavior): void {
        this._behaviors.push(behavior);
        behavior.setOwner(this);
    }

    /** Performs loading procedures on this entity. */
    public load(): void {
        this._isLoaded = true;

        for (let c of this._components) {
            c.load();
        }

        for (let c of this._children) {
            c.load();
        }
    }

    /** Performs pre-update procedures on this entity. */
    public updateReady(): void {
        for (let c of this._components) {
            c.updateReady();
        }

        for (let b of this._behaviors) {
            b.updateReady();
        }

        for (let c of this._children) {
            c.updateReady();
        }
    }

    /**
     * Performs update procedures on this entity (recurses through children, 
     * components and behaviors as well).
     * @param time The delta time in milliseconds since the last update call.
     */
    public update(time: number): void {

        this._localMatrix = this.transform.getTransformationMatrix();
        this.updateWorldMatrix((this._parent !== undefined) ? this._parent.worldMatrix : undefined);

        for (let c of this._components) {
            c.update(time);
        }

        for (let b of this._behaviors) {
            b.update(time);
        }

        for (let c of this._children) {
            c.update(time);
        }
    }

    /**
     * Renders this entity and its children.
     * @param shader The shader to use when rendering/
     */
    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        if (!this._isVisible) {
            return;
        }

        for (let c of this._components) {
            c.render(shader, projection, viewMatrix);
        }

        for (let c of this._children) {
            c.render(shader, projection, viewMatrix);
        }
    }

    /** Returns the world position of this entity. */
    public getWorldPosition(out ?: Vector3): Vector3 {
        if(out){
            out.x = this._worldMatrix.data[12];
            out.y = this._worldMatrix.data[13];
            out.z = this._worldMatrix.data[14];
            return out;
        } else {
            return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14]);
        }
    }

    /**
     * Called when this entity is added to a scene graph.
     * @param sceneGraph The scenegraph to which this entity was added.
     */
    protected onAdded(sceneGraph: SceneGraph): void {
        this._sceneGraph = sceneGraph;
    }

    private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
        if (parentWorldMatrix !== undefined) {
            this._worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
        } else {
            this._worldMatrix.copyFrom(this._localMatrix);
        }
    }

     /**
     * @zh
     * 设置当前节点旋转为面向目标位置
     * @param pos 目标位置
     * @param up 坐标系的上方向
     */
    public lookAt (pos: Vector3, up?: Vector3): void {
        v3_a.copyFrom(this.getWorldPosition());
        Vector3.subtract(v3_a, v3_a, pos); // we use -z for view-dir
        Vector3.normalize(v3_a, v3_a);
        Quaternion.fromViewUp(q_a, v3_a, up);
        this.setWorldRotation(q_a);
    }

        /**
     * @zh
     * 设置世界旋转
     * @param rotation 目标世界旋转
     */
    public setWorldRotation (rotation: Quaternion): void{
       
        // Quaternion.copy(this._rot, rotation);
        
        // if (this._parent) {
        //     Quaternion.multiply(this._lrot, Quaternion.conjugate(this._lrot, this._parent._rot), this._rot);
        // } else {
        //     Quaternion.copy(this._lrot, this._rot);
        // }
      
    }
}