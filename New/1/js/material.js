"use strict";
/**
 * Defines that JavaScript code should be executed in "strict mode".
 * 	With strict mode, you can not, for example, use undeclared variables.
 * 
 * You can read more at:
 * 	http://www.w3schools.com/js/js_strict.asp
 */

window.Game = window.Game || {};
Game.material = Game.material || {};
/**
 * WebGl shaderbased material.
 */
Game.material.shaderMaterial = function(textureMap, bumpMap) {
	/**The Vertex Shader is the programmable Shader stage in the 
	 * rendering pipeline that handles the processing of individual 
	 * vertices. 
	 * Vertex shaders are fed Vertex Attribute data, as specified 
	 * from a vertex array object by a drawing command. 
	 * A vertex shader receives a single vertex from the vertex 
	 * stream and generates a single vertex to the output vertex 
	 * stream. There must be a 1:1 mapping from input vertices to 
	 * output vertices.
	 * 
	 * Vertex shaders typically perform transformations to post-projection space, for consumption by the Vertex Post-Processing stage. 
	 * They can also be used to do per-vertex lighting, or to perform setup work for later shader stages.
	 * 
	 * Code to be executed by webGL
	 */
	var vertexShader = "\
		/* create a shared variable for the VS and FS containing the normal */ \
		varying vec3 vNormal;\
		varying vec3 cameraVector;\
		varying vec3 vPosition;\
		varying vec2 vUv;\
		\
		void main() {\
			/* set the vNormal value with the attribute value passed in by Three.js */ \
			vNormal = normal;\
			vec4 vPosition4 = modelMatrix *\
							  vec4(position, 1.0);\
			vPosition = vPosition4.xyz;\
			cameraVector = cameraPosition - vPosition;\
			vUv = uv;\
			\
			/** \
			 * Multiply each vertex by the \
			 * model-view matrix and the\
			 * projection matrix (both provided\
			 * by Three.js) to get a final\
			 * vertex position\
			 * \
			 * Model-View Matrix and the Projection Matrix.\
			 * they are how the 3D position of the vertex \
			 * is actually projected to the final\
			 * 2D position on the screen.\
			 */\
			gl_Position = projectionMatrix * \
						  modelViewMatrix *	\
						  vec4(position, 1.0);\
		}\
	";
	/**
	 * A Fragment Shader is the Shader stage that will processes a Fragment generated by the Rasterization into a set 
	 * of colors and a single depth value. 
	 * The fragment shader is the OpenGL pipeline stage after a primitive is rasterized. 
	 * For each sample of the pixels covered by a primitive, a "fragment" is generated.
	 */
	var fragmentShader = "\
		uniform vec3 pointLightPosition;\
		uniform sampler2D map;\
		uniform sampler2D normalMap;\
		\
		/* same name and type as vertexShader */ \
		varying vec3 vNormal;\
		varying vec3 vPosition;\
		varying vec3 cameraVector;\
		varying vec2 vUv;\
        \
        mat4 rotationMatrix(vec3 axis, float angle) {\
            axis = normalize(axis);\
            float s = sin(angle);\
            float c = cos(angle);\
            float oc = 1.0 - c;\
            \
            return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\
                        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\
                        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\
                        0.0,                                0.0,                                0.0,                                1.0);\
        }\
        \
        vec3 bumpNormal(sampler2D normalMap, vec2 vUv) {\
            vec3 bumpedNormal = normalize(texture2D(normalMap, vUv).xyz * 2.0 - 1.0);\
            \
            vec3 y_axis = vec3(0,1,0);\
            float rot_angle = acos(dot(bumpedNormal,y_axis));\
            vec3 rot_axis = normalize(cross(bumpedNormal,y_axis));\
            return vec3(rotationMatrix(rot_axis, rot_angle) * vec4(vNormal, 1.0));\
        }\
        \
		void main() {\
			float PI = 3.14159265358979323846264;\
			/* light */ \
			vec3 light = pointLightPosition - vPosition;\
			vec3 ambientLight = vec3(0.6, 0.6, 0.6);\
			vec3 cameraDir = normalize(cameraVector);\
            vec3 newNormal = bumpNormal(normalMap, vUv);\
			\
			/* ensure it's normalized */ \
			light = normalize(light);\
			\
			float lightAngle = max(0.0, dot(newNormal, light));\
			float viewAngle = max(0.0, dot(vNormal, cameraDir));\
			float adjustedLightAngle = min(0.6, lightAngle) / 0.6;\
			float adjustedViewAngle = min(0.65, viewAngle) / 0.65;\
			float invertedViewAngle = pow(acos(viewAngle), 3.0) * 0.4;\
			\
			float dProd = 0.0;\
			dProd += 0.5 * lightAngle;\
			dProd += 0.2 * lightAngle * (invertedViewAngle - 0.1);\
			dProd += invertedViewAngle * 0.5 * (max(-0.35, dot(vNormal, light)) + 0.35);\
			dProd *= 0.7 + pow(invertedViewAngle/(PI/2.0), 2.0);\
			\
			dProd *= 0.8;\
			vec4 atmColor = vec4(0.3, 0.4, dProd+0.5, 0.2);\
			\
			vec4 texelColor = texture2D(map, vUv) * min(asin(lightAngle), 1.0);\
			\
			/* gl_FragColor = texture2D(map, vUv); */\
			gl_FragColor = texelColor + min(atmColor, 0.8);\
		}\
	";
	
	var uniforms = {
		"pointLightPosition": {
			"type": "v3", 
			"value": sunLight.position
		},
		"map": {
			"type": "t", 
			"value": textureMap
		},
		"normalMap": {
			"type": "t", 
			"value": Game.util.heightToNormalMap(bumpMap, 4.0)
		}
	};
	/**
	 * ShaderMaterial
	 * 
	 * Material rendered with custom shaders. A shader is a small program written in GLSL to run on the GPU. 
	 * You may want to use a custom shader if you need to:
	 * 	implement an effect not included with any of the built-in materials
	 * 	combine many objects into a single Geometry or BufferGeometry in order to improve performance
	 * 	There are the following notes to bear in mind when using a ShaderMaterial:
	 * 		A ShaderMaterial will only be rendered properly by WebGLRenderer, 
	 * 		since the GLSL code in the vertexShader and fragmentShader properties must be compiled and run on the GPU using WebGL.
	 * 		As of THREE r72, directly assigning attributes in a ShaderMaterial is no longer supported. 
	 * 		A BufferGeometry instance (instead of a Geometry instance) must be used instead, using BufferAttribute instances to define custom attributes.
	 */
	return new THREE.ShaderMaterial({
		/** .uniforms
		 * 		Object specifying the uniforms to be passed to the shader code; 
		 * 		keys are uniform names, values are definitions of the form
		 */
		uniforms: uniforms,
		/**.vertexShader
		 * 	Vertex shader GLSL code. This is the actual code for the shader.
		 */
		vertexShader: vertexShader,
		/**.fragmentShader
		 * 	Fragment shader GLSL code. This is the actual code for the shader.
		 */
		fragmentShader: fragmentShader,
		transparent: true
	});
}












/**
 * Generated 
 */
Game.material.textureGeneratorMaterial = function(index) {
	var vertexShader = "\
		varying vec2 vUv;\
		\
		void main() {\
			vUv = uv;\
			gl_Position = projectionMatrix*modelViewMatrix*vec4( position, 1.0 );\
		}\
	";
	
	var fragmentShader = "\
		varying vec2 vUv;\n\
		uniform int index;\n\
		\
		int mod(int x, int m) {\n\
			return int(mod(float(x), float(m)));\n\
		}\n\
		\
		float random5(vec3 co) {\n\
			return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,1.23456))) * 43758.5453);\n\
		}\n\
		\
		\
		float random4(float x, float y, float z) {\n\
			return random5(vec3(x, y, z));\n\
		}\n\
		\
		float random4(int x, int y, int z) {\n\
			return random4(float(x), float(y), float(z));\n\
		}\n\
		\
		float interpolation(float a, float b, float x) {\n\
			float ft = x * 3.1415927;\n\
			float f = (1.0 - cos(ft))*0.5;\n\
			return a*(1.0 - f) + b*f;\n\
		}\n\
		\
		float tricosine(vec3 coordFloat) {\n\
			vec3 coord0 = vec3(floor(coordFloat.x), floor(coordFloat.y), floor(coordFloat.z));\n\
			vec3 coord1 = vec3(coord0.x+1.0, coord0.y+1.0, coord0.z+1.0);\n\
			float xd = (coordFloat.x - coord0.x)/max(1.0, (coord1.x-coord0.x));\n\
			float yd = (coordFloat.y - coord0.y)/max(1.0, (coord1.y-coord0.y));\n\
			float zd = (coordFloat.z - coord0.z)/max(1.0, (coord1.z-coord0.z));\n\
			float c00 = interpolation(random4(coord0.x, coord0.y, coord0.z), random4(coord1.x, coord0.y, coord0.z), xd);\n\
			float c10 = interpolation(random4(coord0.x, coord1.y, coord0.z), random4(coord1.x, coord1.y, coord0.z), xd);\n\
			float c01 = interpolation(random4(coord0.x, coord0.y, coord1.z), random4(coord1.x, coord0.y, coord1.z), xd);\n\
			float c11 = interpolation(random4(coord0.x, coord1.y, coord1.z), random4(coord1.x, coord1.y, coord1.z), xd);\n\
			float c0 = interpolation(c00, c10, yd);\n\
			float c1 = interpolation(c01, c11, yd);\n\
			float c = interpolation(c0, c1, zd);\n\
			\
			return c;\n\
		}\n\
		\
		float nearestNeighbour(vec3 coordFloat) {\n\
			return random4(int(floor(coordFloat.x)), int(floor(coordFloat.y)), int(floor(coordFloat.z)));\n\
		}\n\
		\
		float helper(float x, float y, float z, float resolution) {\n\
			x = (x + 1.0)/2.0*resolution;\n\
			y = (y + 1.0)/2.0*resolution;\n\
			z = (z + 1.0)/2.0*resolution;\n\
			\n\
			vec3 coordFloat = vec3(x, y, z);\n\
			float interpolated = tricosine(coordFloat);\n\
			return interpolated*2.0 - 1.0;\n\
		}\n\
		\
		vec3 scalarField(float x, float y, float z) {\n\
			float resolution1 = 4.0;\n\
			float resolution2 = 16.0;\n\
			float resolution3 = 32.0;\n\
			float resolution4 = 64.0;\n\
			float resolution5 = 128.0;\n\
			float resolutionMax = 256.0;\n\
			\n\
			vec3 coordFloat = vec3(0.0, 0.0, 0.0);\n\
			\n\
			float level1 = helper(x, y, z, resolution1);\n\
			float level2 = helper(x, y, z, resolution2);\n\
			float level3 = helper(x, y, z, resolution3);\n\
			float level4 = helper(x, y, z, resolution4);\n\
			float level5 = helper(x, y, z, resolution5);\n\
			float levelMax = helper(x, y, z, resolutionMax);\n\
			\n\
			float c = 0.5;\n\
			c *= 1.0 + level1*0.8;\n\
			c *= 1.0 + level2*0.4;\n\
			c *= 1.0 + level3*0.2;\n\
			c *= 1.0 + level4*0.1;\n\
			c *= 1.0 + level5*0.05;\n\
			c *= 1.0 + levelMax*(0.025);\n\
			\n\
			if (c < 0.5) c *= 0.9;\n\
			\n\
			c = clamp(c, 0.0, 1.0);\n\
			\n\
			return vec3(c, c, c);\n\
		}\n\
		\
		vec3 getSphericalCoord(int index, float x, float y, float width) {\n\
			width /= 2.0;\n\
			x -= width;\n\
			y -= width;\n\
			vec3 coord = vec3(0.0, 0.0, 0.0);\n\
			\
			if (index == 0) {coord.x=width; 	coord.y=-y; 	coord.z=-x;}\n\
			else if (index == 1) {coord.x=-width;coord.y=-y;	coord.z=x;}\n\
			else if (index == 2) {coord.x=x;	coord.y=width;	coord.z=y;}\n\
			else if (index == 3) {coord.x=x; 	coord.y=-width; coord.z=-y;}\n\
			else if (index == 4) {coord.x=x; 	coord.y=-y; 	coord.z=width;}\n\
			else if (index == 5) {coord.x=-x; 	coord.y=-y; 	coord.z=-width;}\n\
			\
			return normalize(coord);\n\
		}\
		\
		void main() {\n\
			float x = vUv.x;\n\
			float y = 1.0 - vUv.y;\n\
			vec3 sphericalCoord = getSphericalCoord(index, x*1024.0, y*1024.0, 1024.0);\n\
			\
			vec3 color = scalarField(sphericalCoord.x, sphericalCoord.y, sphericalCoord.z);\n\
			\
			gl_FragColor = vec4(color.x, color.y+0.2, color.z, 1.0);\n\
		}\
	";
	
	var uniforms = {
		index: {type: "i", value: index}
	};
	
	return new THREE.ShaderMaterial({
		uniforms: 		uniforms,
		vertexShader: 	vertexShader,
		fragmentShader: fragmentShader,
		transparent: 	true,
		depthWrite: 	false
	});
}