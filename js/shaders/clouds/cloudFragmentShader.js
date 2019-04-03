var cloudsFragmentShader = " \
	uniform float time; \
	uniform vec3 pointLightPosition; \
	uniform sampler2D texture1; \
	uniform sampler2D texture2; \
	uniform float randRedColor;\
	uniform float randGreenColor;\
	uniform float randBlueColor;\
	\
	varying vec2 texCoord; \
	varying vec3 vNormal; \
	varying vec3 cameraVector; \
	varying vec3 vPosition;	\
	\
	void main( void ) { \
		vec4 noise = texture2D( texture1, texCoord ); \
		\
		vec2 T1 = texCoord + vec2( 1.5, -1.5 ) * time * 0.01; \
		vec2 T2 = texCoord + vec2( -0.5, 2.0 ) * time * 0.01; \
		\
		T1.x -= noise.r * 2.0; \
		T1.y += noise.g * 10.0; \
		T2.x += noise.g * 0.2; \
		T2.y += noise.b * 0.2; \
		\
		float p = texture2D( texture1, T1 * 2.0 ).a + 0.25; \
		\
		vec4 color = texture2D( texture2, T2 ); \
		vec4 newCloudColor = color * 2.5 * ( vec4( p, p, p, p ) ) + ( color * color ); \
		\
		\
		vec3 light = pointLightPosition - vPosition; \
		light = normalize(light); \
		float lightAngle = max(0.0, dot(vec3(10,1,1), light)); \
		\
		vec3 cameraDir = normalize(cameraVector); \
		float viewAngle = max(0.0, dot(vNormal, cameraDir)); \
		\
		\
		\
		\
		gl_FragColor = newCloudColor*\
				vec4(randRedColor, randGreenColor, randBlueColor, 0.2) * \
						min(asin(lightAngle), 1.0); \
	}";