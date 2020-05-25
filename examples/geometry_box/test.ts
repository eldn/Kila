



let test = function () {
  let camera: kila.PerspectiveCamera = new kila.PerspectiveCamera();
  camera.aspect = innerWidth / innerHeight;
  camera.far = 100;
  camera.near = 0.1;
  camera.z = 3;

  let scene: kila.Scene = new kila.Scene({
    container: document.getElementById('container'),
    width: innerWidth,

    height: innerHeight,
    clearColor: new Color(0.4, 0.4, 0.4),
    camera: camera,
  });


  let boxGeometry: kila.BoxGeometry = new kila.BoxGeometry();
  boxGeometry.setAllRectUV([[0, 1], [1, 1], [1, 0], [0, 0]]);

  let colorBox: kila.Mesh = new kila.Mesh();
  colorBox.name = 'colorBox';
  colorBox.geometry = boxGeometry;
  colorBox.material = new kila.BasicMaterial();
  colorBox.material.diffuse = new kila.Color(0.8, 0, 0);
  colorBox.x = -1;
  colorBox.onUpdate = function () {
    this.rotationX += .5;
    this.rotationY += .5;
  }
  scene.addChild(colorBox);


  let angle: number = 0;
  let axis = new kila.Vector3(1, 1, 1).normalize();
  let textureBox: kila.Mesh = new kila.Mesh();
  textureBox.name = 'textureBox';
  textureBox.geometry = boxGeometry;
  textureBox.material = new kila.BasicMaterial();
  textureBox.material.diffuse = new kila.LazyTexture({
    crossOrigin: true,
    src: '//gw.alicdn.com/tfs/TB1iNtERXXXXXcBaXXXXXXXXXXX-600-600.png'
  });
  textureBox.x = 1;
  textureBox.onUpdate = function () {
    angle += math.DEG2RAD;
    this.quaternion.setAxisAngle(axis, angle);
  }
  scene.addChild(textureBox);


  let renderer: WebGLRenderer = scene.renderer;

  let directionLight: DirectionLight = new DirectionLight();
  directionLight.color = new Color(1, 1, 1);
  directionLight.direction = new Vector3(0, -1, 0);
  scene.addChild(directionLight);

  let ambientLigt: AmbientLight = new AmbientLight();
  ambientLigt.color = new Color(1, 1, 1);
  ambientLigt.amount = 0.5;
  scene.addChild(ambientLigt);


  window.onresize = function () {
    camera.aspect = innerWidth / innerHeight;
    scene.resize(innerWidth, innerHeight);
  }

  let ticker: Ticker = new Ticker(60);
  ticker.addTick(scene);

  ['init', 'initFailed'].forEach(function (eventName) {
    scene.renderer.on(eventName, function (e) {
      console.log(e.type, e);
    });
  });

  let gl: WebGLRenderingContext;
  setTimeout(function () {
    ticker.start(true);
    gl = renderer.gl;
  }, 10);


}

window.onload = function () {
  test();
}

