var textureGeneratorFragmentShader = "\
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
			gl_FragColor = vec4(color.x, color.y+0.4, color.z, 0.8);\n\
		}\
	";