



let test = function () {
  let camera: KILA.PerspectiveCamera = new KILA.PerspectiveCamera();
  camera.aspect = innerWidth / innerHeight;
  camera.far = 100;
  camera.near = 0.1;
  camera.z = 3;

  let scene: KILA.Scene = new KILA.Scene({
    container: document.getElementById('container'),
    width: innerWidth,

    height: innerHeight,
    clearColor: new KILA.Color(0.4, 0.4, 0.4),
    camera: camera,
  });


  let boxGeometry: KILA.BoxGeometry = new KILA.BoxGeometry();
  boxGeometry.setAllRectUV([[0, 1], [1, 1], [1, 0], [0, 0]]);

  let colorBox: KILA.Mesh = new KILA.Mesh();
  colorBox.name = 'colorBox';
  colorBox.geometry = boxGeometry;
  colorBox.material = new KILA.BasicMaterial();
  colorBox.material.diffuse = new KILA.Color(0.8, 0, 0);
  colorBox.x = -1;
  colorBox.onUpdate = function () {
    this.rotationX += .5;
    this.rotationY += .5;
  }
  scene.addChild(colorBox);


  let angle: number = 0;
  let axis = new KILA.Vector3(1, 1, 1).normalize();
  let textureBox: KILA.Mesh = new KILA.Mesh();
  textureBox.name = 'textureBox';
  textureBox.geometry = boxGeometry;
  textureBox.material = new KILA.BasicMaterial();
  textureBox.material.diffuse = new KILA.LazyTexture({
    crossOrigin: true,
    src: '//gw.alicdn.com/tfs/TB1iNtERXXXXXcBaXXXXXXXXXXX-600-600.png'
  });
  textureBox.x = 1;
  textureBox.onUpdate = function () {
    angle += KILA.math.DEG2RAD;
    this.quaternion.setAxisAngle(axis, angle);
  }
  scene.addChild(textureBox);


  let renderer: KILA.WebGLRenderer = scene.renderer;

  let directionLight: KILA.DirectionLight = new KILA.DirectionLight();
  directionLight.color = new KILA.Color(1, 1, 1);
  directionLight.direction = new KILA.Vector3(0, -1, 0);
  scene.addChild(directionLight);

  let ambientLigt: KILA.AmbientLight = new KILA.AmbientLight();
  ambientLigt.color = new KILA.Color(1, 1, 1);
  ambientLigt.amount = 0.5;
  scene.addChild(ambientLigt);


  window.onresize = function () {
    camera.aspect = innerWidth / innerHeight;
    scene.resize(innerWidth, innerHeight);
  }

  let ticker: KILA.Ticker = new KILA.Ticker(60);
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

