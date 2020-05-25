declare namespace kila {
    export class Camera extends GameObject {
        /**
         * 相对于摄像头的矩阵
         * @type {Matrix4}
         */
        viewMatrix: Matrix4;
        /**
         * 投影矩阵
         * @type {Matrix4}
         */
        projectionMatrix: Matrix4;
        /**
         * View 联结投影矩阵
         * @type {Matrix4}
         */
        viewProjectionMatrix: Matrix4;
        /**
         * 是否需要更新投影矩阵
         * @private
         * @default true
         * @type {Boolean}
         */
        _needUpdateProjectionMatrix: boolean;
        _isGeometryDirty: boolean;
        getClassName(): string;
        constructor();
        /**
         * 更新viewMatrix
         * @return {Camera} this
         */
        updateViewMatrix(): this;
        /**
         * 更新投影矩阵，子类必须重载这个方法
         */
        updateProjectionMatrix(): void;
        /**
         * 更新viewProjectionMatrix
         * @return {Camera} this
         */
        updateViewProjectionMatrix(): this;
        /**
         * 获取元素相对于当前Camera的矩阵
         * @param {Node} node 目标元素
         * @param {Matrix4} [out] 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
         * @return {Matrix4} 返回获取的矩阵
         */
        getModelViewMatrix(node: GameObject, out?: Matrix4): Matrix4;
        /**
         * 获取元素的投影矩阵
         * @param {Node} node 目标元素
         * @param {Matrix4} [out] 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
         * @return {Matrix4} 返回获取的矩阵
         */
        getModelProjectionMatrix(node: GameObject, out?: Matrix4): Matrix4;
    }
    export class PerspectiveCamera extends Camera {
        constructor();
        getClassName(): string;
        get near(): number;
        set near(value: number);
        get far(): number;
        set far(value: number);
        get fov(): number;
        set fov(value: number);
        get aspect(): number;
        set aspect(value: number);
        /**
         * 更新投影矩阵
         */
        updateProjectionMatrix(): void;
        radians(degrees: number): number;
    }
    var glConstants: {
        ACTIVE_ATTRIBUTES: number;
        ACTIVE_ATTRIBUTE_MAX_LENGTH: number;
        ACTIVE_TEXTURE: number;
        ACTIVE_UNIFORMS: number;
        ACTIVE_UNIFORM_MAX_LENGTH: number;
        ALIASED_LINE_WIDTH_RANGE: number;
        ALIASED_POINT_SIZE_RANGE: number;
        ALPHA: number;
        ALPHA_BITS: number;
        ALWAYS: number;
        ARRAY_BUFFER: number;
        ARRAY_BUFFER_BINDING: number;
        ATTACHED_SHADERS: number;
        BACK: number;
        BLEND: number;
        BLEND_COLOR: number;
        BLEND_DST_ALPHA: number;
        BLEND_DST_RGB: number;
        BLEND_EQUATION: number;
        BLEND_EQUATION_ALPHA: number;
        BLEND_EQUATION_RGB: number;
        BLEND_SRC_ALPHA: number;
        BLEND_SRC_RGB: number;
        BLUE_BITS: number;
        BOOL: number;
        BOOL_VEC2: number;
        BOOL_VEC3: number;
        BOOL_VEC4: number;
        BROWSER_DEFAULT_WEBGL: number;
        BUFFER_SIZE: number;
        BUFFER_USAGE: number;
        BYTE: number;
        CCW: number;
        CLAMP_TO_EDGE: number;
        COLOR_ATTACHMENT0: number;
        COLOR_BUFFER_BIT: number;
        COLOR_CLEAR_VALUE: number;
        COLOR_WRITEMASK: number;
        COMPILE_STATUS: number;
        COMPRESSED_TEXTURE_FORMATS: number;
        CONSTANT_ALPHA: number;
        CONSTANT_COLOR: number;
        CONTEXT_LOST_WEBGL: number;
        CULL_FACE: number;
        CULL_FACE_MODE: number;
        CURRENT_PROGRAM: number;
        CURRENT_VERTEX_ATTRIB: number;
        CW: number;
        DECR: number;
        DECR_WRAP: number;
        DELETE_STATUS: number;
        DEPTH_ATTACHMENT: number;
        DEPTH_BITS: number;
        DEPTH_BUFFER_BIT: number;
        DEPTH_CLEAR_VALUE: number;
        DEPTH_COMPONENT: number;
        DEPTH_COMPONENT16: number;
        DEPTH_FUNC: number;
        DEPTH_RANGE: number;
        DEPTH_STENCIL: number;
        DEPTH_STENCIL_ATTACHMENT: number;
        DEPTH_TEST: number;
        DEPTH_WRITEMASK: number;
        DITHER: number;
        DONT_CARE: number;
        DST_ALPHA: number;
        DST_COLOR: number;
        DYNAMIC_DRAW: number;
        ELEMENT_ARRAY_BUFFER: number;
        ELEMENT_ARRAY_BUFFER_BINDING: number;
        EQUAL: number;
        FASTEST: number;
        FLOAT: number;
        FLOAT_MAT2: number;
        FLOAT_MAT3: number;
        FLOAT_MAT4: number;
        FLOAT_VEC2: number;
        FLOAT_VEC3: number;
        FLOAT_VEC4: number;
        FRAGMENT_SHADER: number;
        FRAMEBUFFER: number;
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
        FRAMEBUFFER_BINDING: number;
        FRAMEBUFFER_COMPLETE: number;
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
        FRAMEBUFFER_UNSUPPORTED: number;
        FRONT: number;
        FRONT_AND_BACK: number;
        FRONT_FACE: number;
        FUNC_ADD: number;
        FUNC_REVERSE_SUBTRACT: number;
        FUNC_SUBTRACT: number;
        GENERATE_MIPMAP_HINT: number;
        GEQUAL: number;
        GREATER: number;
        GREEN_BITS: number;
        HIGH_FLOAT: number;
        HIGH_INT: number;
        INCR: number;
        INCR_WRAP: number;
        INFO_LOG_LENGTH: number;
        INT: number;
        INT_VEC2: number;
        INT_VEC3: number;
        INT_VEC4: number;
        INVALID_ENUM: number;
        INVALID_FRAMEBUFFER_OPERATION: number;
        INVALID_OPERATION: number;
        INVALID_VALUE: number;
        INVERT: number;
        KEEP: number;
        LEQUAL: number;
        LESS: number;
        LINEAR: number;
        LINEAR_MIPMAP_LINEAR: number;
        LINEAR_MIPMAP_NEAREST: number;
        LINES: number;
        LINE_LOOP: number;
        LINE_STRIP: number;
        LINE_WIDTH: number;
        LINK_STATUS: number;
        LOW_FLOAT: number;
        LOW_INT: number;
        LUMINANCE: number;
        LUMINANCE_ALPHA: number;
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
        MAX_CUBE_MAP_TEXTURE_SIZE: number;
        MAX_FRAGMENT_UNIFORM_VECTORS: number;
        MAX_RENDERBUFFER_SIZE: number;
        MAX_TEXTURE_IMAGE_UNITS: number;
        MAX_TEXTURE_SIZE: number;
        MAX_VARYING_VECTORS: number;
        MAX_VERTEX_ATTRIBS: number;
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
        MAX_VERTEX_UNIFORM_VECTORS: number;
        MAX_VIEWPORT_DIMS: number;
        MEDIUM_FLOAT: number;
        MEDIUM_INT: number;
        MIRRORED_REPEAT: number;
        NEAREST: number;
        NEAREST_MIPMAP_LINEAR: number;
        NEAREST_MIPMAP_NEAREST: number;
        NEVER: number;
        NICEST: number;
        NONE: number;
        NOTEQUAL: number;
        NO_ERROR: number;
        NUM_COMPRESSED_TEXTURE_FORMATS: number;
        ONE: number;
        ONE_MINUS_CONSTANT_ALPHA: number;
        ONE_MINUS_CONSTANT_COLOR: number;
        ONE_MINUS_DST_ALPHA: number;
        ONE_MINUS_DST_COLOR: number;
        ONE_MINUS_SRC_ALPHA: number;
        ONE_MINUS_SRC_COLOR: number;
        OUT_OF_MEMORY: number;
        PACK_ALIGNMENT: number;
        POINTS: number;
        POLYGON_OFFSET_FACTOR: number;
        POLYGON_OFFSET_FILL: number;
        POLYGON_OFFSET_UNITS: number;
        RED_BITS: number;
        RENDERBUFFER: number;
        RENDERBUFFER_ALPHA_SIZE: number;
        RENDERBUFFER_BINDING: number;
        RENDERBUFFER_BLUE_SIZE: number;
        RENDERBUFFER_DEPTH_SIZE: number;
        RENDERBUFFER_GREEN_SIZE: number;
        RENDERBUFFER_HEIGHT: number;
        RENDERBUFFER_INTERNAL_FORMAT: number;
        RENDERBUFFER_RED_SIZE: number;
        RENDERBUFFER_STENCIL_SIZE: number;
        RENDERBUFFER_WIDTH: number;
        RENDERER: number;
        REPEAT: number;
        REPLACE: number;
        RGB: number;
        RGB5_A1: number;
        RGB565: number;
        RGBA: number;
        RGBA4: number;
        SAMPLER_2D: number;
        SAMPLER_CUBE: number;
        SAMPLES: number;
        SAMPLE_ALPHA_TO_COVERAGE: number;
        SAMPLE_BUFFERS: number;
        SAMPLE_COVERAGE: number;
        SAMPLE_COVERAGE_INVERT: number;
        SAMPLE_COVERAGE_VALUE: number;
        SCISSOR_BOX: number;
        SCISSOR_TEST: number;
        SHADER_COMPILER: number;
        SHADER_SOURCE_LENGTH: number;
        SHADER_TYPE: number;
        SHADING_LANGUAGE_VERSION: number;
        SHORT: number;
        SRC_ALPHA: number;
        SRC_ALPHA_SATURATE: number;
        SRC_COLOR: number;
        STATIC_DRAW: number;
        STENCIL_ATTACHMENT: number;
        STENCIL_BACK_FAIL: number;
        STENCIL_BACK_FUNC: number;
        STENCIL_BACK_PASS_DEPTH_FAIL: number;
        STENCIL_BACK_PASS_DEPTH_PASS: number;
        STENCIL_BACK_REF: number;
        STENCIL_BACK_VALUE_MASK: number;
        STENCIL_BACK_WRITEMASK: number;
        STENCIL_BITS: number;
        STENCIL_BUFFER_BIT: number;
        STENCIL_CLEAR_VALUE: number;
        STENCIL_FAIL: number;
        STENCIL_FUNC: number;
        STENCIL_INDEX: number;
        STENCIL_INDEX8: number;
        STENCIL_PASS_DEPTH_FAIL: number;
        STENCIL_PASS_DEPTH_PASS: number;
        STENCIL_REF: number;
        STENCIL_TEST: number;
        STENCIL_VALUE_MASK: number;
        STENCIL_WRITEMASK: number;
        STREAM_DRAW: number;
        SUBPIXEL_BITS: number;
        TEXTURE: number;
        TEXTURE0: number;
        TEXTURE1: number;
        TEXTURE2: number;
        TEXTURE3: number;
        TEXTURE4: number;
        TEXTURE5: number;
        TEXTURE6: number;
        TEXTURE7: number;
        TEXTURE8: number;
        TEXTURE9: number;
        TEXTURE10: number;
        TEXTURE11: number;
        TEXTURE12: number;
        TEXTURE13: number;
        TEXTURE14: number;
        TEXTURE15: number;
        TEXTURE16: number;
        TEXTURE17: number;
        TEXTURE18: number;
        TEXTURE19: number;
        TEXTURE20: number;
        TEXTURE21: number;
        TEXTURE22: number;
        TEXTURE23: number;
        TEXTURE24: number;
        TEXTURE25: number;
        TEXTURE26: number;
        TEXTURE27: number;
        TEXTURE28: number;
        TEXTURE29: number;
        TEXTURE30: number;
        TEXTURE31: number;
        TEXTURE_2D: number;
        TEXTURE_BINDING_2D: number;
        TEXTURE_BINDING_CUBE_MAP: number;
        TEXTURE_CUBE_MAP: number;
        TEXTURE_CUBE_MAP_NEGATIVE_X: number;
        TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
        TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
        TEXTURE_CUBE_MAP_POSITIVE_X: number;
        TEXTURE_CUBE_MAP_POSITIVE_Y: number;
        TEXTURE_CUBE_MAP_POSITIVE_Z: number;
        TEXTURE_MAG_FILTER: number;
        TEXTURE_MIN_FILTER: number;
        TEXTURE_WRAP_S: number;
        TEXTURE_WRAP_T: number;
        TRIANGLES: number;
        TRIANGLE_FAN: number;
        TRIANGLE_STRIP: number;
        UNPACK_ALIGNMENT: number;
        UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
        UNPACK_FLIP_Y_WEBGL: number;
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
        UNSIGNED_BYTE: number;
        UNSIGNED_INT: number;
        UNSIGNED_SHORT: number;
        UNSIGNED_SHORT_4_4_4_4: number;
        UNSIGNED_SHORT_5_5_5_1: number;
        UNSIGNED_SHORT_5_6_5: number;
        VALIDATE_STATUS: number;
        VENDOR: number;
        VERSION: number;
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;
        VERTEX_ATTRIB_ARRAY_ENABLED: number;
        VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
        VERTEX_ATTRIB_ARRAY_POINTER: number;
        VERTEX_ATTRIB_ARRAY_SIZE: number;
        VERTEX_ATTRIB_ARRAY_STRIDE: number;
        VERTEX_ATTRIB_ARRAY_TYPE: number;
        VERTEX_SHADER: number;
        VIEWPORT: number;
        ZERO: number;
    };
    var glExtensionsConstant: {
        VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: number;
        UNMASKED_VENDOR_WEBGL: number;
        UNMASKED_RENDERER_WEBGL: number;
        MAX_TEXTURE_MAX_ANISOTROPY_EXT: number;
        TEXTURE_MAX_ANISOTROPY_EXT: number;
        COMPRESSED_RGB_S3TC_DXT1_EXT: number;
        COMPRESSED_RGBA_S3TC_DXT1_EXT: number;
        COMPRESSED_RGBA_S3TC_DXT3_EXT: number;
        COMPRESSED_RGBA_S3TC_DXT5_EXT: number;
        COMPRESSED_R11_EAC: number;
        COMPRESSED_SIGNED_R11_EAC: number;
        COMPRESSED_RG11_EAC: number;
        COMPRESSED_SIGNED_RG11_EAC: number;
        COMPRESSED_RGB8_ETC2: number;
        COMPRESSED_RGBA8_ETC2_EAC: number;
        COMPRESSED_SRGB8_ETC2: number;
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: number;
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: number;
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: number;
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG: number;
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG: number;
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
        COMPRESSED_RGB_ETC1_WEBGL: number;
        COMPRESSED_RGB_ATC_WEBGL: number;
        COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: number;
        COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: number;
        UNSIGNED_INT_24_8_WEBGL: number;
        HALF_FLOAT_OES: number;
        RGBA32F_EXT: number;
        RGB32F_EXT: number;
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: number;
        UNSIGNED_NORMALIZED_EXT: number;
        MIN_EXT: number;
        MAX_EXT: number;
        SRGB_EXT: number;
        SRGB_ALPHA_EXT: number;
        SRGB8_ALPHA8_EXT: number;
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: number;
        FRAGMENT_SHADER_DERIVATIVE_HINT_OES: number;
        COLOR_ATTACHMENT0_WEBGL: number;
        COLOR_ATTACHMENT1_WEBGL: number;
        COLOR_ATTACHMENT2_WEBGL: number;
        COLOR_ATTACHMENT3_WEBGL: number;
        COLOR_ATTACHMENT4_WEBGL: number;
        COLOR_ATTACHMENT5_WEBGL: number;
        COLOR_ATTACHMENT6_WEBGL: number;
        COLOR_ATTACHMENT7_WEBGL: number;
        COLOR_ATTACHMENT8_WEBGL: number;
        COLOR_ATTACHMENT9_WEBGL: number;
        COLOR_ATTACHMENT10_WEBGL: number;
        COLOR_ATTACHMENT11_WEBGL: number;
        COLOR_ATTACHMENT12_WEBGL: number;
        COLOR_ATTACHMENT13_WEBGL: number;
        COLOR_ATTACHMENT14_WEBGL: number;
        COLOR_ATTACHMENT15_WEBGL: number;
        DRAW_BUFFER0_WEBGL: number;
        DRAW_BUFFER1_WEBGL: number;
        DRAW_BUFFER2_WEBGL: number;
        DRAW_BUFFER3_WEBGL: number;
        DRAW_BUFFER4_WEBGL: number;
        DRAW_BUFFER5_WEBGL: number;
        DRAW_BUFFER6_WEBGL: number;
        DRAW_BUFFER7_WEBGL: number;
        DRAW_BUFFER8_WEBGL: number;
        DRAW_BUFFER9_WEBGL: number;
        DRAW_BUFFER10_WEBGL: number;
        DRAW_BUFFER11_WEBGL: number;
        DRAW_BUFFER12_WEBGL: number;
        DRAW_BUFFER13_WEBGL: number;
        DRAW_BUFFER14_WEBGL: number;
        DRAW_BUFFER15_WEBGL: number;
        MAX_COLOR_ATTACHMENTS_WEBGL: number;
        MAX_DRAW_BUFFERS_WEBGL: number;
        VERTEX_ARRAY_BINDING_OES: number;
        QUERY_COUNTER_BITS_EXT: number;
        CURRENT_QUERY_EXT: number;
        QUERY_RESULT_EXT: number;
        QUERY_RESULT_AVAILABLE_EXT: number;
        TIME_ELAPSED_EXT: number;
        TIMESTAMP_EXT: number;
        GPU_DISJOINT_EXT: number;
    };
    var vertexType: {
        POSITION: string;
        NORMAL: string;
        DEPTH: string;
        DISTANCE: string;
    };
    export class GameObject extends EventObject {
        static TRAVERSE_STOP_NONE: boolean;
        static TRAVERSE_STOP_CHILDREN: number;
        static TRAVERSE_STOP_ALL: boolean;
        /**
         * Node 的名字，可以通过 getChildByName 查找
         * @type {string}
         */
        name: string;
        /**
         * 是否自动更新世界矩阵
         * @default true
         * @type {boolean}
         */
        autoUpdateWorldMatrix: boolean;
        /**
         * 是否自动更新子元素世界矩阵
         * @default true
         * @type {boolean}
         */
        autoUpdateChildWorldMatrix: boolean;
        /**
         * 父节点
         * @default null
         * @type {GameObject}
         */
        parent: GameObject;
        _quatDirty: boolean;
        _matrixDirty: boolean;
        /**
         * 每次更新的时候是否调用子节点的 onUpdate 方法
         * @default true
         * @type {boolean}
         */
        needCallChildUpdate: boolean;
        /**
         * 节点是否显示
         * @default true
         * @type {boolean}
         */
        visible: boolean;
        /**
         * 可视对象是否接受交互事件。默认为接受交互事件，即true。
         * @default true
         * @type {Boolean}
         */
        pointerEnabled: boolean;
        /**
         * 子元素是否接受交互事件。
         * @default true
         * @type {Boolean}
         */
        pointerChildren: boolean;
        /**
         * 是否强制使用父元素 worldMatrix，供高级开发者使用
         * @private
         * @type {Boolean}
         */
        __forceUseParentWorldMatrix: boolean;
        /**
         * @type {string}
         */
        id: string;
        /**
         * 元素的up向量
         * @type {Vector3}
         */
        up: Vector3;
        /**
         * 元素直接点数组
         * @type {GameObject[]}
         */
        children: Array<GameObject>;
        /**
         * 元素的世界矩阵
         * @type {Matrix4}
         */
        worldMatrix: Matrix4;
        getClassName(): string;
        constructor();
        /**
         * @return {GameObject} 返回clone的Node
         */
        clone(): GameObject;
        /**
         * 将所以子孙元素放到一个对象中，对象key为元素的name，value为该元素
         * @return {Object} 返回获取的对象
         */
        getChildrenNameMap(): {};
        /**
         * 添加一个子元素
         * @param {GameObject} child 需要添加的子元素
         * @return {GameObject} this
         */
        addChild(child: GameObject): this;
        /**
         * 移除指定的子元素
         * @param {GameObject} child 需要移除的元素
         * @return {GameObject} this
         */
        removeChild(child: GameObject): this;
        /**
         * 将当前元素添加到某个父元素的子元素中
         * @param {GameObject} parent 需要添加到的父元素
         * @return {GameObject} this
         */
        addTo(parent: GameObject): this;
        /**
         * 将当前元素从其父元素中移除
         * @return {GameObject} this
         */
        removeFromParent(): this;
        /**
         * 更新本地矩阵
         * @return {GameObject} this
         */
        updateMatrix(): this;
        /**
         * 更新四元数
         * @return {GameObject} this
         */
        updateQuaternion(): this;
        /**
         * 更新transform属性
         * @return {GameObject} this
         */
        updateTransform(): this;
        /**
         * 更新世界矩阵
         * @param  {Boolean} [force=true] 是否强制更新
         * @return {GameObject} this
         */
        updateMatrixWorld(force?: boolean): this;
        /**
         * _traverse
         * @private
         * @param  {Function(Node)} callback
         * @param  {Boolean}  onlyChild
         * @return {Enum}  TRAVERSE_STOP_ALL, TRAVERSE_STOP_CHILDREN, TRAVERSE_STOP_NONE
         */
        _traverse(callback: Function, onlyChild: boolean): any;
        /**
         * 遍历当前元素的子孙元素
         * @param {Function(Node)} callback 每个元素都会调用这个函数处理
         * @param {Boolean} [onlyChild=false] 是否只遍历子元素
         * @return {GameObject} this
         */
        traverse(callback: Function, onlyChild?: boolean): this;
        /**
         * 遍历当前元素的子孙元素(广度优先)
         * @param {Function(Node)} callback 每个元素都会调用这个函数处理
         * @param {Boolean} [onlyChild=false] 是否只遍历子元素
         * @return {GameObject} this
         */
        traverseBFS(callback: Function, onlyChild?: boolean): this;
        /**
         * 根据函数来获取一个子孙元素(广度优先)
         * @param {Function} fn 判读函数
         * @return {GameObject|null} 返回获取到的子孙元素
         */
        getChildByFnBFS(fn: Function): any;
        /**
         * 根据 name path 来获取子孙元素
         * @param  {String[]} path 名字数组, e.g., getChildByNamePath(['a', 'b', 'c'])
         * @return {GameObject|null} 返回获取到的子孙元素
         */
        getChildByNamePath(path: Array<string>): this;
        /**
         * 遍历调用子孙元素onUpdate方法
         * @param  {Number} dt
         * @return {GameObject} this
         */
        traverseUpdate(dt: number): this;
        onUpdate(): void;
        /**
         * 根据函数来获取一个子孙元素
         * @param {Function} fn 判读函数
         * @return {GameObject|null} 返回获取到的子孙元素
         */
        getChildByFn(fn: Function): any;
        /**
         * 根据函数来获取匹配的所有子孙元素
         * @param {Function} fn 判读函数
         * @return {GameObject[]} 返回获取到的子孙元素
         */
        getChildrenByFn(fn: Function): any[];
        /**
         * 获取指定name的首个子孙元素
         * @param {string} name 元素name
         * @return {GameObject|null} 获取的元素
         */
        getChildByName(name: string): any;
        /**
         * 获取指定name的所有子孙元素
         * @param {string} name 元素name
         * @return {GameObject[]} 获取的元素数组
         */
        getChildrenByName(name: string): any[];
        /**
         * 获取指定id的子孙元素
         * @param {string} id 元素id
         * @return {GameObject|null} 获取的元素
         */
        getChildById(id: string): any;
        /**
         * 获取指定类名的所有子孙元素
         * @param {string} className 类名
         * @return {GameObject[]} 获取的元素数组
         */
        getChildrenByClassName(className: any): any[];
        /**
         * 设置元素的缩放比例
         * @param {number} x X缩放比例
         * @param {number} y Y缩放比例
         * @param {number} z Z缩放比例
         * @return {GameObject} this
         */
        setScale(x: number, y?: number, z?: number): this;
        /**
         * 设置元素的位置
         * @param {number} x X方向位置
         * @param {number} y Y方向位置
         * @param {number} z Z方向位置
         * @return {GameObject} this
         */
        setPosition(x: number, y: number, z: number): this;
        /**
         * 设置元素的旋转
         * @param {number} x X轴旋转角度, 角度制
         * @param {number} y Y轴旋转角度, 角度制
         * @param {number} z Z轴旋转角度, 角度制
         * @return {GameObject} this
         */
        setRotation(x: number, y: number, z: number): this;
        /**
         * 设置中心点
         * @param {Number} x 中心点x
         * @param {Number} y 中心点y
         * @param {Number} z 中心点z
         * @return {GameObject} this
         */
        setPivot(x: number, y: number, z: number): this;
        /**
         * 改变元素的朝向
         * @param {GameObject|Object|Vector3} node 需要朝向的元素，或者坐标
         * @return {GameObject} this
         */
        lookAt(node: GameObject): this;
        get matrix(): Matrix4Notifier;
        set matrix(value: Matrix4Notifier);
        get position(): Vector3Notifier;
        set position(value: Vector3Notifier);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get scale(): Vector3Notifier;
        set scale(value: Vector3Notifier);
        get scaleX(): number;
        set scaleX(value: number);
        get scaleY(): number;
        set scaleY(value: number);
        get scaleZ(): number;
        set scaleZ(value: number);
        get pivot(): Vector3Notifier;
        set pivot(value: Vector3Notifier);
        get pivotX(): number;
        set pivotX(value: number);
        get pivotY(): number;
        set pivotY(value: number);
        get pivotZ(): number;
        set pivotZ(value: number);
        get rotation(): EulerNotifier;
        set rotation(value: EulerNotifier);
        get rotationX(): number;
        set rotationX(value: number);
        get rotationY(): number;
        set rotationY(value: number);
        get rotationZ(): number;
        set rotationZ(value: number);
        get quaternion(): Quaternion;
        set quaternion(value: Quaternion);
        matrixVersion: number;
        destroy(renderer: WebGLRenderer, needDestroyTextures?: boolean): this;
        _onMatrixUpdate(): void;
        _onPositionUpdate(): void;
        _onScaleUpdate(): void;
        _onPivotUpdate(): void;
        _onRotationUpdate(): void;
        _onQuaternionUpdate(): void;
    }
    export type Nullable<T> = T | null;
    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface IHashObject {
        /**
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        hashCode: number;
    }
    /**
     * @private
     * 哈希计数
     */
    var $hashCount: number;
    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export class HashObject implements IHashObject {
        /**
         * Initializes a HashObject
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 HashObject 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        constructor();
        getClassName(): string;
        /**
         * @private
         */
        $hashCode: number;
        get hashCode(): number;
        get id(): number;
    }
    export class Mesh extends GameObject {
        material: any;
        geometry: any;
        _sortRenderZ: number;
        constructor();
        getClassName(): string;
        getRenderOption(opt?: {}): {};
        useResource(res: any): void;
        destroy(renderer: WebGLRenderer, needDestroyTextures?: boolean): this;
    }
    export interface iSceneParams {
        container?: HTMLElement;
        width?: number;
        height?: number;
        pixelRatio?: number;
        camera?: any;
        clearColor?: any;
        canvas?: HTMLCanvasElement;
    }
    export class Scene extends GameObject {
        /**
         * 渲染器
         * @type {WebGLRenderer}
         */
        renderer: any;
        /**
         * 摄像机
         * @type {Camera}
         */
        camera: any;
        /**
         * 像素密度
         * @type {number}
         * @default 根据设备自动判断
         */
        pixelRatio: number;
        /**
         * 偏移值
         * @type {number}
         * @default 0
         */
        offsetX: number;
        /**
         * 偏移值
         * @type {Number}
         * @default 0
         */
        offsetY: number;
        width: number;
        height: number;
        rendererWidth: number;
        rendererHeight: number;
        canvas: HTMLCanvasElement;
        constructor(params: iSceneParams);
        getClassName(): string;
        /**
         * 初始化渲染器
         * @private
         * @param  {Object} params
         */
        initRenderer(params: iSceneParams): void;
        /**
         * 生成canvas
         * @private
         * @param  {Object} params
         * @return {Canvas}
         */
        createCanvas(params: iSceneParams): any;
        /**
         * 缩放舞台
         * @param  {Number} width 舞台宽
         * @param  {Number} height 舞台高
         * @param  {Number} [pixelRatio=this.pixelRatio] 像素密度
         * @param  {Boolean} [force=false] 是否强制刷新
         * @return {Stage} 舞台本身。链式调用支持。
         */
        resize(width: number, height: number, pixelRatio?: number, force?: boolean): this;
        /**
         * 设置舞台偏移值
         * @param {Number} x x
         * @param {Number} y y
         * @return {Stage} 舞台本身。链式调用支持。
         */
        setOffset(x: number, y: number): this;
        /**
         * 改viewport
         * @param  {Number} x      x
         * @param  {Number} y      y
         * @param  {Number} width  width
         * @param  {Number} height height
         * @return {Stage} 舞台本身。链式调用支持。
         */
        viewport(x: number, y: number, width: number, height: number): this;
        /**
         * 渲染一帧
         * @param  {number} dt 间隔时间
         * @return {Stage} 舞台本身。链式调用支持。
         */
        tick(dt: number): this;
        /**
         * 释放 WebGL 资源
         * @return {Stage} this
         */
        releaseGLResource(): this;
        /**
         * 销毁
         * @return {Stage} this
         */
        destroy(): this;
    }
    export class EventObject {
        _listeners: Object;
        getClassName(): string;
        /**
         * @language=en
         * Add an event listenser.
         * @param {String} type Event type to listen.
         * @param {Function} listener Callback function of event listening.
         * @param {Boolean} once Listen on event only once and no more response after the first response?
         * @returns {Object} The Event itself. Functions chain call supported.
         */
        on(type: string, listener: Function, once?: boolean): this;
        /**
         * @language=en
         * Remove one event listener. Remove all event listeners if no parameter provided, and remove all event listeners on one type which is provided as the only parameter.
         * @param {String} type The type of event listener that want to remove.
         * @param {Function} listener Event listener callback function to be removed.
         * @returns {Object} The Event itself. Functions chain call supported.
         */
        off(type?: string, listener?: Function): this;
        /**
         * @language=en
         * Send events. If the first parameter is an Object, take it  as an Event Object.
         * @param {String} type Event type to send.
         * @param {Object} detail The detail (parameters go with the event) of Event to send.
         * @returns {Boolean} Whether Event call successfully.
         */
        fire(type: any, detail?: any): boolean;
    }
    export class EventObjectNode {
        type: null;
        target: null;
        detail: null;
        timeStamp: number;
        _stopped: boolean;
        constructor(type: any, target: any, detail: any);
        stopImmediatePropagation(): void;
    }
    /**
     * 长方体几何体
     * @class
     * @extends Geometry
     */
    export class BoxGeometry extends Geometry {
        /**
         * box的宽度
         * @default 1
         * @type {number}
         */
        width: number;
        /**
         * box的高度
         * @default 1
         * @type {number}
         */
        height: number;
        /**
         * box的深度
         * @default 1
         * @type {number}
         */
        depth: number;
        /**
         * 水平分割面的数量
         * @default 1
         * @type {number}
         */
        widthSegments: number;
        /**
         * 垂直分割面的数量
         * @default 1
         * @type {number}
         */
        heightSegments: number;
        /**
         * 深度分割面的数量
         * @default 1
         * @type {number}
         */
        depthSegments: number;
        /**
         * @constructs
         */
        constructor();
        getClassName(): string;
        buildWithSegments(): void;
        buildPlane(idxInfo: any, u: any, v: any, w: any, uDir: any, vDir: any, uLength: any, vLength: any, wValue: any, uSegments: any, vSegments: any): void;
        build(): void;
        isSegments(): boolean;
        /**
         * 设置朝前面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setFrontUV(uv: any): void;
        /**
         * 设置右侧面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setRightUV(uv: any): void;
        /**
         * 设置朝后面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setBackUV(uv: any): void;
        /**
         * 设置左侧面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setLeftUV(uv: any): void;
        /**
         * 设置顶部面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setTopUV(uv: any): void;
        /**
         * 设置底部面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][]} uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
         */
        setBottomUV(uv: any): void;
        /**
         * 设置所有面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
         * @param {number[][][]} uv uv数据，如
         * [<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
         *     [[0, 1], [1, 1], [1, 0], [0, 0]]<br>
         * ]
         */
        setAllRectUV(uv: any): this;
    }
    export class Geometry {
        /**
         * 顶点数据
         * @default null
         * @type {GeometryData}
         */
        vertices: GeometryData;
        /**
         * uv 数据
         * @default null
         * @type {GeometryData}
         */
        uvs: GeometryData;
        /**
         * uv1 数据
         * @default null
         * @type {GeometryData}
         */
        uvs1: GeometryData;
        /**
         * color 数据
         * @default null
         * @type {GeometryData}
         */
        colors: GeometryData;
        /**
         * 顶点索引数据
         * @default null
         * @type {GeometryData}
         */
        indices: GeometryData;
        /**
         * 绘制模式
         * @default TRIANGLES
         * @type {number}
         */
        mode: number;
        /**
         * 是否是静态
         * @type {Boolean}
         * @default true
         */
        isStatic: boolean;
        /**
         * 是否需要更新
         * @type {Boolean}
         * @default true
         */
        isDirty: boolean;
        currentVerticesCount: number;
        currentIndicesCount: number;
        id: string;
        /**
         * @constructs
         */
        constructor();
        getClassName(): string;
        _needUpdateNormals: boolean;
        get normals(): GeometryData;
        set normals(data: GeometryData);
        calculateNormals(): void;
        get tangents(): GeometryData;
        set tangents(data: GeometryData);
        get tangents1(): GeometryData;
        set tangents1(data: GeometryData);
        calculateTangents(uvs: any, tangentsName: any): void;
        /**
         * 将三角形模式转换为线框模式，即 Material 中的 wireframe
         */
        convertToLinesMode(): void;
        /**
         * 平移
         * @param  {Number} [x=0]
         * @param  {Number} [y=0]
         * @param  {Number} [z=0]
         * @return {Geometry} this
         */
        translate(x?: number, y?: number, z?: number): this;
        /**
         * 缩放
         * @param  {Number} [x=1]
         * @param  {Number} [y=1]
         * @param  {Number} [z=1]
         * @return {Geometry} this
         */
        scale(x?: number, y?: number, z?: number): this;
        /**
         * 旋转
         * @param  {Number} [x=0] 旋转角度x
         * @param  {Number} [y=0] 旋转角度y
         * @param  {Number} [z=0] 旋转角度z
         * @return {Geometry} this
         */
        rotate(x?: number, y?: number, z?: number): this;
        /**
         * Transforms the geometry with a mat4.
         * @param  {Matrix4} mat4
         * @return {Geometry} this
         */
        transformMat4(mat4: any): this;
        /**
         * 合并两个 geometry
         * @param  {Geometry} geometry
         * @param  {Matrix4} [matrix=null] 合并的矩阵
         * @return {Geometry} this
         */
        merge(geometry: any, matrix: any): this;
        ensureData(name: any, size: any, total: any, TypedArray: any): void;
        /**
         * 添加顶点
         * @param {...number[]} points 顶点坐标，如 addPoints([x, y, z], [x, y, z])
         */
        addPoints(...args: any[]): number;
        /**
         * 添加顶点索引
         * @param {...number} indices 顶点索引，如 addIndices(0, 1, 2)
         */
        addIndices(...args: any[]): void;
        /**
         * 添加一条线
         * @param {number[]} p1 起点坐标，如 [x, y, z]
         * @param {number[]} p2 终点坐标
         */
        addLine(p1: any, p2: any): void;
        /**
         * 添加一个三角形 ABC
         * @param {number[]} p1 点A，如 [x, y, z]
         * @param {number[]} p2 点B
         * @param {number[]} p3 点C
         */
        addFace(p1: any, p2: any, p3: any): void;
        /**
         * 添加一个矩形 ABCD
         * @param {number[]} p1 点A，如 [x, y, z]
         * @param {number[]} p2 点B
         * @param {number[]} p3 点C
         * @param {number[]} p4 点D
         */
        addRect(p1: any, p2: any, p3: any, p4: any): void;
        /**
         * 设置顶点对应的uv坐标
         * @param {number} start 开始的顶点索引
         * @param {number[][]} uvs uv坐标数据，如 [[0, 0], [1, 0]]
         */
        setVertexUV(start: any, uvs: any): void;
        /**
         * 设置三角形ABC的uv
         * @param {number} start 开始的顶点索引
         * @param {number[]} p1 点A的uv，如 [0, 0]
         * @param {number[]} p2 点B的uv
         * @param {number[]} p3 点C的uv
         */
        setFaceUV(start: any, p1: any, p2: any, p3: any): void;
        /**
         * 设置矩形ABCD的uv
         * @param {number} start 开始的顶点索引
         * @param {number[]} p1 点A的uv，如 [0, 0]
         * @param {number[]} p2 点B的uv
         * @param {number[]} p3 点C的uv
         * @param {number[]} p4 点D的uv
         */
        setRectUV(start: any, p1: any, p2: any, p3: any, p4: any): void;
        /**
         * 获取指定matrix变化后的包围盒数据
         *
         * @param {Matrix4} [null] matrix 需要变换的矩阵
         * @param {Bounds} [bounds] 包围盒数据，传入的话会改变他
         * @return {Bounds} 包围盒数据
         */
        getBounds(matrix?: any, bounds?: any): any;
        /**
         * 获取本地包围盒
         * @param  {Boolean} [force=false] 是否强制刷新
         * @return {Bounds}
         */
        getLocalBounds(force?: boolean): any;
        /**
         * 获取球面包围盒
         * @param  {Matrix4} matrix
         * @return {Sphere}
         */
        getSphereBounds(matrix: any): Sphere;
        /**
         * 获取本地球面包围盒
         * @param  {Boolean} [force=false] 是否强制刷新
         * @return {Sphere}
         */
        getLocalSphereBounds(force?: boolean): any;
        /**
         * 将 Geometry 转换成无 indices
         * @param {number} [verticesItemLen=3] 转换结果的顶点数据的位数(3 or 4)，如果为4会补1
         */
        convertToNoIndices(verticesItemLen?: number): void;
        positionDecodeMat: any;
        uvDecodeMat: any;
        uv1DecodeMat: any;
        normalDecodeMat: any;
        /**
         * clone当前Geometry
         * @return {Geometry} 返回clone的Geometry
         */
        clone(): Geometry;
        /**
         * 检测 aabb 碰撞
         * @param  {Ray} ray
         * @return {Vector3[]|null}
         */
        _aabbRaycast(ray: any): any[];
        getRenderOption(opt?: any): any;
        protected _shaderKey: string;
        getShaderKey(): string;
        /**
         * 获取数据的内存大小，只处理顶点数据，单位为字节
         * @return {number} 内存占用大小
         */
        getSize(): number;
        /**
         * @deprecated
         * @return {Geometry} this
         */
        destroy(): void;
    }
    export class GeometryData {
        /**
         * The number of components per vertex attribute.Must be 1, 2, 3, or 4.
         * @type {Number}
         */
        size: number;
        /**
         * Whether integer data values should be normalized when being casted to a float.
         * @type {Boolean}
         * @default false
         */
        normalized: boolean;
        /**
         * The data type of each component in the array.
         * @type {GLenum}
         */
        type: number;
        _isSubDirty: boolean;
        _isAllDirty: boolean;
        get isDirty(): boolean;
        set isDirty(value: boolean);
        /**
         * @type {String}
         */
        bufferViewId: string;
        /**
         * glBuffer
         * @type {Buffer}
         */
        glBuffer: Buffer;
        id: string;
        /**
         * @constructs
         * @param  {TypedArray} data  数据
         * @param  {Number} size The number of components per vertex attribute.Must be 1, 2, 3, or 4.
         * @param  {Object} [params] 初始化参数，所有params都会复制到实例上
         */
        constructor(data: any, size: number);
        getClassName(): string;
        _stride: number;
        get stride(): number;
        set stride(value: number);
        strideSize: number;
        _offset: number;
        get offset(): number;
        set offset(value: number);
        offsetSize: number;
        set data(data: any);
        get data(): any;
        get length(): any;
        get realLength(): any;
        /**
         * 获取数据大小，单位为字节
         * @return {number} 数据大小
         */
        getByteLength(): number;
        get count(): number;
        /**
         * 更新部分数据
         * @param {Number} offset 偏移index
         * @param {TypedArray} data 数据
         */
        setSubData(offset: any, data: any): void;
        /**
         * 清除 subData
         */
        clearSubData(): void;
        /**
         * clone
         * @return {GeometryData}
         */
        clone(): GeometryData;
        /**
         * copy
         * @param  {GeometryData} geometryData
         */
        copy(geometryData: any): void;
        /**
         * 获取偏移值
         * @param  {Number} index
         * @return {Number}
         */
        getOffset(index: any): number;
        /**
         * 获取值
         * @param  {Number} index
         * @return {Number|Vector2|Vector3|Vector4}
         */
        get(index: any): any;
        /**
         * 设置值
         * @param {Number} index
         * @param {Number|Vector2|Vector3|Vector4} value
         */
        set(index: any, value: any): number;
        /**
         * 根据 offset 获取值
         * @param  {Number} offset
         * @return {Number|Vector2|Vector3|Vector4}
         */
        getByOffset(offset: any): any;
        /**
         * 根据 offset 设置值
         * @param {Number} offset
         * @param {Number|Vector2|Vector3|Vector4} value
         */
        setByOffset(offset: any, value: any): void;
        /**
         * 按 index 遍历
         * @param  {Function} callback(attribute, index, offset)
         * @return {Boolean}
         */
        traverse(callback: any): boolean;
        /**
         * 按 Component 遍历 Component
         * @param  {Function} callback(data, offset)
         * @return {Boolean}
         */
        traverseByComponent(callback: any): boolean;
        merge(geometryData: any, transform?: any): this;
    }
    export class DirectionLight extends Light {
        /**
         * 光方向
         * @type {Vector3}
         * @default new Vector3(0, 0, 1)
         */
        direction: Vector3;
        /**
         * 阴影生成参数，默认不生成阴影
         * @default null
         * @type {object}
         * @property {boolean} [debug=false] 是否显示生成的阴影贴图
         * @property {number} [width=render.width] 阴影贴图的宽，默认为画布宽
         * @property {number} [height=render.height] 阴影贴图的高，默认为画布高
         * @property {number} [maxBias=0.05] depth最大差值，实际的bias为max(maxBias * (1 - dot(normal, lightDir)), minBias)
         * @property {number} [minBias=0.005] depth最小差值
         * @property {Object} [cameraInfo=null] 阴影摄像机信息，没有会根据当前相机自动计算
         */
        shadow: any;
        /**
         * @constructs
         * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
         */
        constructor();
        getClassName(): string;
        getWorldDirection(): Vector3;
        getViewDirection(camera: any): Vector3;
    }
    export enum LightType {
        DirectionLight = 0,
        PointLight = 1,
        SpotLight = 2
    }
    export class Light extends GameObject {
        /**
         * 光强度
         * @type {Number}
         * @default 1
         */
        amount: number;
        /**
         * 是否开启灯光
         * @type {Boolean}
         * @default true
         */
        enabled: boolean;
        /**
         * 光常量衰减值, PointLight 和 SpotLight 时生效
         * @type {Number}
         * @readOnly
         * @default 1
         */
        constantAttenuation: number;
        /**
         * 光线性衰减值, PointLight 和 SpotLight 时生效
         * @type {Number}
         * @readOnly
         * @default 0
         */
        linearAttenuation: number;
        /**
         * 光二次衰减值, PointLight 和 SpotLight 时生效
         * @type {Number}
         * @readOnly
         * @default 0
         */
        quadraticAttenuation: number;
        get range(): number;
        set range(value: number);
        direction: Vector3;
        /**
         * 灯光颜色
         * @default new Color(1, 1, 1)
         * @type {Color}
         */
        color: Color;
        /**
         * @constructs
         * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
         */
        constructor();
        getClassName(): string;
        /**
         * 获取光范围信息, PointLight 和 SpotLight 时生效
         * @param  {Array} out  信息接受数组
         * @param  {Number} offset 偏移值
         */
        toInfoArray(out: Array<number>, offset: number): this;
        getRealColor(): Color;
        /**
         * 生成阴影贴图，支持阴影的子类需要重写
         * @param  {WebGLRenderer} renderer
         * @param  {Camera} camera
         */
        createShadowMap(renderer: any, camera: any): void;
    }
    /**
     * 光管理类
     * @class
     */
    export class LightManager {
        ambientLights: Array<any>;
        directionalLights: Array<any>;
        pointLights: Array<any>;
        spotLights: Array<any>;
        areaLights: Array<any>;
        lightInfo: any;
        /**
         * @constructs
         * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
         */
        constructor();
        getClassName(): string;
        getRenderOption(option?: {}): {};
        /**
         * 增加光
         * @param {Light} light 光源
         * @return {LightManager} this
         */
        addLight(light: any): this;
        /**
         * 获取方向光信息
         * @param  {Camera} camera 摄像机
         * @return {Object}
         */
        getDirectionalInfo(camera: any): {
            colors: Float32Array;
            infos: Float32Array;
        };
        /**
         * 获取聚光灯信息
         * @param {Camera} camera 摄像机
         * @return {Object}
         */
        getSpotInfo(camera: any): {
            colors: Float32Array;
            infos: Float32Array;
            poses: Float32Array;
            dirs: Float32Array;
            cutoffs: Float32Array;
            ranges: Float32Array;
        };
        /**
         * 获取点光源信息
         * @param  {Camera} camera 摄像机
         * @return {Object}
         */
        getPointInfo(camera: any): {
            colors: Float32Array;
            infos: Float32Array;
            poses: Float32Array;
            ranges: Float32Array;
        };
        /**
         * 获取面光源信息
         * @param  {Camera} camera 摄像机
         * @return {Object}
         */
        getAreaInfo(camera: any): {
            colors: Float32Array;
            poses: Float32Array;
            width: Float32Array;
            height: Float32Array;
            ltcTexture1: any;
            ltcTexture2: any;
        };
        /**
         * 获取环境光信息
         * @return {Object}
         */
        getAmbientInfo(): Float32Array;
        directionalInfo: any;
        pointInfo: any;
        spotInfo: any;
        areaInfo: any;
        ambientInfo: any;
        /**
         * 更新所有光源信息
         * @param  {Camera} camera 摄像机
         */
        updateInfo(camera: any): void;
        /**
         * 获取光源信息
         * @return {Object}
         */
        getInfo(): any;
        /**
         * 重置所有光源
         */
        reset(): void;
    }
    export class BasicMaterial extends Material {
        /**
         * 光照类型，支持: NONE, PHONG, BLINN-PHONG, LAMBERT
         * @default BLINN-PHONG
         * @type {string}
         */
        lightType: string;
        /**
         * 漫反射贴图，或颜色
         * @default Color(.5, .5, .5)
         * @type {Texture|Color}
         */
        diffuse: Texture | Color;
        /**
         * 环境光贴图，或颜色
         * @default null
         * @type {Texture|Color}
         */
        ambient: Texture | Color;
        /**
         * 镜面贴图，或颜色
         * @default Color(1, 1, 1)
         * @type {Texture|Color}
         */
        specular: Texture | Color;
        /**
         * 放射光贴图，或颜色
         * @default Color(0, 0, 0)
         * @type {Texture|Color}
         */
        emission: Texture | Color;
        /**
         * 环境贴图
         * @default null
         * @type {CTexture}
         */
        specularEnvMap: Texture;
        /**
         * 环境贴图变化矩阵，如旋转等
         * @default null
         * @type {Matrix4}
         */
        specularEnvMatrix: Matrix4;
        /**
         * 反射率
         * @default 0
         * @type {number}
         */
        reflectivity: number;
        /**
         * 折射比率
         * @default 0
         * @type {number}
         */
        refractRatio: number;
        /**
         * 折射率
         * @default 0
         * @type {number}
         */
        refractivity: number;
        /**
         * 高光发光值
         * @default 32
         * @type {number}
         */
        shininess: number;
        usedUniformVectors: number;
        constructor();
        getClassName(): string;
        getRenderOption(option?: RenderOptions): RenderOptions;
    }
    export class GeometryMaterial extends BasicMaterial {
        /**
         * 顶点类型 POSITION, NORMAL, DEPTH, DISTANCE
         * @type {String}
         */
        vertexType: string;
        lightType: string;
        /**
         * 是否直接存储
         * @type {Boolean}
         */
        writeOriginData: boolean;
        /**
         * @constructs
         * @param {object} params 初始化参数，所有params都会复制到实例上
         */
        constructor();
        getRenderOption(option?: any): any;
        getClassName(): string;
    }
    export class Material {
        /**
         * shader cache id
         * @default null
         * @type {String}
         */
        shaderCacheId: number;
        _shaderNumId: number;
        get lightType(): string;
        set lightType(value: string);
        getClassName(): string;
        get depthTest(): boolean;
        set depthTest(value: boolean);
        get depthMask(): boolean;
        set depthMask(value: boolean);
        get depthRange(): Array<number>;
        set depthRange(value: Array<number>);
        get depthFunc(): number;
        set depthFunc(value: number);
        get cullFace(): boolean;
        set cullFace(value: boolean);
        get cullFaceType(): number;
        set cullFaceType(value: number);
        get side(): number;
        set side(value: number);
        get blend(): boolean;
        set blend(value: boolean);
        get blendEquation(): number;
        set blendEquation(value: number);
        get blendEquationAlpha(): number;
        set blendEquationAlpha(value: number);
        get blendSrc(): number;
        set blendSrc(value: number);
        get blendDst(): number;
        set blendDst(value: number);
        get blendSrcAlpha(): number;
        set blendSrcAlpha(value: number);
        get blendDstAlpha(): number;
        set blendDstAlpha(value: number);
        get isDirty(): boolean;
        set isDirty(value: boolean);
        get transparency(): number;
        set transparency(value: number);
        get transparent(): boolean;
        set transparent(value: boolean);
        get normalMap(): Texture;
        set normalMap(value: Texture);
        get normalMapScale(): number;
        set normalMapScale(value: number);
        setDefaultTransparentBlend(): void;
        get alphaCutoff(): number;
        set alphaCutoff(value: number);
        get needBasicUnifroms(): boolean;
        set needBasicUnifroms(value: boolean);
        get needBasicAttributes(): boolean;
        set needBasicAttributes(value: boolean);
        get isLoaded(): boolean;
        get uniforms(): Object;
        set uniforms(value: Object);
        get attributes(): Object;
        set attributes(value: Object);
        /**
         * 渲染顺序数字小的先渲染（透明物体和不透明在不同的队列）
         * @default 0
         * @type {Number}
         */
        renderOrder: number;
        _premultiplyAlpha: boolean;
        get premultiplyAlpha(): boolean;
        set premultiplyAlpha(value: boolean);
        id: string;
        constructor();
        /**
         * 增加基础 attributes
         */
        addBasicAttributes(): void;
        /**
         * 增加基础 uniforms
         */
        addBasicUniforms(): void;
        /**
         * 增加贴图 uniforms
         * @param {Object} textureUniforms textureName:semanticName 键值对
         */
        addTextureUniforms(textureUniforms: Object): void;
        _textureOption: TextureOptions;
        /**
         * 获取渲染选项值
         * @param  {Object} [option={}] 渲染选项值
         * @return {Object} 渲染选项值
         */
        getRenderOption(option: RenderOptions): RenderOptions;
        getUniformData(name: string, mesh: Mesh, programInfo: any): any;
        getAttributeData(name: string, mesh: Mesh, programInfo: any): any;
        getUniformInfo(name: string): any;
        getAttributeInfo(name: string): any;
        getInfo(dataType: string, name: string): any;
        load(): void;
    }
    /**
     * 颜色类
     * @class
     * @extends Vector4
     */
    export class Color extends Vector4 {
        getClassName(): string;
        get r(): number;
        set r(v: number);
        get g(): number;
        set g(v: number);
        get b(): number;
        set b(v: number);
        get a(): number;
        set a(v: number);
        /**
         * @constructs
         * @param  {number} r
         * @param  {number} g
         * @param  {number} b
         * @param  {number} a
         */
        constructor(r?: number, g?: number, b?: number, a?: number);
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 转换到的数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toRGBArray(array?: Array<number>, offset?: number): number[];
        /**
         * 从数组赋值
         * @param  {Array} array 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Color}
         */
        fromUintArray(array: Array<number>, offset?: number): this;
        /**
         * 从十六进制值赋值
         * @param  {String|Number} hex 颜色的十六进制值，可以以下形式："#ff9966", "ff9966", "#f96", "f96", 0xff9966
         * @return {Color}
         */
        fromHEX(hex: number | string): this;
        /**
         * 转16进制
         * @return {string}
         */
        toHEX(): string;
    }
    export class Euler {
        getClassName(): string;
        elements: Float32Array;
        /**
         * 旋转顺序，默认为 ZYX
         * @type {string}
         * @default 'ZYX'
         */
        order: string;
        _degX: number;
        _degY: number;
        _degZ: number;
        /**
         * @constructs
         * @param  {Number} [x=0]  角度 X, 弧度制
         * @param  {Number} [y=0]  角度 Y, 弧度制
         * @param  {Number} [z=0]  角度 Z, 弧度制
         */
        constructor(x?: number, y?: number, z?: number);
        /**
         * 克隆
         * @return {Euler}
         */
        clone(): Euler;
        /**
         * 复制
         * @param  {Euler} euler
         * @return {Euler} this
         */
        copy(euler: any): this;
        /**
         * Set the components of a euler to the given values
         * @param {Number} x x 轴旋转角度, 弧度制
         * @param {Number} y y 轴旋转角度, 弧度制
         * @param {Number} z z 轴旋转角度, 弧度制
         * @return {Euler} this
         */
        set(x: any, y: any, z: any): this;
        /**
         * 设置角度
         * @param {Number} degX x 轴旋转角度, 角度制
         * @param {Number} degY y 轴旋转角度, 角度制
         * @param {Number} degZ z 轴旋转角度, 角度制
         * @return {Euler} this
         */
        setDegree(degX: any, degY: any, degZ: any): this;
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Euler} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * Creates a euler from the given 4x4 rotation matrix.
         * @param {Matrix4} mat rotation matrix
         * @param {string} [order=this.order] 旋转顺序，默认为当前Euler实例的order
         * @return {Euler} this
         */
        fromMat4(mat: any, order: any): this;
        /**
         * Creates a euler from the given quat.
         * @param  {Quaternion} quat
         * @param  {String} [order=this.order] 旋转顺序，默认为当前Euler实例的order
         * @return {Euler} this
         */
        fromQuat(quat: any, order: any): this;
        updateDegrees(): this;
        updateRadians(): this;
        get degX(): number;
        set degX(value: number);
        get degY(): number;
        set degY(value: number);
        get degZ(): number;
        set degZ(value: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
    }
    export class EulerNotifier extends EventObject {
        elements: Float32Array;
        /**
         * 旋转顺序，默认为 ZYX
         * @type {string}
         * @default 'ZYX'
         */
        order: string;
        _degX: number;
        _degY: number;
        _degZ: number;
        /**
         * @constructs
         * @param  {Number} [x=0]  角度 X, 弧度制
         * @param  {Number} [y=0]  角度 Y, 弧度制
         * @param  {Number} [z=0]  角度 Z, 弧度制
         */
        constructor(x?: number, y?: number, z?: number);
        getClassName(): string;
        /**
         * 克隆
         * @return {Euler}
         */
        clone(): Euler;
        /**
         * 复制
         * @param  {Euler} euler
         * @return {Euler} this
         */
        copy(euler: any): this;
        /**
         * Set the components of a euler to the given values
         * @param {Number} x x 轴旋转角度, 弧度制
         * @param {Number} y y 轴旋转角度, 弧度制
         * @param {Number} z z 轴旋转角度, 弧度制
         * @return {Euler} this
         */
        set(x: any, y: any, z: any): this;
        /**
         * 设置角度
         * @param {Number} degX x 轴旋转角度, 角度制
         * @param {Number} degY y 轴旋转角度, 角度制
         * @param {Number} degZ z 轴旋转角度, 角度制
         * @return {Euler} this
         */
        setDegree(degX: any, degY: any, degZ: any): this;
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Euler} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * Creates a euler from the given 4x4 rotation matrix.
         * @param {Matrix4} mat rotation matrix
         * @param {string} [order=this.order] 旋转顺序，默认为当前Euler实例的order
         * @return {Euler} this
         */
        fromMat4(mat: any, order: any): this;
        /**
         * Creates a euler from the given quat.
         * @param  {Quaternion} quat
         * @param  {String} [order=this.order] 旋转顺序，默认为当前Euler实例的order
         * @return {Euler} this
         */
        fromQuat(quat: Quaternion, order?: string): this;
        updateDegrees(): this;
        updateRadians(): this;
        get degX(): number;
        set degX(value: number);
        get degY(): number;
        set degY(value: number);
        get degZ(): number;
        set degZ(value: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
    }
    export class Frustum {
        planes: Array<Plane>;
        /**
         * @constructs
         */
        constructor();
        getClassName(): string;
        /**
         * Copy the values from one frustum to this
         * @param  {Frustum} m the source frustum
         * @return {Frustum} this
         */
        copy(frustum: any): this;
        /**
         * Creates a new frustum initialized with values from this frustum
         * @return {Frustum} a new Frustum
         */
        clone(): Frustum;
        /**
         * fromMatrix
         * @param  {Matrix4} mat
         * @return {Frustum}  this
         */
        fromMatrix(mat: any): this;
        /**
         * 与球体相交
         * @param  {Sphere} sphere
         * @return {Boolean} 是否相交
         */
        intersectsSphere(sphere: any): boolean;
    }
    export class Matrix3 {
        elements: mat3;
        /**
         * Creates a new identity mat3
         * @constructs
         */
        constructor();
        getClassName(): string;
        /**
         * Copy the values from one mat3 to this
         * @param  {Matrix3} m the source matrix
         * @return {Matrix3} this
         */
        copy(m: any): this;
        /**
         * Creates a new mat3 initialized with values from this matrix
         * @return {Matrix3} a new Matrix3
         */
        clone(): Matrix3;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Matrix3} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a mat3 to the given values
         * @param {Number} m00
         * @param {Number} m01
         * @param {Number} m02
         * @param {Number} m10
         * @param {Number} m11
         * @param {Number} m12
         * @param {Number} m20
         * @param {Number} m21
         * @param {Number} m22
         * @return {Matrix3} this
         */
        set(m00: any, m01: any, m02: any, m10: any, m11: any, m12: any, m20: any, m21: any, m22: any): this;
        /**
         * Set this to the identity matrix
         * @return {Matrix3} this
         */
        identity(): this;
        /**
         * Transpose the values of this
         * @return {Matrix3} this
         */
        transpose(): this;
        /**
         * invert a matrix
         * @param  {Matrix3} [m = this]
         * @return {Matrix3} this
         */
        invert(m?: this): this;
        /**
         * Calculates the adjugate of a mat3
         * @param  {Matrix3} [m=this]
         * @return {Matrix3} this
         */
        adjoint(m?: this): this;
        /**
         * Calculates the determinant of this
         * @return {Number}
         */
        determinant(): number;
        /**
         * Multiplies two matrix3's
         * @param  {Matrix3} a
         * @param  {Matrix3} [b] 如果不传，计算 this 和 a 的乘积
         * @return {Matrix3} this
         */
        multiply(a: any, b: any): this;
        /**
         * 左乘
         * @param  {Matrix3} m
         * @return {Matrix3}  this
         */
        premultiply(m: any): this;
        /**
         * Translate this by the given vector
         * @param  {Vector2} v vector to translate by
         * @return {Matrix3} this
         */
        translate(v: any): this;
        /**
         * Rotates this by the given angle
         * @param  {Number} rad the angle to rotate the matrix by
         * @return {Matrix3} this
         */
        rotate(rad: any): this;
        /**
         * Scales the mat3 by the dimensions in the given vec2
         * @param  {Vector2} v the vec2 to scale the matrix by
         * @return {Matrix3} this
         */
        scale(v: any): this;
        /**
         * Creates a matrix from a vector translation
         * @param  {Vector2} v Translation vector
         * @return {Matrix3} this
         */
        fromTranslation(v: any): this;
        /**
         * Creates a matrix from a given angle
         * @param  {Number} rad the angle to rotate the matrix by
         * @return {Matrix3} this
         */
        fromRotation(rad: any): this;
        /**
         * Creates a matrix from a vector scaling
         * @param  {Vector2} v Scaling vector
         * @return {Matrix3} this
         */
        fromScaling(v: any): this;
        /**
         * Calculates a 3x3 matrix from the given quaternion
         * @param  {Quaternion} q Quaternion to create matrix from
         * @return {Matrix3} this
         */
        fromQuat(q: any): this;
        /**
         * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
         * @param  {Matrix4} m Mat4 to derive the normal matrix from
         * @return {Matrix3} this
         */
        normalFromMat4(m: any): this;
        /**
         * Copies the upper-left 3x3 values into the given mat3.
         * @param  {Matrix4} m the source 4x4 matrix
         * @return {Matrix3} this
         */
        fromMat4(m: any): this;
        /**
         * Returns Frobenius norm of this
         * @return {Number} Frobenius norm
         */
        frob(): number;
        /**
         * Adds two mat3's
         * @param {Matrix3} a
         * @param {Matrix3} [b] 如果不传，计算 this 和 a 的和
         * @return {Marix4} this
         */
        add(a: any, b: any): this;
        /**
         * Subtracts matrix b from matrix a
         * @param {Matrix3} a
         * @param {Matrix3} [b] 如果不传，计算 this 和 a 的差
         * @return {Marix4} this
         */
        subtract(a: any, b: any): this;
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         * @param {Matrix3} a
         * @param {Matrix3} [b] 如果不传，比较 this 和 a 是否相等
         * @return {Boolean}
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         * @param {Matrix3} a
         * @param {Matrix3} [b] 如果不传，比较 this 和 a 是否近似相等
         * @return {Boolean}
         */
        equals(a: any, b: any): boolean;
        /**
         * fromRotationTranslationScale
         * @param  {Number} r rad angle
         * @param  {Number} x
         * @param  {Number} y
         * @param  {Number} scaleX
         * @param  {Number} scaleY
         * @return {Matrix3}
         */
        fromRotationTranslationScale(rotation: any, x: any, y: any, scaleX: any, scaleY: any): this;
        sub(a: any, b: any): this;
        mul(a: any, b: any): this;
    }
    export class Matrix4 {
        elements: mat4;
        /**
         * Creates a new identity mat4
         * @constructs
         */
        constructor();
        getClassName(): string;
        /**
         * Copy the values from one mat4 to this
         * @param  {Matrix4} m the source matrix
         * @return {Matrix4} this
         */
        copy(m: Matrix4 | Matrix4Notifier): this;
        /**
         * Creates a new mat4 initialized with values from this matrix
         * @return {Matrix4} a new Matrix4
         */
        clone(): Matrix4;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Matrix4} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a mat3 to the given values
         * @param {Number} m00
         * @param {Number} m01
         * @param {Number} m02
         * @param {Number} m03
         * @param {Number} m10
         * @param {Number} m11
         * @param {Number} m12
         * @param {Number} m13
         * @param {Number} m20
         * @param {Number} m21
         * @param {Number} m22
         * @param {Number} m23
         * @param {Number} m30
         * @param {Number} m31
         * @param {Number} m32
         * @param {Number} m33
         * @return {Matrix4} this
         */
        set(m00: any, m01: any, m02: any, m03: any, m10: any, m11: any, m12: any, m13: any, m20: any, m21: any, m22: any, m23: any, m30: any, m31: any, m32: any, m33: any): this;
        /**
         * Set this to the identity matrix
         * @return {Matrix4} this
         */
        identity(): this;
        /**
         * Transpose the values of this
         * @return {Matrix4} this
         */
        transpose(): this;
        /**
         * invert a matrix
         * @param {Matrix4} [m=this]
         * @return {Matrix4} this
         */
        invert(m?: this): this;
        /**
         * Calculates the adjugate of a mat4
         * @param {Matrix4} [m=this]
         * @return {Matrix4} this
         */
        adjoint(m?: this): this;
        /**
         * Calculates the determinant of this
         * @return {Matrix4} this
         */
        determinant(): number;
        /**
         * Multiplies two matrix4's
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，计算 this 和 a 的乘积
         * @return {Matrix4} this
         */
        multiply(a: Matrix4 | Matrix4Notifier, b?: Matrix4 | Matrix4Notifier): this;
        /**
         * 左乘
         * @param {Matrix4} m
         * @return {Matrix4} this
         */
        premultiply(m: any): this;
        /**
         * Translate this by the given vector
         * @param {Vector3} v vector to translate by
         * @return {Matrix4} this
         */
        translate(v: any): this;
        /**
         * Scales the mat3 by the dimensions in the given vec2
         * @param {Vector3} v the vec3 to scale the matrix by
         * @return {Matrix4} this
         */
        scale(v: any): this;
        /**
         * Rotates this by the given angle
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Vector3} axis the axis to rotate around
         * @return {Matrix4} this
         */
        rotate(rad: any, axis: any): this;
        /**
         * Rotates this by the given angle around the X axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        rotateX(rad: any): this;
        /**
         * Rotates this by the given angle around the Y axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        rotateY(rad: any): this;
        /**
         * Rotates this by the given angle around the Z axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        rotateZ(rad: number): this;
        /**
         * Creates a matrix from a vector translation
         * @param {Vector3} transition Translation vector
         * @return {Matrix4} this
         */
        fromTranslation(v: Vector3): this;
        /**
         * Creates a matrix from a vector scaling
         * @param  {Vector3} v Scaling vector
         * @return {Matrix4} this
         */
        fromScaling(v: any): this;
        /**
         * Creates a matrix from a given angle around a given axis
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Vector3} axis the axis to rotate around
         * @return {Matrix4} this
         */
        fromRotation(rad: any, axis: any): this;
        /**
         * Creates a matrix from the given angle around the X axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        fromXRotation(rad: any): this;
        /**
         * Creates a matrix from the given angle around the Y axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        fromYRotation(rad: any): this;
        /**
         * Creates a matrix from the given angle around the Z axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4} this
         */
        fromZRotation(rad: any): this;
        /**
         * Creates a matrix from a quaternion rotation and vector translation
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @return {Matrix4} this
         */
        fromRotationTranslation(q: Quaternion, v: Vector3): this;
        /**
         * Returns the translation vector component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslation,
         *  the returned vector will be the same as the translation vector
         *  originally supplied.
         * @param  {Vector3} [out=new Vector3] Vector to receive translation component
         * @return {Vector3} out
         */
        getTranslation(out?: Vector3): Vector3;
        /**
         * Returns the scaling factor component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslationScale
         *  with a normalized Quaternion paramter, the returned vector will be
         *  the same as the scaling vector
         *  originally supplied.
         * @param  {Vector3} [out=new Vector3] Vector to receive scaling factor component
         * @return {Vector3} out
         */
        getScaling(out?: Vector3): Vector3;
        /**
         * Returns a quaternion representing the rotational component
         *  of a transformation matrix. If a matrix is built with
         *  fromRotationTranslation, the returned quaternion will be the
         *  same as the quaternion originally supplied.
         * @param {Quaternion} out Quaternion to receive the rotation component
         * @return {Quaternion} out
         */
        getRotation(out?: Quaternion): Quaternion;
        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @param  {Vector3} s Scaling vector
         * @return {Matrix4} this
         */
        fromRotationTranslationScale(q: any, v: any, s: any): this;
        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @param  {Vector3} s Scaling vector
         * @param  {Vector3} o The origin vector around which to scale and rotate
         * @return {Matrix4} this
         */
        fromRotationTranslationScaleOrigin(q: any, v: any, s: any, o: any): this;
        /**
         * Calculates a 4x4 matrix from the given quaternion
         * @param {Quaternion} q Quaternion to create matrix from
         * @return {Matrix4} this
         */
        fromQuat(q: any): this;
        /**
         * Generates a frustum matrix with the given bounds
         * @param  {Number} left  Left bound of the frustum
         * @param  {Number} right Right bound of the frustum
         * @param  {Number} bottom Bottom bound of the frustum
         * @param  {Number} top Top bound of the frustum
         * @param  {Number} near Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4} this
         */
        frustum(left: any, right: any, bottom: any, top: any, near: any, far: any): this;
        /**
         * Generates a perspective projection matrix with the given bounds
         * @param {Number} fovy Vertical field of view in radians
         * @param {Number} aspect Aspect ratio. typically viewport width/height
         * @param {Number} near Near bound of the frustum
         * @param {Number} far Far bound of the frustum
         * @return {Matrix4} this
         */
        perspective(fovy: number, aspect: number, near: number, far: number): this;
        /**
         * Generates a perspective projection matrix with the given field of view.
         * @param  {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
         * @param  {Number} Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4} this
         */
        perspectiveFromFieldOfView(fov: any, near: any, far: any): this;
        /**
         * Generates a orthogonal projection matrix with the given bounds
         * @param  {Number} left  Left bound of the frustum
         * @param  {Number} right Right bound of the frustum
         * @param  {Number} bottom Bottom bound of the frustum
         * @param  {Number} top Top bound of the frustum
         * @param  {Number} near Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4} this
         */
        ortho(left: any, right: any, bottom: any, top: any, near: any, far: any): this;
        /**
         * Generates a look-at matrix with the given eye position, focal point, and up axis
         * @param  {XYZObject} eye Position of the viewer
         * @param  {XYZObject} center Point the viewer is looking at
         * @param  {Vector3} up pointing up
         * @return {Matrix4} this
         */
        lookAt(eye: Vector3, center: Vector3, up: Vector3): this;
        /**
         * Generates a matrix that makes something look at something else.
         * @param  {XYZObject} eye Position of the viewer
         * @param  {XYZObject} Point the viewer is looking at
         * @param  {Vector3} up pointing up
         * @return {Matrix4} this
         */
        targetTo(eyePos: Vector3 | Vector3Notifier, targetPos: Vector3 | Vector3Notifier, upVector: Vector3): this;
        /**
         * Returns Frobenius norm of a mat4
         * @return {Number} Frobenius norm
         */
        frob(): number;
        /**
         * Adds two mat4's
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，计算 this 和 a 的和
         * @return {Marix4} this
         */
        add(a: any, b: any): this;
        /**
         * Subtracts matrix b from matrix a
         * @param {Matrix4} a
         * @param {Matrix4} [b]  如果不传，计算 this 和 a 的差
         * @return {Marix4} this
         */
        subtract(a: any, b: any): this;
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，比较 this 和 a 是否相等
         * @return {Boolean}
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，比较 this 和 a 是否近似相等
         * @return {Boolean}
         */
        equals(a: any, b: any): boolean;
        /**
         * compose
         * @param  {Quaternion} q quaternion
         * @param  {Vector3} v position
         * @param  {Vector3} s scale
         * @param  {Vector3} p [pivot]
         * @return {Matrix4}  this
         */
        compose(q: any, v: any, s: any, p: any): this;
        /**
         * decompose
         * @param  {Quaternion} q quaternion
         * @param  {Vector3} v position
         * @param  {Vector3} s scale
         * @param  {Vector3} p [pivot]
         * @return {Matrix4}  this
         */
        decompose(q: any, v: any, s: any, p: any): this;
    }
    export class Matrix4Notifier extends EventObject {
        elements: mat4;
        constructor();
        getClassName(): string;
        /**
         * Copy the values from one mat4 to this
         * @param  {Matrix4} m the source matrix
         * @return {Matrix4Notifier} this
         */
        copy(m: any): this;
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Matrix4Notifier} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a mat3 to the given values
         * @param {Number} m00
         * @param {Number} m01
         * @param {Number} m02
         * @param {Number} m03
         * @param {Number} m10
         * @param {Number} m11
         * @param {Number} m12
         * @param {Number} m13
         * @param {Number} m20
         * @param {Number} m21
         * @param {Number} m22
         * @param {Number} m23
         * @param {Number} m30
         * @param {Number} m31
         * @param {Number} m32
         * @param {Number} m33
         * @return {Matrix4Notifier} this
         */
        set(m00: any, m01: any, m02: any, m03: any, m10: any, m11: any, m12: any, m13: any, m20: any, m21: any, m22: any, m23: any, m30: any, m31: any, m32: any, m33: any): this;
        /**
         * Set this to the identity matrix
         * @return {Matrix4Notifier} this
         */
        identity(): this;
        /**
         * Transpose the values of this
         * @return {Matrix4Notifier} this
         */
        transpose(): this;
        /**
         * invert a matrix
         * @param {Matrix4} [m=this]
         * @return {Matrix4Notifier} this
         */
        invert(m?: this): this;
        /**
         * Calculates the adjugate of a mat4
         * @param {Matrix4} [m=this]
         * @return {Matrix4Notifier} this
         */
        adjoint(m?: this): this;
        /**
         * Calculates the determinant of this
         * @return {Matrix4Notifier} this
         */
        determinant(): number;
        /**
         * Multiplies two matrix4's
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，计算 this 和 a 的乘积
         * @return {Matrix4Notifier} this
         */
        multiply(a: Matrix4Notifier, b?: Matrix4Notifier): this;
        /**
         * 左乘
         * @param {Matrix4} m
         * @return {Matrix4Notifier} this
         */
        premultiply(m: any): this;
        /**
         * Translate this by the given vector
         * @param {Vector3} v vector to translate by
         * @return {Matrix4Notifier} this
         */
        translate(v: any): this;
        /**
         * Scales the mat3 by the dimensions in the given vec2
         * @param {Vector3} v the vec3 to scale the matrix by
         * @return {Matrix4Notifier} this
         */
        scale(v: any): this;
        /**
         * Rotates this by the given angle
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Vector3} axis the axis to rotate around
         * @return {Matrix4Notifier} this
         */
        rotate(rad: any, axis: any): this;
        /**
         * Rotates this by the given angle around the X axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        rotateX(rad: any): this;
        /**
         * Rotates this by the given angle around the Y axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        rotateY(rad: any): this;
        /**
         * Rotates this by the given angle around the Z axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        rotateZ(rad: any): this;
        /**
         * Creates a matrix from a vector translation
         * @param {Vector3} transition Translation vector
         * @return {Matrix4Notifier} this
         */
        fromTranslation(v: any): this;
        /**
         * Creates a matrix from a vector scaling
         * @param  {Vector3} v Scaling vector
         * @return {Matrix4Notifier} this
         */
        fromScaling(v: any): this;
        /**
         * Creates a matrix from a given angle around a given axis
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Vector3} axis the axis to rotate around
         * @return {Matrix4Notifier} this
         */
        fromRotation(rad: any, axis: any): this;
        /**
         * Creates a matrix from the given angle around the X axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        fromXRotation(rad: any): this;
        /**
         * Creates a matrix from the given angle around the Y axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        fromYRotation(rad: any): this;
        /**
         * Creates a matrix from the given angle around the Z axis
         * @param {Number} rad the angle to rotate the matrix by
         * @return {Matrix4Notifier} this
         */
        fromZRotation(rad: any): this;
        /**
         * Creates a matrix from a quaternion rotation and vector translation
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @return {Matrix4Notifier} this
         */
        fromRotationTranslation(q: any, v: any): this;
        /**
         * Returns the translation vector component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslation,
         *  the returned vector will be the same as the translation vector
         *  originally supplied.
         * @param  {Vector3} [out=new Vector3] Vector to receive translation component
         * @return {Vector3} out
         */
        getTranslation(out?: Vector3): Vector3;
        /**
         * Returns the scaling factor component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslationScale
         *  with a normalized Quaternion paramter, the returned vector will be
         *  the same as the scaling vector
         *  originally supplied.
         * @param  {Vector3} [out=new Vector3] Vector to receive scaling factor component
         * @return {Vector3} out
         */
        getScaling(out?: Vector3): Vector3;
        /**
         * Returns a quaternion representing the rotational component
         *  of a transformation matrix. If a matrix is built with
         *  fromRotationTranslation, the returned quaternion will be the
         *  same as the quaternion originally supplied.
         * @param {Quaternion} out Quaternion to receive the rotation component
         * @return {Quaternion} out
         */
        getRotation(out?: Quaternion): Quaternion;
        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @param  {Vector3} s Scaling vector
         * @return {Matrix4Notifier} this
         */
        fromRotationTranslationScale(q: any, v: any, s: any): this;
        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
         * @param  {Quaternion} q Rotation quaternion
         * @param  {Vector3} v Translation vector
         * @param  {Vector3} s Scaling vector
         * @param  {Vector3} o The origin vector around which to scale and rotate
         * @param  {Boolean} [dontFireEvent=false] dontFireEvent
         * @return {Matrix4Notifier} this
         */
        fromRotationTranslationScaleOrigin(q: any, v: any, s: any, o: any, dontFireEvent?: boolean): this;
        /**
         * Calculates a 4x4 matrix from the given quaternion
         * @param {Quaternion} q Quaternion to create matrix from
         * @return {Matrix4Notifier} this
         */
        fromQuat(q: any): this;
        /**
         * Generates a frustum matrix with the given bounds
         * @param  {Number} left  Left bound of the frustum
         * @param  {Number} right Right bound of the frustum
         * @param  {Number} bottom Bottom bound of the frustum
         * @param  {Number} top Top bound of the frustum
         * @param  {Number} near Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4Notifier} this
         */
        frustum(left: any, right: any, bottom: any, top: any, near: any, far: any): this;
        /**
         * Generates a perspective projection matrix with the given bounds
         * @param {Number} fovy Vertical field of view in radians
         * @param {Number} aspect Aspect ratio. typically viewport width/height
         * @param {Number} near Near bound of the frustum
         * @param {Number} far Far bound of the frustum
         * @return {Matrix4Notifier} this
         */
        perspective(fovy: any, aspect: any, near: any, far: any): this;
        /**
         * Generates a perspective projection matrix with the given field of view.
         * @param  {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
         * @param  {Number} Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4Notifier} this
         */
        perspectiveFromFieldOfView(fov: any, near: any, far: any): this;
        /**
         * Generates a orthogonal projection matrix with the given bounds
         * @param  {Number} left  Left bound of the frustum
         * @param  {Number} right Right bound of the frustum
         * @param  {Number} bottom Bottom bound of the frustum
         * @param  {Number} top Top bound of the frustum
         * @param  {Number} near Near bound of the frustum
         * @param  {Number} far Far bound of the frustum
         * @return {Matrix4Notifier} this
         */
        ortho(left: any, right: any, bottom: any, top: any, near: any, far: any): this;
        /**
         * Generates a look-at matrix with the given eye position, focal point, and up axis
         * @param  {XYZObject} eye Position of the viewer
         * @param  {XYZObject} center Point the viewer is looking at
         * @param  {Vector3} up pointing up
         * @return {Matrix4Notifier} this
         */
        lookAt(eye: any, center: any, up: any): this;
        /**
         * Generates a matrix that makes something look at something else.
         * @param  {XYZObject} eye Position of the viewer
         * @param  {XYZObject} Point the viewer is looking at
         * @param  {Vector3} up pointing up
         * @return {Matrix4Notifier} this
         */
        targetTo(eye: any, target: any, up: any): this;
        /**
         * Returns Frobenius norm of a mat4
         * @return {Number} Frobenius norm
         */
        frob(): number;
        /**
         * Adds two mat4's
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，计算 this 和 a 的和
         * @return {Marix4} this
         */
        add(a: any, b: any): this;
        /**
         * Subtracts matrix b from matrix a
         * @param {Matrix4} a
         * @param {Matrix4} [b]  如果不传，计算 this 和 a 的差
         * @return {Marix4} this
         */
        subtract(a: any, b: any): this;
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，比较 this 和 a 是否相等
         * @return {Boolean}
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         * @param {Matrix4} a
         * @param {Matrix4} [b] 如果不传，比较 this 和 a 是否近似相等
         * @return {Boolean}
         */
        equals(a: any, b: any): boolean;
        /**
         * compose
         * @param  {Quaternion} q quaternion
         * @param  {Vector3} v position
         * @param  {Vector3} s scale
         * @param  {Vector3} p [pivot]
         * @return {Matrix4Notifier}  this
         */
        compose(q: any, v: any, s: any, p: any): this;
        /**
         * decompose
         * @param  {Quaternion} q quaternion
         * @param  {Vector3} v position
         * @param  {Vector3} s scale
         * @param  {Vector3} p [pivot]
         * @return {Matrix4Notifier}  this
         */
        decompose(q: any, v: any, s: any, p: any): this;
    }
    export class Plane {
        normal: Vector3;
        distance: number;
        /**
         * @constructs
         * @param  {Vector3} [normal=new Vector3]   法线
         * @param  {Number}  [distance=0] 距离
         */
        constructor(normal?: Vector3, distance?: number);
        getClassName(): string;
        /**
         * Copy the values from one plane to this
         * @param  {Plane} m the source plane
         * @return {Plane} this
         */
        copy(plane: any): this;
        /**
         * Creates a new plane initialized with values from this plane
         * @return {Plane} a new Plane
         */
        clone(): Plane;
        /**
         * [set description]
         * @param {Number} x 法线 x
         * @param {Number} y 法线 y
         * @param {Number} z 法线 z
         * @param {Number} w 距离
         * @return {Plane} this
         */
        set(x: any, y: any, z: any, w: any): this;
        /**
         * 归一化
         * @return {Plane} this
         */
        normalize(): this;
        /**
         * 与点的距离
         * @param  {Vector3} point
         * @return {Number}
         */
        distanceToPoint(point: Vector3): number;
        /**
         * 投影点
         * @param  {Vector3} point
         * @return {Vector3}
         */
        projectPoint(point: any): Vector3;
    }
    export class Quaternion extends EventObject {
        elements: quat;
        /**
         * Creates a new identity quat
         * @constructs
         * @param  {Number} [x=0] X component
         * @param  {Number} [y=0] Y component
         * @param  {Number} [z=0] Z component
         * @param  {Number} [w=1] W component
         */
        constructor(x?: number, y?: number, z?: number, w?: number);
        getClassName(): string;
        /**
         * Copy the values from one quat to this
         * @param  {Quaternion} q
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        copy(q: Quaternion, dontFireEvent?: boolean): this;
        /**
         * Creates a new quat initialized with values from an existing quaternion
         * @return {Quaternion} a new quaternion
         */
        clone(): Quaternion;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        fromArray(array: any, offset: number, dontFireEvent: any): this;
        /**
         * Set the components of a quat to the given values
         * @param {Number} x  X component
         * @param {Number} y  Y component
         * @param {Number} z  Z component
         * @param {Number} w  W component
         * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        set(x: any, y: any, z: any, w: any, dontFireEvent: any): this;
        /**
         * Set this to the identity quaternion
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        identity(dontFireEvent: any): this;
        /**
         * Sets a quaternion to represent the shortest rotation from one
         * vector to another.
         * @param  {Vector3} a the initial vector
         * @param  {Vector3} b the destination vector
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        rotationTo(a: any, b: any, dontFireEvent: any): this;
        /**
         * Sets the specified quaternion with values corresponding to the given
         * axes. Each axis is a vec3 and is expected to be unit length and
         * perpendicular to all other specified axes.
         *
         * @param {Vector3} view  the vector representing the viewing direction
         * @param {Vector3} right the vector representing the local "right" direction
         * @param {Vector3} up    the vector representing the local "up" direction
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        setAxes(view: any, right: any, up: any, dontFireEvent: any): this;
        /**
         * Sets a quat from the given angle and rotation axis,
         * then returns it.
         * @param {Vector3} axis the axis around which to rotate
         * @param {Number} rad the angle in radians
         * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        setAxisAngle(axis: any, rad: any, dontFireEvent: any): this;
        /**
         * Gets the rotation axis and angle for a given
         *  quaternion. If a quaternion is created with
         *  setAxisAngle, this method will return the same
         *  values as providied in the original parameter list
         *  OR functionally equivalent values.
         * Example: The quaternion formed by axis [0, 0, 1] and
         *  angle -90 is the same as the quaternion formed by
         *  [0, 0, 1] and 270. This method favors the latter.
         * @param  {Vector3} out_axis  Vector receiving the axis of rotation
         * @return {Number} Angle, in radians, of the rotation
         */
        getAxisAngle(axis: any): number;
        /**
         * Adds two quat's
         * @param {Quaternion} q
         * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        add(q: any, dontFireEvent: any): this;
        /**
         * Multiplies two quat's
         * @param  {Quaternion} q
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        multiply(q: any, dontFireEvent?: boolean): this;
        /**
         * premultiply the quat
         * @param  {Quaternion} q
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        premultiply(q: any, dontFireEvent: any): this;
        /**
         * Scales a quat by a scalar number
         * @param  {Vector3} scale the vector to scale
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        scale(scale: any, dontFireEvent: any): this;
        /**
         * Rotates a quaternion by the given angle about the X axis
         * @param  {Number} rad angle (in radians) to rotate
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        rotateX(rad: any, dontFireEvent: any): this;
        /**
         * Rotates a quaternion by the given angle about the Y axis
         * @param  {Number} rad angle (in radians) to rotate
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        rotateY(rad: any, dontFireEvent: any): this;
        /**
         * Rotates a quaternion by the given angle about the Z axis
         * @param  {Number} rad angle (in radians) to rotate
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        rotateZ(rad: any, dontFireEvent: any): this;
        /**
         * Calculates the W component of a quat from the X, Y, and Z components.
         * Assumes that quaternion is 1 unit in length.
         * Any existing W component will be ignored.
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @returns {Quaternion} this
         */
        calculateW(dontFireEvent: any): this;
        /**
         * Calculates the dot product of two quat's
         * @param  {Quaternion} q
         * @return {Number} dot product of two quat's
         */
        dot(q: any): number;
        /**
         * Performs a linear interpolation between two quat's
         * @param  {Quaternion} q
         * @param  {Number} t interpolation amount between the two inputs
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        lerp(q: any, t: any, dontFireEvent: any): this;
        /**
         * Performs a spherical linear interpolation between two quat
         * @param  {Quaternion} q
         * @param  {Number} t interpolation amount between the two inputs
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        slerp(q: any, t: any, dontFireEvent: any): this;
        /**
         * Performs a spherical linear interpolation with two control points
         * @param  {Quaternion} qa
         * @param  {Quaternion} qb
         * @param  {Quaternion} qc
         * @param  {Quaternion} qd
         * @param  {Number} t interpolation amount
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        sqlerp(qa: any, qb: any, qc: any, qd: any, t: any, dontFireEvent: any): this;
        /**
         * Calculates the inverse of a quat
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        invert(dontFireEvent: any): this;
        /**
         * Calculates the conjugate of a quat
         * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        conjugate(dontFireEvent?: boolean): this;
        /**
         * Calculates the length of a quat
         * @return {Number} length of this
         */
        length(): number;
        /**
         * Calculates the squared length of a quat
         * @return {Number} squared length of this
         */
        squaredLength(): number;
        /**
         * Normalize this
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        normalize(dontFireEvent: any): this;
        /**
         * Creates a quaternion from the given 3x3 rotation matrix.
         *
         * NOTE: The resultant quaternion is not normalized, so you should be sure
         * to renormalize the quaternion yourself where necessary.
         *
         * @param {Matrix3} m rotation matrix
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        fromMat3(mat: any, dontFireEvent: any): this;
        /**
         * Creates a quaternion from the given 3x3 rotation matrix.
         *
         * NOTE: The resultant quaternion is not normalized, so you should be sure
         * to renormalize the quaternion yourself where necessary.
         *
         * @param {Matrix4} m rotation matrix
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        fromMat4(mat: Matrix4, dontFireEvent?: boolean): this;
        /**
         * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
         * @param  {Quaternion} q
         * @return {Boolean}
         */
        exactEquals(q: any): boolean;
        /**
         * Returns whether or not the quaternions have approximately the same elements in the same position.
         * @param  {Quaternion} q
         * @return {Boolean}
         */
        equals(q: any): boolean;
        /**
         * Creates a quaternion from the given euler.
         * @param  {Euler} euler
         * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
         * @return {Quaternion} this
         */
        fromEuler(euler: any, dontFireEvent?: boolean): this;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get w(): number;
        set w(value: number);
        mul(a: Quaternion, b: boolean): this;
        mulVec3(r: Vector3): Quaternion;
        len(): number;
        sqrLen(): number;
        getForward(): Vector3;
        getBack(): Vector3;
        getUp(): Vector3;
        getDown(): Vector3;
        getRight(): Vector3;
        getLeft(): Vector3;
    }
    export class Sphere {
        /**
         * 半径
         * @type {Number}
         * @default 0
         */
        radius: number;
        center: Vector3;
        /**
         * @constructs
         * @param {object} params 初始化参数，所有params都会复制到实例上
         */
        constructor(params?: any);
        getClassName(): string;
        /**
         * 克隆
         * @return {Sphere}
         */
        clone(): Sphere;
        /**
         * 复制
         * @param  {Sphere} sphere
         * @return {Sphere} this
         */
        copy(sphere: any): this;
        /**
         * 从点生成
         * @param  {Array} points
         * @return {Sphere} this
         */
        fromPoints(points: any): this;
        /**
         * 从点生成
         * @param  {GeometryData} geometryData
         * @return {Sphere} this
         */
        fromGeometryData(geometryData: any): this;
        /**
         * transformMat4
         * @param  {Matrix4} mat4
         * @return {Sphere} this
         */
        transformMat4(mat4: any): this;
    }
    export class Transform {
        /**
         * 元素的up向量
         * @type {Vector3}
         */
        up: Vector3;
        constructor();
        getClassName(): string;
        /**
         * 设置元素的缩放比例
         * @param {number} x X缩放比例
         * @param {number} y Y缩放比例
         * @param {number} z Z缩放比例
         * @return {Node} this
         */
        setScale(x: number, y?: number, z?: number): this;
        /**
         * 设置元素的位置
         * @param {number} x X方向位置
         * @param {number} y Y方向位置
         * @param {number} z Z方向位置
         * @return {Node} this
         */
        setPosition(x: number, y: number, z: number): this;
        /**
         * 设置元素的旋转
         * @param {number} x X轴旋转角度, 角度制
         * @param {number} y Y轴旋转角度, 角度制
         * @param {number} z Z轴旋转角度, 角度制
         * @return {Node} this
         */
        setRotation(x: number, y: number, z: number): this;
        /**
         * 设置中心点
         * @param {Number} x 中心点x
         * @param {Number} y 中心点y
         * @param {Number} z 中心点z
         * @return {Node} this
         */
        setPivot(x: number, y: number, z: number): this;
        get position(): Vector3Notifier;
        set position(value: Vector3Notifier);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get scale(): Vector3Notifier;
        set scale(value: Vector3Notifier);
        get scaleX(): number;
        set scaleX(value: number);
        get scaleY(): number;
        set scaleY(value: number);
        get scaleZ(): number;
        set scaleZ(value: number);
        get pivot(): Vector3Notifier;
        set pivot(value: Vector3Notifier);
        get pivotX(): number;
        set pivotX(value: number);
        get pivotY(): number;
        set pivotY(value: number);
        get pivotZ(): number;
        set pivotZ(value: number);
        get rotation(): EulerNotifier;
        set rotation(value: EulerNotifier);
        get rotationX(): number;
        set rotationX(value: number);
        get rotationY(): number;
        set rotationY(value: number);
        get rotationZ(): number;
        set rotationZ(value: number);
        get quaternion(): Quaternion;
        set quaternion(value: Quaternion);
        /** =====================> quaternion <=========================== */
        copyFrom(transform: Transform): void;
        _onQuaternionUpdate(): void;
        get matrix(): Matrix4Notifier;
        set matrix(value: Matrix4Notifier);
        /**
         * 更新本地矩阵
         * @return {Node} this
         */
        updateMatrix(): this;
        /**
         * 更新四元数
         * @return {Node} this
         */
        updateQuaternion(): this;
        /**
         * 更新transform属性
         * @return {Node} this
         */
        updateTransform(): this;
    }
    var EPSILON;
    export class Utils {
        static each(obj: any, fn: any): void;
        static copyArrayData(destArr: any, srcArr: any, destIdx: any, srcIdx: any, count: any): void;
        static hasOwnProperty(obj: any, name: any): any;
        static getElementRect(elem: HTMLCanvasElement): {
            left: any;
            top: any;
            width: number;
            height: number;
        };
        static padLeft(str: string, len: number, char?: string): string;
        static getTypedArrayGLType(array: any): number;
        static getTypedArrayClass(type: any): Float32ArrayConstructor | Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
        static getExtension(url: any): string;
    }
    export class Vector2 {
        elements: vec2;
        /**
         * Creates a new empty vec2
         * @param {Number} [x=0] X component
         * @param {Number} [y=0] Y component
         * @constructs
         */
        constructor(x?: number, y?: number);
        getClassName(): string;
        /**
         * Copy the values from one vec2 to this
         * @param  {Vector2} m the source vector
         * @return {Vector2} this
         */
        copy(v: any): this;
        /**
         * Creates a new vec2 initialized with values from this vector
         * @return {Vector2} a new Vector2
         */
        clone(): Vector2;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Vector2} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a vec4 to the given values
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {Vector2} this
         */
        set(x: any, y: any): this;
        /**
         * Adds two vec2's
         * @param {Vector2} a
         * @param {Vector2} [b] 如果不传，计算 this 和 a 的和
         * @returns {Vector2} this
         */
        add(a: any, b: any): this;
        /**
         * Subtracts vector b from vector a
         * @param {Vector2} a
         * @param {Vector2} [b] 如果不传，计算 this 和 a 的差
         * @returns {Vector2} this
         */
        subtract(a: any, b: any): this;
        /**
         * Multiplies two vec2's
         * @param {Vector2} a
         * @param {Vector2} [b] 如果不传，计算 this 和 a 的积
         * @returns {Vector2} this
         */
        multiply(a: any, b: any): this;
        /**
         * Divides two vec2's
         * @param {Vector2} a
         * @param {Vector2} [b] 如果不传，计算 this 和 a 的商
         * @returns {Vector2} this
         */
        divide(a: any, b: any): this;
        /**
         * Math.ceil the components of this
         * @returns {Vector2} this
         */
        ceil(): this;
        /**
         * Math.floor the components of this
         * @returns {Vector2} this
         */
        floor(): this;
        /**
         * Returns the minimum of two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector2} this
         */
        min(a: any, b: any): this;
        /**
         * Returns the maximum of two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b]  如果不传，计算 this 和 a 的结果
         * @returns {Vector2} this
         */
        max(a: any, b: any): this;
        /**
         * Math.round the components of this
         * @returns {Vector2} this
         */
        round(): this;
        /**
         * Scales this by a scalar number
         * @param  {Number} scale amount to scale the vector by
         * @returns {Vector2} this
         */
        scale(scale: any): this;
        /**
         * Adds two vec2's after scaling the second vector by a scalar value
         * @param  {Number} scale the amount to scale the second vector by before adding
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector2} this
         */
        scaleAndAdd(scale: any, a: any, b: any): this;
        /**
         * Calculates the euclidian distance between two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} distance between a and b
         */
        distance(a: any, b: any): number;
        /**
         * Calculates the squared euclidian distance between two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} squared distance between a and b
         */
        squaredDistance(a: any, b: any): number;
        /**
         * Calculates the length of this
         * @return {Number} length of this
         */
        length(): number;
        /**
         * Calculates the squared length of this
         * @return {Number} squared length of this
         */
        squaredLength(): number;
        /**
         * Negates the components of this
         * @returns {Vector2} this
         */
        negate(): this;
        /**
         * Returns the inverse of the components of a vec2
         * @param  {Vector2} [a=this]
         * @returns {Vector2} this
         */
        inverse(a: any): this;
        /**
         * Normalize this
         * @returns {Vector2} this
         */
        normalize(): this;
        /**
         * Calculates the dot product of two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  product of a and b
         */
        dot(a: any, b: any): number;
        /**
         * Computes the cross product of two vec2's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  cross product of a and b
         */
        cross(a: Vector2, b?: Vector2): this;
        /**
         * Performs a linear interpolation between two vec2's
         * @param  {Vector2} v
         * @param  {Number} t interpolation amount between the two vectors
         * @returns {Vector2} this
         */
        lerp(v: any, t: any): this;
        /**
         * Generates a random vector with the given scale
         * @param  {Number} [scale=1] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector2} this
         */
        random(scale: any): this;
        /**
         * Transforms the vec2 with a mat3
         * @param  {Matrix3} m matrix to transform with
         * @returns {Vector2} this
         */
        transformMat3(m: any): this;
        /**
         * Transforms the vec2 with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector2} this
         */
        transformMat4(m: any): this;
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(a: any, b: any): boolean;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        sub(a: Vector2, b?: Vector2): this;
        mul(a: any, b: any): this;
        div(a: any, b: any): this;
        dist(a: any, b: any): number;
        sqrDist(a: any, b: any): number;
        len(): number;
        sqrLen(a: any, b: any): number;
    }
    export class Vector3 {
        elements: vec3;
        /**
         * Creates a new empty vec3
         * @param {Number} [x=0] X component
         * @param {Number} [y=0] Y component
         * @param {Number} [z=0] Z component
         * @constructs
         */
        constructor(x?: number, y?: number, z?: number);
        getClassName(): string;
        /**
         * Copy the values from one vec3 to this
         * @param  {Vector3} m the source vector
         * @return {Vector3} this
         */
        copy(v: any): this;
        /**
         * Creates a new vec3 initialized with values from this vec3
         * @return {Vector3} a new Vector3
         */
        clone(): Vector3;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Vector3} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a vec3 to the given values
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @returns {Vector3} this
         */
        set(x: any, y: any, z: any): this;
        /**
         * Adds two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的和
         * @returns {Vector3} this
         */
        add(a: Vector3, b?: Vector3): this;
        /**
         * Subtracts vector b from vector a
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的差
         * @returns {Vector3} this
         */
        subtract(a: Vector3, b?: Vector3): this;
        /**
         * Multiplies two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的积
         * @returns {Vector3} this
         */
        multiply(a: any, b: any): this;
        /**
         * Divides two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的商
         * @returns {Vector3} this
         */
        divide(a: any, b: any): this;
        /**
         * Math.ceil the components of this
         * @returns {Vector3} this
         */
        ceil(): this;
        /**
         * Math.floor the components of this
         * @returns {Vector3} this
         */
        floor(): this;
        /**
         * Returns the minimum of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector3} this
         */
        min(a: any, b: any): this;
        /**
         * Returns the maximum of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b]  如果不传，计算 this 和 a 的结果
         * @returns {Vector3} this
         */
        max(a: any, b: any): this;
        /**
         * Math.round the components of this
         * @returns {Vector3} this
         */
        round(): this;
        /**
         * Scales this by a scalar number
         * @param  {Number} scale amount to scale the vector by
         * @returns {Vector3} this
         */
        scale(scale: any): this;
        /**
         * Adds two vec3's after scaling the second vector by a scalar value
         * @param  {Number} scale the amount to scale the second vector by before adding
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector3} this
         */
        scaleAndAdd(scale: any, a: any, b: any): this;
        /**
         * Calculates the euclidian distance between two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} distance between a and b
         */
        distance(a: any, b: any): number;
        /**
         * Calculates the squared euclidian distance between two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} squared distance between a and b
         */
        squaredDistance(a: any, b: any): number;
        /**
         * Calculates the length of this
         * @return {Number} length of this
         */
        length(): number;
        /**
         * Calculates the squared length of this
         * @return {Number} squared length of this
         */
        squaredLength(): number;
        /**
         * Negates the components of this
         * @returns {Vector3} this
         */
        negate(): this;
        /**
         * Returns the inverse of the components of a vec3
         * @param  {Vector3} [a=this]
         * @returns {Vector3} this
         */
        inverse(a: any): this;
        /**
         * Normalize this
         * @returns {Vector3} this
         */
        normalize(): this;
        /**
         * Calculates the dot product of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  product of a and b
         */
        dot(a: Vector3, b?: Vector3): number;
        /**
         * Computes the cross product of two vec3's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  cross product of a and b
         */
        cross(a: Vector3, b?: Vector3): this;
        /**
         * Performs a linear interpolation between two vec3's
         * @param  {Vector3} v
         * @param  {Number} t interpolation amount between the two vectors
         * @returns {Vector3} this
         */
        lerp(v: any, t: any): this;
        /**
         * Performs a hermite interpolation with two control points
         * @param  {Vector3} a
         * @param  {Vector3} b
         * @param  {Vector3} c
         * @param  {Vector3} d
         * @param  {Number} t interpolation amount between the two inputs
         * @return {Vector3} this
         */
        hermite(a: any, b: any, c: any, d: any, t: any): this;
        /**
         * Performs a bezier interpolation with two control points
         * @param  {Vector3} a
         * @param  {Vector3} b
         * @param  {Vector3} c
         * @param  {Vector3} d
         * @param  {Number} t interpolation amount between the two inputs
         * @return {Vector3} this
         */
        bezier(a: any, b: any, c: any, d: any, t: any): this;
        /**
         * Generates a random vector with the given scale
         * @param  {Number} [scale=1] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector3} this
         */
        random(scale: any): this;
        /**
         * Transforms the vec3 with a mat3
         * @param  {Matrix3} m matrix to transform with
         * @returns {Vector3} this
         */
        transformMat3(m: any): this;
        /**
         * Transforms the vec3 with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector3} this
         */
        transformMat4(m: any): this;
        /**
         * Transforms the vec3 direction with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector3} this
         */
        transformDirection(m: any): this;
        /**
         * Transforms the vec3 with a quat
         * @param  {Quaternion} q quaternion to transform with
         * @returns {Vector3} this
         */
        transformQuat(q: any): this;
        /**
         * Rotate this 3D vector around the x-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateX(origin: any, rotation: any): this;
        /**
         * Rotate this 3D vector around the y-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateY(origin: any, rotation: any): this;
        /**
         * Rotate this 3D vector around the z-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateZ(origin: any, rotation: any): this;
        rotate(rotation: Quaternion): Vector3;
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(a: Vector3, b?: Vector3): boolean;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        sub(a: Vector3, b?: Vector3): this;
        mul(a: any, b: any): this;
        div(a: any, b: any): this;
        dist(a: any, b: any): number;
        sqrDist(a: any, b: any): number;
        len(): number;
        sqrLen(): number;
    }
    export class Vector3Notifier extends EventObject {
        elements: vec3;
        /**
         * Creates a new empty vec3
         * @param {Number} [x=0] X component
         * @param {Number} [y=0] Y component
         * @param {Number} [z=0] Z component
         * @constructs
         */
        constructor(x?: number, y?: number, z?: number);
        getClassName(): string;
        /**
         * Copy the values from one vec3 to this
         * @param  {Vector3} m the source vector
         * @return {Vector3} this
         */
        copy(v: any): this;
        /**
         * Creates a new vec3 initialized with values from this vec3
         * @return {Vector3} a new Vector3
         */
        clone(): Vector3Notifier;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: any[], offset?: number): any[];
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Vector3} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a vec3 to the given values
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @returns {Vector3Notifier} this
         */
        set(x: any, y: any, z: any): this;
        /**
         * Adds two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的和
         * @returns {Vector3Notifier} this
         */
        add(a: Vector3Notifier | Vector3, b?: Vector3Notifier | Vector3): this;
        /**
         * Subtracts vector b from vector a
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的差
         * @returns {Vector3Notifier} this
         */
        subtract(a: any, b: any): this;
        /**
         * Multiplies two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的积
         * @returns {Vector3Notifier} this
         */
        multiply(a: any, b: any): this;
        /**
         * Divides two vec3's
         * @param {Vector3} a
         * @param {Vector3} [b] 如果不传，计算 this 和 a 的商
         * @returns {Vector3Notifier} this
         */
        divide(a: any, b: any): this;
        /**
         * Math.ceil the components of this
         * @returns {Vector3Notifier} this
         */
        ceil(): this;
        /**
         * Math.floor the components of this
         * @returns {Vector3Notifier} this
         */
        floor(): this;
        /**
         * Returns the minimum of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector3Notifier} this
         */
        min(a: any, b: any): this;
        /**
         * Returns the maximum of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b]  如果不传，计算 this 和 a 的结果
         * @returns {Vector3Notifier} this
         */
        max(a: any, b: any): this;
        /**
         * Math.round the components of this
         * @returns {Vector3Notifier} this
         */
        round(): this;
        /**
         * Scales this by a scalar number
         * @param  {Number} scale amount to scale the vector by
         * @returns {Vector3Notifier} this
         */
        scale(scale: any): this;
        /**
         * Adds two vec3's after scaling the second vector by a scalar value
         * @param  {Number} scale the amount to scale the second vector by before adding
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector3Notifier} this
         */
        scaleAndAdd(scale: any, a: any, b: any): this;
        /**
         * Calculates the euclidian distance between two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} distance between a and b
         */
        distance(a: any, b: any): number;
        /**
         * Calculates the squared euclidian distance between two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} squared distance between a and b
         */
        squaredDistance(a: any, b: any): number;
        /**
         * Calculates the length of this
         * @return {Number} length of this
         */
        length(): number;
        /**
         * Calculates the squared length of this
         * @return {Number} squared length of this
         */
        squaredLength(): number;
        /**
         * Negates the components of this
         * @returns {Vector3Notifier} this
         */
        negate(): this;
        /**
         * Returns the inverse of the components of a vec3
         * @param  {Vector3} [a=this]
         * @returns {Vector3Notifier} this
         */
        inverse(a: any): this;
        /**
         * Normalize this
         * @returns {Vector3Notifier} this
         */
        normalize(): this;
        /**
         * Calculates the dot product of two vec3's
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  product of a and b
         */
        dot(a: any, b: any): number;
        /**
         * Computes the cross product of two vec3's
         * @param  {Vector2} a
         * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  cross product of a and b
         */
        cross(a: any, b: any): this;
        /**
         * Performs a linear interpolation between two vec3's
         * @param  {Vector3} v
         * @param  {Number} t interpolation amount between the two vectors
         * @returns {Vector3Notifier} this
         */
        lerp(v: any, t: any): this;
        /**
         * Performs a hermite interpolation with two control points
         * @param  {Vector3} a
         * @param  {Vector3} b
         * @param  {Vector3} c
         * @param  {Vector3} d
         * @param  {Number} t interpolation amount between the two inputs
         * @return {Vector3} this
         */
        hermite(a: any, b: any, c: any, d: any, t: any): this;
        /**
         * Performs a bezier interpolation with two control points
         * @param  {Vector3} a
         * @param  {Vector3} b
         * @param  {Vector3} c
         * @param  {Vector3} d
         * @param  {Number} t interpolation amount between the two inputs
         * @return {Vector3} this
         */
        bezier(a: any, b: any, c: any, d: any, t: any): this;
        /**
         * Generates a random vector with the given scale
         * @param  {Number} [scale=1] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector3Notifier} this
         */
        random(scale: any): this;
        /**
         * Transforms the vec3 with a mat3
         * @param  {Matrix3} m matrix to transform with
         * @returns {Vector3Notifier} this
         */
        transformMat3(m: any): this;
        /**
         * Transforms the vec3 with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector3Notifier} this
         */
        transformMat4(m: any): this;
        /**
         * Transforms the vec3 direction with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector3Notifier} this
         */
        transformDirection(m: any): this;
        /**
         * Transforms the vec3 with a quat
         * @param  {Quaternion} q quaternion to transform with
         * @returns {Vector3Notifier} this
         */
        transformQuat(q: any): this;
        /**
         * Rotate this 3D vector around the x-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateX(origin: any, rotation: any): this;
        /**
         * Rotate this 3D vector around the y-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateY(origin: any, rotation: any): this;
        /**
         * Rotate this 3D vector around the z-axis
         * @param  {Vector3} origin The origin of the rotation
         * @param  {Number} rotation The angle of rotation
         * @return {Vector3} this
         */
        rotateZ(origin: any, rotation: any): this;
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         * @param  {Vector3} a
         * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(a: any, b: any): boolean;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
    }
    export class Vector4 {
        elements: vec4;
        /**
         * Creates a new empty vec4
         * @param {Number} [x=0] X component
         * @param {Number} [y=0] Y component
         * @param {Number} [z=0] Z component
         * @param {Number} [w=0] W component
         * @constructs
         */
        constructor(x?: number, y?: number, z?: number, w?: number);
        getClassName(): string;
        /**
         * Copy the values from one vec4 to this
         * @param  {Vector4} m the source vector
         * @return {Vector4} this
         */
        copy(v: any): this;
        /**
         * Creates a new vec4 initialized with values from this vector
         * @return {Vector4} a new Vector4
         */
        clone(): Vector4;
        /**
         * 转换到数组
         * @param  {Array}  [array=[]] 数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Array}
         */
        toArray(array?: Float32Array, offset?: number): Float32Array;
        /**
         * 从数组赋值
         * @param  {Array} array  数组
         * @param  {Number} [offset=0] 数组偏移值
         * @return {Vector4} this
         */
        fromArray(array: any, offset?: number): this;
        /**
         * Set the components of a vec4 to the given values
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @returns {Vector4} this
         */
        set(x: any, y: any, z: any, w: any): this;
        /**
         * Adds two vec4's
         * @param {Vector4} a
         * @param {Vector4} [b] 如果不传，计算 this 和 a 的和
         * @returns {Vector4} this
         */
        add(a: any, b: any): this;
        /**
         * Subtracts vector b from vector a
         * @param {Vector4} a
         * @param {Vector4} [b] 如果不传，计算 this 和 a 的差
         * @returns {Vector4} this
         */
        subtract(a: any, b: any): this;
        /**
         * Multiplies two vec4's
         * @param {Vector4} a
         * @param {Vector4} [b] 如果不传，计算 this 和 a 的积
         * @returns {Vector4} this
         */
        multiply(a: any, b: any): this;
        /**
         * Divides two vec4's
         * @param {Vector4} a
         * @param {Vector4} [b] 如果不传，计算 this 和 a 的商
         * @returns {Vector4} this
         */
        divide(a: any, b: any): this;
        /**
         * Math.ceil the components of this
         * @returns {Vector4} this
         */
        ceil(): this;
        /**
         * Math.floor the components of this
         * @returns {Vector4} this
         */
        floor(): this;
        /**
         * Returns the minimum of two vec4's
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector4} this
         */
        min(a: any, b: any): this;
        /**
         * Returns the maximum of two vec4's
         * @param  {Vector4} a
         * @param  {Vector4} [b]  如果不传，计算 this 和 a 的结果
         * @returns {Vector4} this
         */
        max(a: any, b: any): this;
        /**
         * Math.round the components of this
         * @returns {Vector4} this
         */
        round(): this;
        /**
         * Scales this by a scalar number
         * @param  {Number} scale amount to scale the vector by
         * @returns {Vector4} this
         */
        scale(scale: any): this;
        /**
         * Adds two vec4's after scaling the second vector by a scalar value
         * @param  {Number} scale the amount to scale the second vector by before adding
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @returns {Vector4} this
         */
        scaleAndAdd(scale: any, a: any, b: any): this;
        /**
         * Calculates the euclidian distance between two vec4's
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} distance between a and b
         */
        distance(a: any, b: any): number;
        /**
         * Calculates the squared euclidian distance between two vec4's
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number} squared distance between a and b
         */
        squaredDistance(a: any, b: any): number;
        /**
         * Calculates the length of this
         * @return {Number} length of this
         */
        length(): number;
        /**
         * Calculates the squared length of this
         * @return {Number} squared length of this
         */
        squaredLength(): number;
        /**
         * Negates the components of this
         * @returns {Vector4} this
         */
        negate(): this;
        /**
         * Returns the inverse of the components of a vec4
         * @param  {Vector4} [a=this]
         * @returns {Vector4} this
         */
        inverse(a: any): this;
        /**
         * Normalize this
         * @returns {Vector4} this
         */
        normalize(): this;
        /**
         * Calculates the dot product of two vec4's
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @return {Number}  product of a and b
         */
        dot(a: any, b: any): number;
        /**
         * Performs a linear interpolation between two vec4's
         * @param  {Vector4} v
         * @param  {Number} t interpolation amount between the two vectors
         * @returns {Vector4} this
         */
        lerp(v: any, t: any): this;
        /**
         * Generates a random vector with the given scale
         * @param  {Number} [scale=1] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector4} this
         */
        random(scale: any): this;
        /**
         * Transforms the vec4 with a mat4
         * @param  {Matrix4} m matrix to transform with
         * @returns {Vector4} this
         */
        transformMat4(m: any): this;
        /**
         * Transforms the vec4 with a quat
         * @param  {Quaternion} q quaternion to transform with
         * @returns {Vector4} this
         */
        transformQuat(q: any): this;
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        exactEquals(a: any, b: any): boolean;
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         * @param  {Vector4} a
         * @param  {Vector4} [b] 如果不传，计算 this 和 a 的结果
         * @return {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(a: any, b: any): boolean;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get w(): number;
        set w(value: number);
        sub(a: any, b: any): this;
        mul(a: any, b: any): this;
        div(a: any, b: any): this;
        dist(a: any, b: any): number;
        sqrDist(a: any, b: any): number;
        len(): number;
        sqrLen(): number;
    }
    /**
     * @class
     */
    export class Program {
        static get cache(): Pool;
        /**
         * 重置缓存
         */
        static reset(gl: WebGLRenderingContext): void;
        /**
         * 获取程序
         * @param  {Shader} shader
         * @param  {WebGLState} state
         * @param  {Boolean} [ignoreError=false]
         * @return {Program}
         */
        static getProgram(shader: __internal.$shader.$shader.Shader, state: WebGLState, ignoreError?: boolean): any;
        /**
         * 获取空白程序
         * @param  {WebGLState} state
         * @return {Program}
         */
        static getBlankProgram(state: WebGLState): any;
        getClassName(): string;
        /**
         * 片段代码
         * @type {String}
         * @default ''
         */
        fragShader: string;
        /**
         * 顶点代码
         * @type {String}
         * @default ''
         */
        vertexShader: string;
        /**
         * attribute 集合
         * @type {Object}
         * @default null
         */
        attributes: Object;
        /**
         * uniform 集合
         * @type {Object}
         * @default null
         */
        uniforms: Object;
        /**
         * program
         * @type {WebGLProgram}
         * @default null
         */
        program: WebGLProgram;
        /**
         * gl
         * @type {WebGL}
         */
        gl: WebGLRenderingContext;
        /**
         * webglState
         * @type {WebGLState}
         * @default null
         */
        state: WebGLState;
        /**
         * 是否始终使用
         * @default true
         * @type {Boolean}
         */
        alwaysUse: Boolean;
        /**
         * id
         * @type {String}
         */
        id: string;
        _dict: Object;
        ignoreError: boolean;
        /**
         * @constructs
         * @param  {WebGLState}state WebGL state
         */
        constructor(state: WebGLState, vertexShader: string, fragShader: string, ignoreError: boolean);
        /**
         * 生成 program
         * @return {WebGLProgram}
         */
        createProgram(): WebGLProgram;
        /**
         * 使用 program
         */
        useProgram(): void;
        /**
         * 生成 shader
         * @param  {Number} shaderType
         * @param  {String} code
         * @return {WebGLShader}
         */
        createShader(shaderType: number, code: string): WebGLShader;
        /**
         * 初始化 attribute 信息
         */
        initAttributes(): void;
        /**
         * 初始化 uniform 信息
         */
        initUniforms(): void;
        /**
         * 没有被引用时销毁资源
         * @param  {WebGLRenderer} renderer
         * @return {Program} this
         */
        destroyIfNoRef(renderer: WebGLRenderer): this;
        _isDestroyed: boolean;
        /**
         * 销毁资源
         * @return {Program} this
         */
        destroy(): this;
    }
    /**
     * 渲染列表
     * @class
     */
    export class RenderList {
        /**
         * 不透明物体列表
         * @type {Array}
         */
        opaqueList: Array<Mesh>;
        /**
         * 透明物体列表
         * @type {Array}
         */
        transparentList: Array<Mesh>;
        /**
         * @constructs
         */
        constructor();
        getClassName(): string;
        /**
         * 重置列表
         */
        reset(): void;
        /**
         * 遍历列表执行回调
         * @param  {RenderList~traverseCallback} callback callback(mesh)nstancedCallback(instancedMeshes)
         */
        traverse(callback: any): void;
        sort(): void;
        /**
         * 增加 mesh
         * @param {Mesh} mesh
         * @param {Camera} camera
         */
        addMesh(mesh: Mesh, camera: Camera): void;
    }
    export interface RenderOptions {
        SIDE?: number;
        HAS_LIGHT?: number;
        PREMULTIPLY_ALPHA?: number;
        HAS_NORMAL?: number;
        NORMAL_MAP_SCALE?: number;
        IGNORE_TRANSPARENT?: number;
        ALPHA_CUTOFF?: number;
        USE_HDR?: number;
        GAMMA_CORRECTION?: number;
        RECEIVE_SHADOWS?: number;
        CAST_SHADOWS?: number;
        USE_PHYSICS_LIGHT?: number;
        IS_DIFFUESENV_AND_AMBIENTLIGHT_WORK_TOGETHER?: number;
        HAS_TEXCOORD0?: number;
        HAS_SPECULAR?: number;
        DIFFUSE_CUBE_MAP?: number;
    }
    /**
     * 语义
     * @namespace semantic
     * @type {Object}
     */
    export class semantic {
        /**
         * @type {State}
         */
        static state: WebGLState;
        /**
         * @type {Camera}
         */
        static camera: Camera;
        /**
         * @type {LightManager}
         */
        static lightManager: LightManager;
        /**
         * @type {WebGLRenderingContext}
         */
        static gl: WebGLRenderingContext;
        /**
         * 初始化
         * @param  {State} _state
         * @param  {Camera} _camera
         * @param  {LightManager} _lightManager
         * @param  {Fog} _fog
         */
        static init(_renderer: WebGLRenderer, _state: WebGLState, _camera: Camera, _lightManager: LightManager): void;
        /**
         * 设置相机
         * @param {Camera} _camera
         */
        static setCamera(_camera: Camera): void;
        static handlerColorOrTexture(value: Color | Texture, textureIndex: any): any;
        static handlerTexture(value: any, textureIndex: any): any;
        static handlerGLTexture(target: any, texture: any, textureIndex: any): any;
        static handlerUV(texture: any): any;
        /**
         * @type {semanticObject}
         */
        static POSITION: Object;
        /**
         * @type {semanticObject}
         */
        static NORMAL: Object;
        /**
         * @type {semanticObject}
         */
        static TANGENT: Object;
        /**
         * @type {semanticObject}
         */
        static TEXCOORD_0: Object;
        /**
         * @type {semanticObject}
         */
        static TEXCOORD_1: Object;
        /**
         * @type {semanticObject}
         */
        static UVMATRIX_0: Object;
        /**
         * @type {semanticObject}
         */
        static UVMATRIX_1: Object;
        /**
         * @type {semanticObject}
         */
        static CAMERAFAR: Object;
        /**
         * @type {semanticObject}
         */
        static CAMERANEAR: Object;
        /**
         * @type {semanticObject}
         */
        static CAMERATYPE: Object;
        static CAMERAPOSITION: Object;
        /**
         * @type {semanticObject}
         */
        static COLOR_0: Object;
        /**
         * @type {semanticObject}
         */
        static RENDERERSIZE: Object;
        /**
         * @type {semanticObject}
         */
        static LOCAL: Object;
        /**
         * @type {semanticObject}
         */
        static MODEL: Object;
        /**
         * @type {semanticObject}
         */
        static VIEW: Object;
        /**
         * @type {semanticObject}
         */
        static PROJECTION: Object;
        /**
         * @type {semanticObject}
         */
        static VIEWPROJECTION: Object;
        /**
         * @type {semanticObject}
         */
        static MODELVIEW: Object;
        /**
         * @type {semanticObject}
         */
        static MODELVIEWPROJECTION: Object;
        /**
         * @type {semanticObject}
         */
        static MODELINVERSE: Object;
        /**
         * @type {semanticObject}
         */
        static VIEWINVERSE: Object;
        /**
         * @type {semanticObject}
         */
        static VIEWINVERSEINVERSETRANSPOSE: Object;
        /**
         * @type {semanticObject}
         */
        static PROJECTIONINVERSE: Object;
        /**
         * @type {semanticObject}
         */
        static MODELVIEWINVERSE: Object;
        /**
         * @type {semanticObject}
         */
        static MODELVIEWPROJECTIONINVERSE: Object;
        /**
         * @type {semanticObject}
         */
        static MODELINVERSETRANSPOSE: Object;
        /**
         * @type {semanticObject}
         */
        static MODELVIEWINVERSETRANSPOSE: Object;
        /**
         * @type {semanticObject}
         */
        static NORMALMAPSCALE: Object;
        /**
         * @type {semanticObject}
         */
        static OCCLUSIONSTRENGTH: Object;
        /**
         * @type {semanticObject}
         */
        static SHININESS: Object;
        /**
         * @type {semanticObject}
         */
        static SPECULARENVMATRIX: Object;
        /**
         * @type {semanticObject}
         */
        static REFLECTIVITY: Object;
        /**
         * @type {semanticObject}
         */
        static REFRACTRATIO: Object;
        /**
         * @type {semanticObject}
         */
        static REFRACTIVITY: Object;
        static LOGDEPTH: Object;
        /**
         * @type {semanticObject}
         */
        static AMBIENTLIGHTSCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSINFO: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSSHADOWMAP: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSSHADOWMAPSIZE: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSSHADOWBIAS: Object;
        /**
         * @type {semanticObject}
         */
        static DIRECTIONALLIGHTSPACEMATRIX: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSPOS: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSINFO: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSRANGE: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSSHADOWMAP: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSSHADOWBIAS: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTSPACEMATRIX: Object;
        /**
         * @type {semanticObject}
         */
        static POINTLIGHTCAMERA: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSPOS: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSDIR: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSCUTOFFS: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSINFO: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSRANGE: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSSHADOWMAP: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSSHADOWMAPSIZE: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSSHADOWBIAS: Object;
        /**
         * @type {semanticObject}
         */
        static SPOTLIGHTSPACEMATRIX: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSPOS: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSWIDTH: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSHEIGHT: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSLTCTEXTURE1: Object;
        /**
         * @type {semanticObject}
         */
        static AREALIGHTSLTCTEXTURE2: Object;
        /**
         * @type {semanticObject}
         */
        static FOGCOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static FOGINFO: Object;
        /**
         * @type {semanticObject}
         */
        static POSITIONDECODEMAT: Object;
        /**
         * @type {semanticObject}
         */
        static NORMALDECODEMAT: Object;
        /**
         * @type {semanticObject}
         */
        static UVDECODEMAT: Object;
        static UV1DECODEMAT: Object;
        /**
         * @type {semanticObject}
         */
        static BASECOLOR: Object;
        /**
         * @type {semanticObject}
         */
        static METALLIC: Object;
        /**
         * @type {semanticObject}
         */
        static ROUGHNESS: Object;
        /**
         * @type {semanticObject}
         */
        static DIFFUSEENVMAP: Object;
        /**
         * @type {semanticObject}
         */
        static DIFFUSEENVINTENSITY: Object;
        static DIFFUSEENVSPHEREHARMONICS3: Object;
        /**
         * @type {semanticObject}
         */
        static BRDFLUT: Object;
        /**
         * @type {semanticObject}
         */
        static SPECULARENVMAP: Object;
        static SPECULARENVINTENSITY: Object;
        static SPECULARENVMAPMIPCOUNT: Object;
        static GLOSSINESS: Object;
        static ALPHACUTOFF: Object;
        static EXPOSURE: Object;
        static GAMMAFACTOR: Object;
        static MORPHWEIGHTS: Object;
    }
    export class TextureOptions {
        uvTypes: Object;
        option: RenderOptions;
        reset(option: RenderOptions): this;
        getClassName(): string;
        add(texture: Texture | Color, optionName: string, callback?: Function): this;
        update(): this;
    }
    /**
     * VAO
     * @class
     */
    export class VertexArrayObject {
        static get cache(): Pool;
        /**
         * 获取 vao
         * @param  {WebGLRenderingContext} gl
         * @param  {String} id  缓存id
         * @param  {Object} params
         * @return {VertexArrayObject}
         */
        static getVao(gl: any, id: any, useVao: boolean, mode: number): any;
        /**
         * 重置所有vao
         * @param  {WebGLRenderingContext} gl
         */
        static reset(gl: any): void;
        /**
         * 绑定系统vao
         */
        static bindSystemVao(): void;
        getClassName(): string;
        /**
         * @default VertexArrayObject
         * @type {String}
         */
        className: String;
        /**
         * @default true
         * @type {Boolean}
         */
        isVertexArrayObject: Boolean;
        /**
         * 顶点数量
         * @type {Number}
         * @private
         */
        vertexCount: number;
        /**
         * 是否使用 vao
         * @type {Boolean}
         * @default false
         */
        useVao: Boolean;
        /**
         * 是否使用 instanced
         * @type {Boolean}
         * @default false
         */
        useInstanced: Boolean;
        /**
         * 绘图方式
         * @type {GLEnum}
         * @default gl.TRIANGLES
         */
        mode: number;
        /**
         * 是否脏
         * @type {Boolean}
         * @default true
         */
        isDirty: boolean;
        gl: WebGLRenderingContext;
        id: string;
        vaoExtension: any;
        instancedExtension: any;
        vao: any;
        attributes: Array<any>;
        activeStates: Array<any>;
        indexBuffer: any;
        indexType: number;
        /**
         * @constructs
         * @param  {WebGLRenderingContext} gl
         * @param  {String} id  缓存id
         * @param  {Object} params
         */
        constructor(gl: any, id: any, useVao: boolean, mode: number);
        /**
         * bind
         */
        bind(): void;
        /**
         * @private
         */
        bindSystemVao(): void;
        /**
         * unbind
         */
        unbind(): void;
        /**
         * draw
         */
        draw(): void;
        /**
         * 获取顶点数量
         * @return {Number} 顶点数量
         */
        getVertexCount(): number;
        /**
         * drawInstance
         * @param  {Number} [primcount=1]
         */
        drawInstance(primcount?: number): void;
        /**
         * addIndexBuffer
         * @param {GeometryData} data
         * @param {GLenum} usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
         * @return {GLBuffer} Buffer
         */
        addIndexBuffer(geometryData: any, usage: any): any;
        /**
         * addAttribute
         * @param {GeometryData} geometryData
         * @param {Object} attribute
         * @param {GLenum} usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
         * @param {Function} onInit
         * @return {AttributeObject} attributeObject
         */
        addAttribute(geometryData: any, attribute: any, usage: any, onInit?: Function): any;
        /**
         * 使用了资源
         * @param  {WebGLResourceManager} resourceManager
         * @param  {Mesh} mesh
         * @return {VertexArrayObject}
         */
        useResource(resourceManager: any, mesh: any): this;
        /**
         * 没有被引用时销毁资源
         * @param  {WebGLRenderer} renderer
         * @return {VertexArrayObject} this
         */
        destroyIfNoRef(renderer: any): this;
        _isDestroyed: boolean;
        /**
         * 销毁资源
         * @return {VertexArrayObject} this
         */
        destroy(): this;
    }
    export class WebGLRenderer extends EventObject {
        /**
         * gl
         * @default null
         * @type {WebGLRenderingContext}
         */
        gl: WebGLRenderingContext;
        /**
         * 宽
         * @type {number}
         * @default 0
         */
        width: number;
        /**
         * 高
         * @type {number}
         * @default 0
         */
        height: number;
        /**
         * 偏移值
         * @type {Number}
         * @default 0
         */
        offsetX: number;
        /**
         * 偏移值
         * @type {Number}
         * @default 0
         */
        offsetY: number;
        /**
         * 像素密度
         * @type {number}
         * @default 1
         */
        pixelRatio: number;
        /**
         * dom元素
         * @type {Canvas}
         * @default null
         */
        domElement: HTMLCanvasElement;
        /**
         * 是否开启透明背景
         * @type {boolean}
         * @default false
         */
        alpha: boolean;
        /**
         * @type {boolean}
         * @default true
         */
        depth: boolean;
        /**
         * @type {boolean}
         * @default false
         */
        stencil: boolean;
        /**
         * 顶点着色器精度, 可以是以下值：highp, mediump, lowp
         * @type {string}
         * @default highp
         */
        vertexPrecision: string;
        /**
         * 片段着色器精度, 可以是以下值：highp, mediump, lowp
         * @type {string}
         * @default mediump
         */
        fragmentPrecision: string;
        /**
         * 是否初始化失败
         * @default false
         * @type {Boolean}
         */
        isInitFailed: boolean;
        /**
         * 是否初始化
         * @type {Boolean}
         * @default false
         * @private
         */
        _isInit: boolean;
        /**
         * 是否lost context
         * @type {Boolean}
         * @default false
         * @private
         */
        _isContextLost: boolean;
        /**
         * 背景色
         * @type {Color}
         * @default new Color(1, 1, 1, 1)
         */
        clearColor: Color;
        /**
         * 渲染信息
         * @type {RenderInfo}
         * @default new RenderInfo
         */
        renderInfo: __internal.$renderer.$RenderInfo.RenderInfo;
        /**
         * 渲染列表
         * @type {RenderList}
         * @default new RenderList
         */
        renderList: RenderList;
        /**
         * 资源管理器
         * @type {WebGLResourceManager}
         * @default new WebGLResourceManager
         */
        lightManager: LightManager;
        resourceManager: __internal.$renderer.$WebGLResourceManager.WebGLResourceManager;
        state: WebGLState;
        /**
         * 是否使用VAO
         * @type {Boolean}
         * @default true
         */
        useVao: boolean;
        constructor(domElement: HTMLCanvasElement, clearColor?: Color);
        getClassName(): string;
        /**
         * 改变大小
         * @param  {number} width  宽
         * @param  {number} height  高
         * @param  {boolean} [force=false] 是否强制刷新
         */
        resize(width: number, height: number, force: boolean): void;
        /**
         * 设置viewport偏移值
         * @param {Number} x x
         * @param {Number} y y
         */
        setOffset(x: number, y: number): void;
        /**
         * 设置viewport
         * @param  {Number} [x=this.offsetX]  x
         * @param  {Number} [y=this.offsetY] y
         * @param  {Number} [width=this.gl.drawingBufferWidth]  width
         * @param  {Number} [height=this.gl.drawingBufferHeight]  height
         */
        viewport(x?: number, y?: number, width?: number, height?: number): void;
        get isInit(): boolean;
        /**
         * 初始化回调
         * @return {WebGLRenderer} this
         */
        onInit(callback: Function): void;
        /**
         * 初始化 context
         */
        initContext(): void;
        _onContextLost(e: any): void;
        _onContextRestore(e: any): void;
        /**
         * 设置深度检测
         * @param  {Material} material
         */
        setupDepthTest(material: Material): void;
        /**
         * 设置背面剔除
         * @param  {Material} material
         */
        setupCullFace(material: Material): void;
        /**
         * 设置混合
         * @param  {Material} material
         */
        setupBlend(material: Material): void;
        forceMaterial: Material;
        /**
         * 设置vao
         * @param  {VertexArrayObject} vao
         * @param  {Program} program
         * @param  {Mesh} mesh
         */
        setupVao(vao: VertexArrayObject, program: Program, mesh: Mesh): void;
        /**
         * 设置通用的 uniform
         * @param  {Program} program
         * @param  {Mesh} mesh
         * @param  {Boolean} [force=false] 是否强制更新
         */
        setupUniforms(program: Program, mesh: Mesh, force: boolean): void;
        /**
         * 设置材质
         * @param  {Program} program
         * @param  {Mesh} mesh
         */
        setupMaterial(program: Program, mesh: Mesh, needForceUpdateUniforms?: boolean): void;
        /**
         * 设置mesh
         * @param  {Mesh} mesh
         * @return {Object} res
         * @return {VertexArrayObject} res.vao
         * @return {Program} res.program
         * @return {Geometry} res.geometry
         */
        setupMesh(mesh: Mesh): {
            vao: any;
            program: any;
            geometry: any;
        };
        /**
         * 增加渲染信息
         * @param {Number} faceCount 面数量
         * @param {Number} drawCount 绘图数量
         */
        addRenderInfo(faceCount: number, drawCount: number): void;
        /**
         * 渲染
         * @param  {Stage} stage
         * @param  {Camera} camera
         * @param  {Boolean} [fireEvent=false] 是否发送事件
         */
        render(stage: Scene, camera: Camera, fireEvent?: boolean): void;
        /**
         * 渲染场景
         */
        renderScene(): void;
        /**
         * 清除背景
         * @param  {Color} [clearColor=this.clearColor]
         */
        clear(clearColor?: Color): void;
        /**
         * 渲染一个mesh
         * @param  {Mesh} mesh
         */
        renderMesh(mesh: any): void;
        /**
         * 渲染一组普通mesh
         * @param  {Mesh[]} meshes
         */
        renderMultipleMeshes(meshes: Array<Mesh>): void;
        /**
         * 销毁 WebGL 资源
         */
        releaseGLResource(): void;
    }
    /**
     * WebGL 状态管理，减少 api 调用
     * @class
     */
    export class WebGLState {
        gl: WebGLRenderingContext;
        preFramebuffer: WebGLFramebuffer;
        /**
         * @constructs
         * @param  {WebGLRenderingContext} gl
         */
        constructor(gl: WebGLRenderingContext);
        getClassName(): string;
        /**
         * 重置状态
         */
        reset(gl: any): void;
        /**
         * enable
         * @param  {GLenum} capability
         */
        enable(capability: number): void;
        /**
         * disable
         * @param  {GLenum} capability
         */
        disable(capability: number): void;
        /**
         * bindFramebuffer
         * @param  {GLenum} target
         * @param  {WebGLFramebuffer} framebuffer
         */
        bindFramebuffer(target: number, framebuffer: WebGLFramebuffer): void;
        /**
         * 绑定系统framebuffer
         */
        bindSystemFramebuffer(): void;
        /**
         * useProgram
         * @param  { WebGLProgram} program
         */
        useProgram(program: WebGLProgram): void;
        /**
         * depthFunc
         * @param  {GLenum } func
         */
        depthFunc(func: number): void;
        /**
         * depthMask
         * @param  {GLenum } flag
         */
        depthMask(flag: number | boolean): void;
        /**
         * clear
         * @param  {Number} mask
         */
        clear(mask: number): void;
        /**
         * depthRange
         * @param  {Number} zNear
         * @param  {Number} zFar
         */
        depthRange(zNear: number, zFar: number): void;
        /**
         * stencilFunc
         * @param  {GLenum} func
         * @param  {Number} ref
         * @param  {Number} mask
         */
        stencilFunc(func: number, ref: number, mask: number): void;
        /**
         * stencilMask
         * @param  {Number} mask
         */
        stencilMask(mask: number): void;
        /**
         * stencilOp
         * @param  {GLenum} fail
         * @param  {GLenum} zfail
         * @param  {GLenum} zpass
         */
        stencilOp(fail: number, zfail: number, zpass: number): void;
        /**
         * colorMask
         * @param  {Boolean} red
         * @param  {Boolean} green
         * @param  {Boolean} blue
         * @param  {Boolean} alpha
         */
        colorMask(red: number, green: number, blue: number, alpha: number): void;
        /**
         * cullFace
         * @param  {GLenum} mode
         */
        cullFace(mode: any): void;
        /**
         * frontFace
         * @param  {GLenum} mode
         */
        frontFace(mode: any): void;
        /**
         * blendFuncSeparate
         * @param  {GLenum} srcRGB
         * @param  {GLenum} dstRGB
         * @param  {GLenum} srcAlpha
         * @param  {GLenum} dstAlpha
         */
        blendFuncSeparate(srcRGB: any, dstRGB: any, srcAlpha: any, dstAlpha: any): void;
        /**
         * blendEquationSeparate
         * @param  {GLenum} modeRGB
         * @param  {GLenum} modeAlpha
         */
        blendEquationSeparate(modeRGB: any, modeAlpha: any): void;
        /**
         * pixelStorei
         * @param  {Glenum} pname
         * @param  {Glenum} param
         */
        pixelStorei(pname: any, param: any): void;
        /**
         * viewport
         * @param  {Number} x
         * @param  {Number} y
         * @param  {Number} width
         * @param  {Number} height
         */
        viewport(x: any, y: any, width: any, height: any): void;
        /**
         * activeTexture
         * @param  {Number} texture
         */
        activeTexture(texture: any): void;
        /**
         * bindTexture
         * @param  {GLenum} target
         * @param  {WebGLTexture } texture
         */
        bindTexture(target: any, texture: any): void;
        /**
         * 获取当前激活的纹理对象
         * @return {TextureUnit}
         */
        getActiveTextureUnit(): any;
        /**
         * 调 gl 1参数方法
         * @private
         * @param  {String} name  方法名
         * @param  {Number|Object} param 方法参数
         */
        set1(name: any, param: any): void;
        /**
         * 调 gl 2参数方法
         * @private
         * @param  {String} name  方法名
         * @param  {Number|Object} param0 方法参数
         * @param  {Number|Object} param1 方法参数
         */
        set2(name: any, param0: any, param1: any): void;
        /**
         * 调 gl 3参数方法
         * @private
         * @param  {String} name  方法名
         * @param  {Number|Object} param0 方法参数
         * @param  {Number|Object} param1 方法参数
         * @param  {Number|Object} param2 方法参数
         */
        set3(name: any, param0: any, param1: any, param2: any): void;
        /**
         * 调 gl 4参数方法
         * @private
         * @param  {String} name  方法名
         * @param  {Number|Object} param0 方法参数
         * @param  {Number|Object} param1 方法参数
         * @param  {Number|Object} param2 方法参数
         * @param  {Number|Object} param3 方法参数
         */
        set4(name: any, param0: any, param1: any, param2: any, param3: any): void;
        get(name: any): any;
    }
    export class Texture extends EventObject {
        static get cache(): Pool;
        /**
         * 重置
         * @param  {WebGLRenderingContext} gl
         */
        static reset(gl: any): void;
        /**
         * 图片资源是否可以释放，可以的话，上传到GPU后将释放图片引用
         * @type {boolean}
         * @default false
         */
        isImageCanRelease: boolean;
        _isImageReleased: boolean;
        _image: any;
        id: string;
        get image(): any;
        set image(_img: any);
        _releaseImage(): void;
        /**
         * mipmaps
         * @type {Image[]|TypedArray[]}
         * @default null
         */
        mipmaps: Array<any>;
        /**
         * Texture Target
         * @default gl.TEXTURE_2D
         * @type {GLenum}
         */
        target: number;
        /**
         * Texture Internal Format
         * @default gl.RGBA
         * @type {GLenum}
         */
        internalFormat: number;
        /**
         * 图片 Format
         * @default gl.RGBA
         * @type {GLenum}
         */
        format: number;
        /**
         * 类型
         * @default gl.UNSIGNED_BYTE
         * @type {GLenum}
         */
        type: number;
        /**
         * @default 0
         * @type {number}
         */
        width: number;
        /**
         * @default 0
         * @type {number}
         */
        height: number;
        /**
         * @default 0
         * @readOnly
         * @type {Number}
         */
        border: number;
        /**
         * magFilter
         * @default gl.LINEAR
         * @type {GLenum}
         */
        magFilter: number;
        /**
         * minFilter
         * @default gl.LINEAR
         * @type {GLenum}
         */
        minFilter: number;
        /**
         * wrapS
         * @default gl.REPEAT
         * @type {GLenum}
         */
        wrapS: number;
        /**
         * wrapT
         * @default gl.REPEAT
         * @type {GLenum}
         */
        wrapT: number;
        /**
         * @type {string}
         */
        name: string;
        /**
         * @default false
         * @type {boolean}
         */
        premultiplyAlpha: boolean;
        /**
         * 是否翻转Texture的Y轴
         * @default false
         * @type {boolean}
         */
        flipY: boolean;
        /**
         * 是否压缩
         * @default false
         * @type {Boolean}
         */
        compressed: boolean;
        /**
         * 是否需要更新Texture
         * @default true
         * @type {boolean}
         */
        needUpdate: boolean;
        /**
         * 是否需要销毁之前的Texture，Texture参数变更之后需要销毁
         * @default false
         * @type {boolean}
         */
        needDestroy: boolean;
        /**
         * 是否每次都更新Texture
         * @default false
         * @type {boolean}
         */
        autoUpdate: boolean;
        /**
         * uv
         * @default 0
         * @type {number}
         */
        uv: number;
        /**
         * anisotropic
         * @default 1
         * @type {Number}
         */
        anisotropic: number;
        get origWidth(): any;
        getClassName(): string;
        get origHeight(): any;
        get useMipmap(): boolean;
        set useMipmap(value: boolean);
        get useRepeat(): boolean;
        set useRepeat(value: boolean);
        get mipmapCount(): number;
        set mipmapCount(value: number);
        /**
         * @constructs
         * @param {object} params 初始化参数，所有params都会复制到实例上
         */
        constructor();
        /**
         * 是否是 2 的 n 次方
         * @param  {Image}  img
         * @return {Boolean}
         */
        isImgPowerOfTwo(img: any): boolean;
        /**
         * 获取支持的尺寸
         * @param  {Image} img
         * @param  {Boolean} [needPowerOfTwo=false]
         * @return {Object} { width, height }
         */
        getSupportSize(img: any, needPowerOfTwo?: boolean): {
            width: any;
            height: any;
        };
        /**
         * 更新图片大小成为 2 的 n 次方
         * @param  {Image} img
         * @return {Canvas|Image}
         */
        resizeImgToPowerOfTwo(img: any): any;
        /**
         * 更新图片大小
         * @param  {Image} img
         * @param {Number} width
         * @param {Number} height
         * @return {Canvas|Image}
         */
        resizeImg(img: any, width: any, height: any): any;
        /**
         * GL上传贴图
         * @private
         * @param  {WebGLState} state
         * @param  {GLEnum} target
         * @param  {Image|TypedArray} image
         * @param  {image} [level=0]
         * @param  {Number} [width=this.width]
         * @param  {Number} [height=this.height]
         * @return {Texture}  this
         */
        _glUploadTexture(state: any, target: any, image: any, level?: number, width?: number, height?: number): this;
        /**
         * 上传贴图，子类可重写
         * @private
         * @param  {WebGLState} state
         * @return {Texture} this
         */
        _uploadTexture(state: any): this;
        /**
         * 更新 Texture
         * @param  {WebGLState} state
         * @param  {WebGLTexture} glTexture
         * @return {Texture} this
         */
        updateTexture(state: any, glTexture: any): this;
        /**
         * 跟新所有的局部贴图
         * @private
         * @param  {WebGLState} state
         * @param  {WebGLTexture} glTexture
         */
        _uploadSubTextures(state: any, glTexture: any): void;
        _needUpdateSubTexture: boolean;
        _subTextureList: Array<any>;
        /**
         * 跟新局部贴图
         * @param  {Number} xOffset
         * @param  {Number} yOffset
         * @param  {Image|Canvas|ImageData} image
         */
        updateSubTexture(xOffset: any, yOffset: any, image: any): void;
        state: WebGLState;
        gl: WebGLRenderingContext;
        /**
         * 获取 GLTexture
         * @param  {WebGLState} state
         * @return {WebGLTexture}
         */
        getGLTexture(state: any): any;
        /**
         * 设置 GLTexture
         * @param {WebGLTexture}  texture
         * @param {Boolean} [needDestroy=false] 是否销毁之前的 GLTexture
         * @return {Texture} this
         */
        setGLTexture(texture: any, needDestroy?: boolean): this;
        /**
         * 销毁当前Texture
         * @return {Texture} this
         */
        destroy(): this;
        /**
         * clone
         * @return {Texture}
         */
        clone(): Texture;
    }
    /**
     * Hilo 2.0.0 for commonjs
     * Copyright 2016 alibaba.com
     * Licensed under the MIT License
     */
    /**
     * @language=en
     * @class Browser feature set
     * @static
     * @module hilo/util/browser
     */
    var browser: {
        /**
         * 是否是iphone
         * @type {Boolean}
         */
        iphone: boolean;
        /**
         * 是否是ipad
         * @type {Boolean}
         */
        ipad: boolean;
        /**
         * 是否是ipod
         * @type {Boolean}
         */
        ipod: boolean;
        /**
         * 是否是ios
         * @type {Boolean}
         */
        ios: boolean;
        /**
         * 是否是android
         * @type {Boolean}
         */
        android: boolean;
        /**
         * 是否是webkit
         * @type {Boolean}
         */
        webkit: boolean;
        /**
         * 是否是chrome
         * @type {Boolean}
         */
        chrome: boolean;
        /**
         * 是否是safari
         * @type {Boolean}
         */
        safari: boolean;
        /**
         * 是否是firefox
         * @type {Boolean}
         */
        firefox: boolean;
        /**
         * 是否是ie
         * @type {Boolean}
         */
        ie: boolean;
        /**
         * 是否是opera
         * @type {Boolean}
         */
        opera: boolean;
        /**
         * 是否支持触碰事件。
         * @type {String}
         */
        supportTouch: boolean;
        /**
         * 是否支持canvas元素。
         * @type {Boolean}
         */
        supportCanvas: boolean;
        /**
         * 是否支持本地存储localStorage。
         * @type {Boolean}
         */
        supportStorage: boolean;
        /**
         * 是否支持检测设备方向orientation。
         * @type {Boolean}
         */
        supportOrientation: boolean;
        /**
         * 是否支持检测加速度devicemotion。
         * @type {Boolean}
         */
        supportDeviceMotion: boolean;
    };
    export class bufferUtil {
        static getTypedArray(constructor: any, length: any): any;
        static fillArrayData(typedArray: any, data: any, offset?: number): void;
        static _updateBuffer(byteSize: any): void;
    }
    /**
     * log
     * @namespace
     */
    export class log {
        static _cache: Object;
        /**
         * log级别
         * @type {Enum}
         */
        static level: number;
        /**
         * 显示log, warn, error
         */
        static LEVEL_LOG: number;
        /**
         * 显示warn, error
         */
        static LEVEL_WARN: number;
        /**
         * 显示error
         */
        static LEVEL_ERROR: number;
        /**
         * 不显示log, warn, error
         */
        static LEVEL_NONE: number;
        /**
         * log，等同 console.log
         * @return {Object} this
         */
        static log(): typeof log;
        /**
         * log，等同 console.log
         * @return {Object} this
         */
        static warn(...args: any[]): typeof log;
        /**
         * error，等同 console.log
         * @return {Object} this
         */
        static error(...args: any[]): typeof log;
        /**
         * logOnce 相同 id 只 log 一次
         * @param {String} id
         * @return {Object} this
         */
        static logOnce(id: any, ...args: any[]): typeof log;
        /**
         * warnOnce  相同 id 只 once 一次
         * @param {String} id
         * @return {Object} this
         */
        static warnOnce(id: string, ...args: any[]): typeof log;
        /**
         * errorOnce 相同 id 只 error 一次
         * @param {String} id
         * @return {Object} this
         */
        static errorOnce(id: any, ...args: any[]): typeof log;
    }
    export class Pool {
        /**
         * @constructs
         */
        constructor();
        getClassName(): string;
        /**
         * 获取对象
         * @param  {String} id
         * @return {Object}
         */
        get(id: any): any;
        /**
         * 获取对象
         * @param {Object} obj
         * @return {Object} [description]
         */
        getObject(obj: any): any;
        /**
         * 增加对象
         * @param {String} id
         * @param {Object} obj
         */
        add(id: any, obj: any): void;
        /**
         * 移除对象
         * @param {String} id
         */
        remove(id: any): void;
        /**
         * 移除对象
         * @param {Object} obj
         */
        removeObject(obj: any): void;
        /**
         * 移除所有对象
         */
        removeAll(): void;
        /**
         * 遍历所有缓存
         * @param  {Function} callback
         */
        each(callback: any): void;
    }
    /**
     * @language=en
     * @class Ticker is a Timer. It can run the code at specified framerate.
     * @param {Number} fps The fps of ticker.Default is 60.
     * @module hilo/util/Ticker
     * @requires hilo/core/Class
     * @requires hilo/util/browser
     */
    export class Ticker {
        constructor(fps: any);
        _paused: boolean;
        _targetFPS: number;
        _interval: number;
        _intervalId: any;
        _tickers: Array<any>;
        _lastTime: number;
        _tickCount: number;
        _tickTime: number;
        _measuredFPS: number;
        _useRAF: boolean;
        /**
         * @language=en
         * Start the ticker.
         * @param {Boolean} userRAF Whether or not use requestAnimationFrame, default is true.
         */
        start(useRAF: any): void;
        /**
         * @language=en
         * Stop the ticker.
         */
        stop(): void;
        /**
         * @language=en
         * Pause the ticker.
         */
        pause(): void;
        /**
         * @language=en
         * Resume the ticker.
         */
        resume(): void;
        /**
         * @private
         */
        _tick(): void;
        /**
         * @language=en
         * Get the fps.
         */
        getMeasuredFPS(): number;
        /**
         * @language=en
         * Add tickObject. The tickObject must implement the tick method.
         * @param {Object} tickObject The tickObject to add.It must implement the tick method.
         */
        addTick(tickObject: any): void;
        /**
         * @language=en
         * Remove the tickObject
         * @param {Object} tickObject The tickObject to remove.
         */
        removeTick(tickObject: any): void;
        /**
         * 下次tick时回调
         * @param  {Function} callback
         * @return {tickObj}
         */
        nextTick(callback: any): {
            tick(dt: any): void;
        };
        /**
         * 延迟指定的时间后调用回调, 类似setTimeout
         * @param  {Function} callback
         * @param  {Number}   duration 延迟的毫秒数
         * @return {tickObj}
         */
        timeout(callback: any, duration: any): {
            tick(): void;
        };
        /**
         * 指定的时间周期来调用函数, 类似setInterval
         * @param  {Function} callback
         * @param  {Number}   duration 时间周期，单位毫秒
         * @return {tickObj}
         */
        interval(callback: any, duration: any): {
            tick(): void;
        };
    }
    namespace __internal {
        namespace $shader {
            namespace $shader {
                /**
                 * Shader类
                 * @class
                 */
                class Shader {
                    /**
                     * vs 顶点代码
                     * @default ''·
                     * @type {String}
                     */
                    vs: string;
                    /**
                     * vs 片段代码
                     * @default ''
                     * @type {String}
                     */
                    fs: string;
                    static renderer: WebGLRenderer;
                    static commonHeader: string;
                    /**
                     * 内部的所有shader块字符串，可以用来拼接glsl代码
                     * @type {Object}
                     */
                    static shaders: Object;
                    /**
                     * 初始化
                     * @param  {WebGLRenderer} renderer
                     */
                    static init(renderer: WebGLRenderer): void;
                    static get cache(): Pool;
                    static get headerCache(): Pool;
                    /**
                     * 重置
                     */
                    static reset(gl: any): void;
                    /**
                     * 获取header缓存的key
                     * @param {Mesh} mesh mesh
                     * @param {Material} material 材质
                     * @param {LightManager} lightManager lightManager
                     * @param {Fog} fog fog
                     * @param {Boolean} useLogDepth 是否使用对数深度
                     * @return {string}
                     */
                    static getHeaderKey(mesh: Mesh, material: any, lightManager: LightManager): string;
                    /**
                     * 获取header
                     * @param {Mesh} mesh
                     * @param {Material} material
                     * @param {LightManager} lightManager
                     * @param {Fog} fog
                     * @return {String}
                     */
                    static getHeader(mesh: Mesh, material: Material, lightManager: LightManager): any;
                    static _getCommonHeader(renderer: any): string;
                    /**
                     * 获取 shader
                     * @param {Mesh} mesh
                     * @param {Material} material
                     * @param {Boolean} isUseInstance
                     * @param {LightManager} lightManager
                     * @param {Fog} fog
                     * @param {Boolean} useLogDepth
                     * @return {Shader}
                     */
                    static getShader(mesh: Mesh, material: Material, lightManager: LightManager): any;
                    /**
                     * 获取基础 shader
                     * @param  {Material}  material
                     * @param  {Boolean} isUseInstance
                     * @param  {LightManager}  lightManager
                     * @param  {Fog}  fog
                     * @return {Shader}
                     */
                    static getBasicShader(material: Material, header: string): any;
                    static _getNumId(obj: any): number;
                    /**
                     * 获取自定义shader
                     * @param  {String} vs 顶点代码
                     * @param  {String} fs 片段代码
                     * @param  {String} [cacheKey] 如果有，会以此值缓存 shader
                     * @param  {String} [useHeaderCache=false] 如果cacheKey和useHeaderCache同时存在，使用 cacheKey+useHeaderCache缓存 shader
                     * @return {Shader}
                     */
                    static getCustomShader(vs: any, fs: any, header: any, cacheKey: any, useHeaderCache?: boolean): any;
                    /**
                     * 是否始终使用
                     * @default true
                     * @type {Boolean}
                     */
                    alwaysUse: boolean;
                    id: number;
                    /**
                     * @constructs
                     * @param  {Object} params 初始化参数，所有params都会复制到实例上
                     */
                    constructor(params: any);
                    getClassName(): string;
                    /**
                     * 没有被引用时销毁资源
                     * @param  {WebGLRenderer} renderer
                     * @return {Shader} this
                     */
                    destroyIfNoRef(renderer: any): this;
                    _isDestroyed: boolean;
                    /**
                     * 销毁资源
                     * @return {Shader} this
                     */
                    destroy(): this;
                }
            }
        }
        namespace $renderer {
            namespace $RenderInfo {
                /**
                 * 渲染信息
                 * @class
                 */
                class RenderInfo {
                    /**
                     * @constructs
                     */
                    constructor();
                    getClassName(): string;
                    /**
                     * 增加面数
                     * @param {number} num
                     */
                    addFaceCount(num: number): void;
                    /**
                     * 增加绘图数
                     * @param {Number} num
                     */
                    addDrawCount(num: any): void;
                    /**
                     * 面数
                     * @type {Number}
                     * @readOnly
                     */
                    faceCount: number;
                    /**
                     * 绘图数
                     * @type {Number}
                     * @readOnly
                     */
                    drawCount: number;
                    /**
                     * 重置信息
                     */
                    reset(): void;
                }
            }
            namespace $WebGLResourceManager {
                /**
                 * WebGLResourceManager 资源管理器
                 * @class
                 */
                class WebGLResourceManager {
                    /**
                     * 是否有需要销毁的资源
                     * @type {boolean}
                     * @default false
                     */
                    hasNeedDestroyResource: boolean;
                    /**
                     * @constructs始化参数，所有params都会复制到实例上
                     */
                    constructor();
                    getClassName(): string;
                    /**
                     * 标记使用资源
                     * @param  {Object} res
                     * @param  {Mesh} mesh 使用资源的mesh
                     * @return {WebGLResourceManager} this
                     */
                    useResource(res: VertexArrayObject, mesh: Mesh): this;
                    /**
                     * 没有引用时销毁资源
                     * @param  {Object} res
                     * @return {WebGLResourceManager} this
                     */
                    destroyIfNoRef(res: any): this;
                    /**
                     * 销毁没被使用的资源
                     * @return {WebGLResourceManager} this
                     */
                    destroyUnsuedResource(): this;
                    /**
                     * 重置
                     * @return {WebGLResourceManager} this
                     */
                    reset(): this;
                }
            }
        }
    }
}