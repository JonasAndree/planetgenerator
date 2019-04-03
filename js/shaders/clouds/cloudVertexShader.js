var cloudsVertexShader = " \
	varying vec3 vNormal; \
	varying vec2 texCoord; \
	varying vec3 cameraVector;	\
	varying vec3 vPosition;	\
	\
	void main() { \
		vNormal = normal; \
		texCoord = uv; \
		vec4 vPosition4 = modelMatrix * vec4(position, 1.0); \
		vPosition = vPosition4.xyz; \
		cameraVector = cameraPosition - vPosition; \
		\
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); \
	}";