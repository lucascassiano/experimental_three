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

  var geometry = new THREE.PlaneGeometry(10, 10, 50, 50);

  var vert = shaders.vertex.basic;
  var frag = shaders.fragment.basic;

  console.log(geometry.vertices[0]);

  var numVertices = geometry.vertices.length;

  console.log(numVertices);

  for (var i = 0; i < numVertices; i++) {
    var pos = geometry.vertices[i];

    attributes.endPosition.value[i] = new THREE.Vector3(
      pos.x,
      pos.y,
      5 + Math.random() * 10
    );

  }

  var material = new THREE.ShaderMaterial({
    
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: vert,
    fragmentShader: frag,
    wireframe: true,
    transparent:true

  });

  plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = 2;
  //var plane2 = new THREE.Mesh(plane);
  scene.add(plane);
  //plane2.position.y = -2;
  //scene.add(plane2);
 
};

Update = function(scene, camera, renderer) {
  //sphere.position.y = 2*Math.sin(t);
  //sphere.rotation.y = t;
  t += 0.1;
  plane.rotation.z = t/20;
  uniforms.time.value = 5*Math.sin(t);
};
