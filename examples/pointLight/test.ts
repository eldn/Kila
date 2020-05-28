



let testPointLight = function () {
  let camera: KILA.PerspectiveCamera = new KILA.PerspectiveCamera();
  camera.aspect = innerWidth / innerHeight;
  camera.far = 1000;
  camera.near = 1;
  camera.setPosition(0, 20, 35);
        

  let scene: KILA.Scene = new KILA.Scene({
    container: document.getElementById('container'),
    width: innerWidth,

    height: innerHeight,
    clearColor: new KILA.Color(1, 1, 1, 1),
    camera: camera,
  });

  // let directionLight: KILA.DirectionLight = new KILA.DirectionLight();
  // directionLight.color = new KILA.Color(1, 1, 1);
  // directionLight.direction = new KILA.Vector3(0, -1, 0);
  // scene.addChild(directionLight);


  let ambientLigt: KILA.AmbientLight = new KILA.AmbientLight();
  ambientLigt.color = new KILA.Color(1, 1, 1);
  ambientLigt.amount = 0.5;
  scene.addChild(ambientLigt);


  let pointLight: KILA.PointLight = new KILA.PointLight();
  pointLight.color = new KILA.Color(204 / 255, 0, 255 / 255);
  pointLight.amount = 0.5;
  pointLight.x = 1;
  pointLight.y = 0.5;
  scene.addChild(pointLight);


  let box: KILA.Mesh = new KILA.Mesh();
  box.name = 'colorBox';
  box.geometry = new KILA.BoxGeometry();
  box.material = new KILA.BasicMaterial();
  box.material.diffuse = new KILA.Color(0.8, 0, 0);
  box.rotationX = 30;
  box.rotationY = 30;
  box.y = 2;
  box.setScale(10);
  box.onUpdate = function () {
    this.rotationY++;
  }
  scene.addChild(box);
  camera.lookAt(box);


  let plane = new KILA.Mesh();
  plane.geometry = new KILA.PlaneGeometry();
  plane.material = new KILA.BasicMaterial();
  plane.material.diffuse = new KILA.Color(0.5, 0.5, 0.5);
  plane.material.side = KILA.glConstants.FRONT_AND_BACK;
  plane.rotationX = 90;
  plane.setScale(2000, 2000, 1);
  scene.addChild(plane);
  let renderer: KILA.WebGLRenderer = scene.renderer;


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


  let stats = new KILA.Stats(ticker, scene.renderer.renderInfo, null);
  
}

window.onload = function () {
  testPointLight();
}

