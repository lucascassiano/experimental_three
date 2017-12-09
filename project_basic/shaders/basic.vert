uniform float time;
attribute vec3 endPosition;
varying float posz;

void main() {  // pass the color to the fragment shader
  //gl_PointSize = size;
  vec3 newPos = position;
  //if(newPos.x>=1.0){
    //newPos.z += 2.0*time*sin(newPos.x)*0.05*newPos.y;
    //newPos.x += (time-2.0)*sin(newPos.z)*0.1*newPos.z;
  //} 
  //newPos.z = time; //newPos.y;
  //newPos = endPosition;
  posz = newPos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
  
}