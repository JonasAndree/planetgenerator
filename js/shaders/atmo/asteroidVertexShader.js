console.log("Init asteroid vertex shader.");

var asteroidAtmoVertexShader = "\
	varying vec3 vNormal; \
	varying vec3 cameraVector;	\
	varying vec3 vPosition;	\
	varying vec2 vUv; \
	\
	void main() { \
		vNormal = normal; \
		vec4 vPosition4 = modelMatrix * vec4(position, 1.0); \
		vPosition = vPosition4.xyz; \
		cameraVector = cameraPosition - vPosition; \
		vUv = uv; \
		\
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); \
	}";