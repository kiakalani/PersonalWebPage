let webgl_instance;

function key_pressed(event)
{
    webgl_instance.camera.key_pressed(event);
}


function key_released(event)
{
    webgl_instance.camera.key_released(event);
}

document.addEventListener('keyup', key_released, false);
document.addEventListener('keydown', key_released, false);
class WebGlSrc
{
    constructor()
    {
        let canvas = document.querySelector("#gl_Canvas");
        canvas.width = window.innerWidth - 15.0;
        canvas.height = window.innerHeight - 15.0;
        this.gl = canvas.getContext("webgl");
        if (!this.gl) {
            document.write("<h1> WebGL is not supported by your system</h1>");
            return;
        }

        this.prev_refresh = new Date().getUTCMilliseconds();
        this.delta_time = 0.0;


        this.sampleShader = this.create_shader(
        `
#version 100

attribute vec3 vertex;
attribute vec2 uv_val;

varying vec2 uv_interp;
varying vec3 pos;

uniform mat4 transformation_mat;
uniform mat4 view_mat;
uniform mat4 projection_mat;

void main()
{
    uv_interp = uv_val;
    pos = vertex;
    gl_Position = view_mat * projection_mat * transformation_mat * vec4(vertex, 1.0);
}
        `, 
        
        `
#version 100
varying highp vec2 uv_interp;
varying highp vec3 pos;
uniform sampler2D texture_add;
void main()
{
    gl_FragColor = texture2D(texture_add, uv_interp);//vec4(0.0, uv_interp.xy, 1.0);
}
        `);
        this.sampleBuffers = this.create_cube_buffer();

        this.sampleTexture = this.create_texture("src/index.jpg");
        this.test_item = new ComponentType(this.sampleShader, this.sampleTexture, this.sampleBuffers);
        this.camera = new Camera();
        


    }


    


    create_cube_buffer()
    {
        return this.create_buffer(
            [
                -0.5, -0.5, -0.5,  0.0, 0.0,
                -0.5, 0.5, -0.5,   0.0, 1.0,
                0.5, 0.5, -0.5,    1.0, 1.0,
                0.5, -0.5, -0.5,   1.0, 0.0,

                -0.5, -0.5, 0.5,   0.0, 0.0,
                -0.5, 0.5, 0.5,    0.0, 1.0,
                0.5, 0.5, 0.5,     1.0, 1.0,
                0.5, -0.5, 0.5,    1.0, 0.0,

                -0.5, -0.5, -0.5,  1.0, 0.0,
                -0.5, -0.5, 0.5,   0.0, 0.0,
                -0.5, 0.5, -0.5,   1.0, 1.0,
                -0.5, 0.5, 0.5,    0.0, 1.0,

                -0.5, 0.5, -0.5,   0.0, 0.0,
                0.5, 0.5, -0.5,    1.0, 0.0,
                -0.5, 0.5, 0.5,    0.0, 1.0,
                0.5, 0.5, 0.5,     1.0, 1.0,

                0.5, 0.5, -0.5,    0.0, 1.0,
                0.5, -0.5, -0.5,   0.0, 0.0,
                0.5, 0.5, 0.5,     1.0, 1.0,
                0.5, -0.5, 0.5,    1.0, 0.0,

                -0.5, -0.5, -0.5,  0.0, 1.0,
                0.5, -0.5, -0.5,   1.0, 1.0,
                -0.5, -0.5, 0.5,   0.0, 0.0,
                0.5, -0.5, 0.5,    1.0, 0.0

            ],
            [
                0, 1, 2,
                0, 2, 3,

                4, 5, 6,
                4, 6, 7,

                8, 9, 10,
                9, 10, 11,

                12, 13, 14,
                13, 14, 15,

                16, 17, 18,
                17, 18, 19,

                20, 21, 22,
                21, 22, 23
            ]
        )
    }

    star_buffer()
    {
        return this.create_buffer(
            [
                0.0, 0.5, 0.0,          0.5, 1.0,
                -0.20, 0.20, 0.0,       0.20, 0.70,
                0.20, 0.20, 0.0,        0.70, 0.70,
                -0.5, 0.0, 0.0,         0.0, 0.5,
                0.0, 0.0, 0.2,          0.5, 0.5,
                0.5, 0.0, 0.0,          1.0, 0.5,
                -0.20, -0.20, 0.0,      0.20, 0.20,
                0.20, -0.20, 0.0,       0.70, 0.20,
                0.0, -0.5, 0.0,         0.5, 0.0,
                0.0, 0.0, -0.2,         0.5, 0.5
            ],
            [
               0, 1, 4,
               0, 1, 9,
               0, 2, 4,
               0, 2, 9,
               3, 1, 4,
               3, 1, 9,
               3, 6, 4,
               3, 6, 9,
               2, 4, 5,
               2, 9, 5,
               5, 4, 7,
               5, 9, 7,
               6, 4, 8,
               6, 9, 8,
               8, 7, 4,
               8, 7, 9

            ]
        )
    }

    create_shader(vert, frag)
    {
        let vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        //console.log(this.gl.GL_VERTEX_SHADER, this.gl.createShader);
        this.gl.shaderSource(vs, vert);
        this.gl.compileShader(vs);
        if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS))
        {
            console.log("Vertex shader error\n",this.gl.getShaderInfoLog(vs));
            this.gl.deleteShader(vs);
            return;
        }

        let fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fs, frag);
        this.gl.compileShader(fs);
        if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS))
        {
            console.log("fragment shader error\n", this.gl.getShaderInfoLog(fs));
            this.gl.deleteShader(vs);
            this.gl.deleteShader(fs);
            return;
        }


        let program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        console.log(this.gl.getProgramParameter(program, this.gl.LINK_STATUS));

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
        {
            console.log("LINKING ERROR", this.gl.getProgramInfoLog(program));
            return;
        }
        return program;
    }

    create_buffer(vertices, indices)
    {
        let vbo = this.gl.createBuffer();
        let ebo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        
        return {vbo:vbo, ebo:ebo, size: indices.length};
    }

    _load_texture(texture, gl, img)
    {

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.generateMipmap(gl.TEXTURE_2D);
        //texture.__image = undefined;
            
    }

    create_texture(path)
    {
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
            
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        tex.__image = new Image();
        let ltex = this._load_texture;
        let gl = this.gl;


        tex.__image.onload = function()
        {

            ltex(tex, gl, tex.__image);
        }
        tex.__image.src = path;

        
        return tex;
    }

    main()
    {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.test_item.render(this.gl, this.camera);

        let c_time = new Date().getUTCMilliseconds();

        this.delta_time = c_time - this.prev_refresh;

        this.delta_time *= 0.001;

        if (this.delta_time < 0.0) this.delta_time = 0.001;

        this.prev_refresh = c_time;

        
        
        
    }
    
}


webgl_instance = new WebGlSrc();
function render_call()
{
    webgl_instance.main();
    window.requestAnimationFrame(render_call);

}





window.onload = render_call;


window.onresize = function()
{
    let canvas = document.querySelector("#gl_Canvas");
    canvas.width = window.innerWidth - 15.0;
    canvas.height = window.innerHeight - 15.0;
    webgl_instance.gl.viewport(0.0, 0.0, canvas.width, canvas.height);
}