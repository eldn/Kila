



let testAreaLight = function () {
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

  let directionLight: KILA.DirectionLight = new KILA.DirectionLight();
  directionLight.color = new KILA.Color(1, 1, 1);
  directionLight.direction = new KILA.Vector3(0, -1, 0);
  scene.addChild(directionLight);


  let ambientLigt: KILA.AmbientLight = new KILA.AmbientLight();
  ambientLigt.color = new KILA.Color(1, 1, 1);
  ambientLigt.amount = 0.5;
  scene.addChild(ambientLigt);

  directionLight.amount = 0;
  ambientLigt.amount = 0;


  let box: KILA.Mesh = new KILA.Mesh();
  box.name = 'colorBox';
  box.geometry = new KILA.BoxGeometry();
  box.material = new KILA.BasicMaterial();
  box.material.diffuse = new KILA.Color(1, 1, 1);
  box.rotationX = 30;
  box.rotationY = 30;
  box.setScale(10);
  box.onUpdate = function () {
    this.rotationY++;
  }
  scene.addChild(box);
  camera.lookAt(box);


  let plane = new KILA.Mesh();
  plane.geometry = new KILA.PlaneGeometry();
  plane.material = new KILA.BasicMaterial();
  plane.material.diffuse = new KILA.Color(1, 1, 1);
  plane.material.side = KILA.glConstants.FRONT_AND_BACK;
  plane.rotationX = 90;
  plane.setScale(2000, 2000, 1);
  scene.addChild(plane);
  let renderer: KILA.WebGLRenderer = scene.renderer;
 

  let num = 6;
  while (num--)
  {
    let areaLight = new KILA.AreaLight();
    areaLight.color = new KILA.Color(Math.random(), Math.random(), Math.random());
    areaLight.x = 5;
    areaLight.y = 5;
    areaLight.z = 0;
    areaLight.amount = 10;
    areaLight.rotationX = 90;
    areaLight['startAngle'] = num * Math.PI * 2 / 6;
    areaLight.width = 5 + Math.random() * 2;
    areaLight.height = 5;
    areaLight.onUpdate = function () {
      var t = (Date.now() / 2000 + this.startAngle);

      var r = 12.0;

      var lx = r * Math.cos(t);
      var lz = r * Math.sin(t);

      var ly = (5.0 + 5.0 * Math.sin(t * 5)) * 0.5 + this.height * 0.5;

      this.setPosition(lx, ly, lz);
      this.lookAt(box);
    }
    scene.addChild(areaLight);

    var areaLightMesh = new KILA.Mesh();
    areaLightMesh.geometry = new KILA.PlaneGeometry();
    areaLightMesh.material = new KILA.BasicMaterial();

    areaLightMesh.material.diffuse = areaLight.color;
    areaLightMesh.material.lightType = 'NONE';
    areaLightMesh.material.side = KILA.glConstants.FRONT_AND_BACK;

    areaLightMesh.scaleX = areaLight.width;
    areaLightMesh.scaleY = areaLight.height;
    areaLight.addChild(areaLightMesh);
  }


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
  testAreaLight();
}

