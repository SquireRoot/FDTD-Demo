/*--- Pass Through Vertex Shader ---*/
var passThroughVS = `#version 300 es
precision highp float;
precision highp int ;

in vec4 position;

out vec2 pixPos;

void main() {
    pixPos = position.xy ;
    gl_Position = vec4(position.x*2.-1., position.y*2.-1.,0.,1.0);
}
`;

var HUpdaterFS = `#version 300 es
precision highp float;
precision highp int;

in vec2 pixPos;

uniform sampler2D E_x_y_z;
uniform sampler2D in_H_x_y_z;

uniform float mu;
uniform float sigmaM;

uniform float dt;
uniform float dx;

layout(location = 0) out vec4 out_H_x_y_z;

void main() {
	ivec2 size = textureSize(E_x_y_z, 0);
	vec2 i = vec2(1.0, 0.0)/float(size.x);
	vec2 j = vec2(0.0, 1.0)/float(size.y);

	float coef1 = (mu - 0.5*dt*sigmaM)/(mu + 0.5*dt*sigmaM);
	float coef2 = (dt)/(mu + 0.5*dt*sigmaM);

	vec3 in_H_field = texture(in_H_x_y_z, pixPos).xyz;
	vec3 out_H_field = vec3(0.0, 0.0, 0.0);

	vec3 E_field = texture(E_x_y_z, pixPos).xyz;


	// out_H_field.x = coef1*in_H_field.x 
	// 			    + coef2*();

	out_H_x_y_z.xyz = in_H_field;
}
`;

var EUpdaterFS = `#version 300 es
precision highp float;
precision highp int;

in vec2 pixPos;

uniform sampler2D in_E_x_y_z;
uniform sampler2D H_x_y_z;

uniform float epsilon;
uniform float sigma;

uniform float dt;
uniform float dx;

layout(location = 0) out vec4 out_E_x_y_z;

void main() {
	vec3 in_E_field = texture(in_E_x_y_z, pixPos).xyz;
	vec3 H_field = texture(H_x_y_z, pixPos).xyz;

	vec3 out_E_field = vec3(0.0, 0.0, 0.0);

	ivec2 size = textureSize(in_E_x_y_z, 0);

	vec2 i = vec2(1.0, 0.0)/float(size.x);
	vec2 j = vec2(0.0, 1.0)/float(size.y);

	out_E_x_y_z.xyz = in_E_field;
}
`;