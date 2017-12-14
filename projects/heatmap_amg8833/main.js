// the setup routine runs once when you press reset:

var sphere;
var t = 0;
var uniforms = {
  time: { value: 1.0 },
  vertex_color: 1.0
};

var attributes = {
  size: { type: "f", value: [] },
  endPosition: { type: "v3", value: [] }
};

var plane;

Setup = function(scene, camera, renderer) {
  var vert = shaders.vertex.basic;
  var frag = shaders.fragment.basic;

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: vert,
    fragmentShader: frag,
    wireframe: false,
    transparent: true,
    castShadows: true,
    vertexColors: true
  });

  var geometry = new THREE.PlaneBufferGeometry(10, 10, 7, 7);
  var total = geometry.attributes.position.count;
  //geometry.attributes.position.array[2] = 1;
  //geometry.attributes.position.needsUpdate = true;
  console.log("models",models.obj.sensor_amg8833);
  models.obj.sensor_amg8833.scale.x = 0.5;
  models.obj.sensor_amg8833.scale.y = 0.5;
  models.obj.sensor_amg8833.scale.z = 0.5;

  console.log(total);
  plane = new THREE.Mesh(geometry, material);
  plane.position.y = 5;
  plane.rotation.x = -Math.PI * 0.5;
  scene.add(plane);
  console.log(plane);
};

Update = function(scene, camera, renderer) {
  //t = serial.data[0];
  //t+= 0.1; //console.log(serial.temp);  
  //console.log(_this.serial.data[0]);
  
  //t = _this.serial.data[0];
  var total = plane.geometry.attributes.position.array.length;
  var k = 0;
  if(_this.serial)
  for (var i = 2; i <=total; i += 3) {
    if (k <= _this.serial.data.length)
     plane.geometry.attributes.position.array[i] = _this.serial.data[k]-20;
    k++;
  }

  plane.geometry.attributes.position.needsUpdate = true;

  //console.log(_this.serial);
  //t=_this.serial.data[0];

  uniforms.time.value = 5 * Math.sin(t);
};
