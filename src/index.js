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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.gl = canvas.getContext("webgl");
        if (!this.gl) {
            document.write("<h1> WebGL is not supported by your system</h1>");
            return;
        }



        this.sampleShader = this.create_shader(
        `
#version 100

attribute vec3 vertex;
attribute vec2 uv_val;

varying vec2 uv_interp;
varying vec3 pos;

uniform mat4 transformation_mat;
uniform mat4 view_mat;

void main()
{
    uv_interp = uv_val;
    pos = vertex;
    gl_Position = view_mat * transformation_mat * vec4(vertex, 1.0);
}
        `, 
        
        `
#version 100
varying highp vec2 uv_interp;
varying highp vec3 pos;

void main()
{
    gl_FragColor = vec4(uv_interp.xy, 0.0, 1.0);
}
        `);
        this.sampleBuffers = this.create_cube_buffer();
        this.test_item = new ComponentType(this.sampleShader, null, this.sampleBuffers);
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
                -0.5, -0.5, 0.5,   1.0, 0.0,
                -0.5, 0.5, 0.5,    1.0, 1.0,
                0.5, 0.5, 0.5,     0.0, 0.0,
                0.5, -0.5, 0.5,    0.0, 1.0
            ],
            [
                0, 1, 2,
                0, 2, 3,
                0, 4, 1,
                4, 1, 5,
                5, 1, 2,
                5, 2, 6,
                4, 5, 6,
                4, 6, 7,
                2, 3, 7,
                2, 7, 6,
                4, 0, 7,
                0, 3, 7
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

    main()
    {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.test_item.render(this.gl, this.camera);
        
        
        
    }
    
}


webgl_instance = new WebGlSrc();
function render_call()
{
    webgl_instance.main();
    window.requestAnimationFrame(render_call);

}





window.onload = render_call;