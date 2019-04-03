/**
 * The Vertex Shader is the programmable Shader stage in the rendering pipeline
 * that handles the processing of individual vertices. Vertex shaders are fed
 * Vertex Attribute data, as specified from a vertex array object by a drawing
 * command. A vertex shader receives a single vertex from the vertex stream and
 * generates a single vertex to the output vertex stream. There must be a 1:1
 * mapping from input vertices to output vertices.
 * 
 * Vertex shaders typically perform transformations to post-projection space,
 * for consumption by the Vertex Post-Processing stage. They can also be used to
 * do per-vertex lighting, or to perform setup work for later shader stages.
 * 
 * Code to be executed by webGL
 */
console.log("Init planet vertex shader.");

var planetVertexShader = "\
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