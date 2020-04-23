import { TObject } from "../objects/Object";
import { Transform } from "../math/Transform";
import { Shader } from "../gl/shaders/Shader";
import { Vector3 } from "../math/Vector3";
import { SceneGraph } from "./SceneGraph";
import { IComponent } from "../components/IComponent";
import { IBehavior } from "../behaviors/IBehavior";
import { Matrix4 } from "../math/Matrix4";

const defaultUp = new Vector3(0, 1, 0);
const tempMatrix4 = new Matrix4();

export class GameObject extends TObject {

    private _children: GameObject[] = [];
    private _parent: GameObject;
    private _isLoaded: boolean = false;
    private _sceneGraph: SceneGraph;
    private _components: IComponent[] = [];
    private _behaviors: IBehavior[] = [];
    private _isVisible: boolean = true;

    private _localMatrix: Matrix4 = new Matrix4();
    private _worldMatrix: Matrix4 = new Matrix4();

    public name: string;

    /** The transform of this entity. */
    public transform: Transform = new Transform();

    
        /**
     * 元素的up向量
     * @type {Vector3}
     */

    protected up : Vector3;

    /**
     * Creates a new entity.
     * @param name The name of this entity.
     */
    constructor(name: string) {
        super();
        this.name = name;

        this.up = defaultUp.clone();
    }

    /** Returns the parent of this entity. */
    public get parent(): GameObject {
        return this._parent;
    }

    /** Returns the world transformation matrix of this entity. */
    public get worldMatrix(): Matrix4 {
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

        this._localMatrix.copy(this.transform.matrix);
        this.updateWorldMatrix();

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
    public render(shader: Shader, projection : Matrix4, viewMatrix : Matrix4): void {
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
            out.x = this._worldMatrix.elements[12];
            out.y = this._worldMatrix.elements[13];
            out.z = this._worldMatrix.elements[14];
            return out;
        } else {
            return new Vector3(this._worldMatrix.elements[12], this._worldMatrix.elements[13], this._worldMatrix.elements[14]);
        }
    }

    /**
     * Called when this entity is added to a scene graph.
     * @param sceneGraph The scenegraph to which this entity was added.
     */
    protected onAdded(sceneGraph: SceneGraph): void {
        this._sceneGraph = sceneGraph;
    }

    protected updateWorldMatrix(): void {

        let parentWorldMatrix : Matrix4 = (this._parent !== undefined) ? this._parent.worldMatrix : undefined
        if (parentWorldMatrix !== undefined) {
            this._worldMatrix = parentWorldMatrix.multiply( this._localMatrix);
        } else {
            this._worldMatrix.copy(this._localMatrix);
        }
    }


    
     /**
     * 改变元素的朝向
     * @param {Node|Object|Vector3} node 需要朝向的元素，或者坐标
     * @return {Node} this
     */
    lookAt(obj : GameObject) {
        tempMatrix4.targetTo(obj, this, this.up);
        this.transform.quaternion.fromMat4(tempMatrix4);
        return this;
    }

}