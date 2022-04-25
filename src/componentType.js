
class Matrix4
{

    constructor()
    {
        this.mat = [];
        for (let i = 0; i < 16; ++i)
        {
            if (i % 5 == 0)
            this.mat.push(1.0);
            else this.mat.push(0.0);
        }
    }


    copy()
    {
        let m = new Matrix4();
        for (let i = 0; i < 16; ++i) m.mat[i] = this.mat[i];
        return m;
    }


    multiply(aMat)
    {
        
        
        let mult_mat = Vector.vec3_zero().as_scale_matrix();
        for (let r = 0; r < 4; ++r)
        {
            for (let c = 0; c < 4; ++c)
            {
                for (let i = 0; i < 4; ++i)
                {
                    mult_mat.mat[r * 4 + c] += this.mat[i * 4 + c] * aMat.mat[r * 4 + i];
                }
            }
        }
        return mult_mat;
    }


    set(r, c, val)
    {
        this.mat[r * 4 + c] = val;
    }


}
class Vector
{
    constructor(size)
    {
        this.vecs = [];
        for (let i = 0; i < size; i++)
        {
            this.vecs.push(0);
        }
    }
    static vec3_zero()
    {
        return new Vector(3);
    }

    static vec3_one()
    {
        let v = new Vector(3);
        for (let i = 0; i < 3; ++i) v.vecs[i] = 1.0;
        return v;
    }

    dot(another)
    {
        let sum = 0.0;
        for (let i = 0; i < this.vecs.length; ++i)
        {
            sum += another.vecs[i] * this.vecs[i];
        }
        return sum;
    }


    

    plus(another)
    {
        let vec = new Vector(this.vecs.length);
        for (let i = 0; i < vec.vecs.length; i++)
            vec.vecs[i] = this.vecs[i] + another.vecs[i];
        return vec;
    }

    minus(another)
    {
        let vec = new Vector(this.vecs.length);
        for (let i = 0; i < vec.vecs.length; i++)
            vec.vecs[i] = this.vecs[i] - another.vecs[i];
        return vec;
    }

    multiply(another)
    {
        let vec = new Vector(this.vecs.length);

        if (typeof another == Vector)
        {
            for (let i = 0; i < vec.vecs.length; ++i) vec.vecs[i] = this.vecs[i] * another.vecs[i];
            return vec;
        }
        for (let i = 0; i < this.vecs.length; ++i)
            vec[i] = this.vecs[i] * another;
        return vec;
    }

    last_n(n)
    {
        let a = [];
        for (let i = this.vecs.length - n; i < this.vecs.length; ++i) a.push(this.vecs[i]);
        let v = new Vector(a.length);
        v.vecs = a;
        return v;
    }

    divide(another)
    {
        let vec = new Vector(this.vecs.length);

        if (typeof another == Vector)
        {
            for (let i = 0; i < vec.vecs.length; ++i) vec.vecs[i] = this.vecs[i] / another.vecs[i];
            return vec;
        }
        for (let i = 0; i < this.vecs.length; ++i)
        {
            vec[i] = this.vecs[i] / another;
        }
            
        return vec;
    }

    length_pow2()
    {
        let sum = 0.0;
        for (let i = 0; i < this.vecs.length; ++i)
        
        {
            
            sum += this.vecs[i] * this.vecs[i];

        }
        return sum;
    }

    length()
    {
        
        return Math.sqrt(this.length_pow2());
    }

    copy()
    {
        let vec = new Vector(this.vecs.length);
        for (let i = 0; i < this.vecs.length; ++i)
            vec.vecs[i] = this.vecs[i];
        return vec;
    }

    normalize()
    {
        let len = this.length();
        if (len <= 0.0) return Vector.vec3_zero();
        let cp = this.copy();
        for (let i = 0; i < cp.length; ++i) cp.vecs[i] /= len;
        return cp;
    }

    set_pos(i, x)
    {
        this.vecs[i] = x;
    }

    get_pos(i)
    {
        return this.vecs[i];
    }

    cross(another)
    {
        if (this.vecs.length != 3) return this.copy();

        let v = new Vector(3);
        v.vecs[0] = this.vecs[1] * another.vecs[2] - this.vecs[2] * another.vecs[1];
        v.vecs[1] = this.vecs[2] * another.vecs[0] - this.vecs[0] * another.vecs[2];
        v.vecs[2] = this.vecs[0] * another.vecs[1] - this.vecs[1] * another.vecs[0];
        return v;
    }


    as_transform_matrix()
    {
        let mat = new Matrix4();
        mat.mat[12] = this.vecs[0];
        mat.mat[13] = this.vecs[1];
        if (this.vecs.length > 2)
        {
            mat.mat[14] = this.vecs[2];
        }
        return mat;
    }

    as_scale_matrix()
    {
        let mat = new Matrix4();
        mat.mat[0] = this.vecs[0];
        mat.mat[5] = this.vecs[1];
        if (this.vecs.length > 2)
        {
            mat.mat[10] = this.vecs[2];
        }
        return mat;
    }

    
}



class Quaternion
{
    constructor()
    {
        this.rotation = new Vector(4);
        this.rotation.vecs[0] = 1.0;
    }


    static angleAxis(a, x, y, z)
    {
        let q = new Quaternion();
        q.rotation.vecs[0] = Math.cos(a * 0.5);
        let s = Math.sin(a * 0.5);
        q.rotation.vecs[1] = x * s;
        q.rotation.vecs[2] = y * s;
        q.rotation.vecs[3] = z * s;

        return q;

    }


    copy()
    {
        let q = new Quaternion();
        q.rotation.vecs[0] = this.rotation.vecs[0];
        q.rotation.vecs[1] = this.rotation.vecs[1];
        q.rotation.vecs[2] = this.rotation.vecs[2];
        q.rotation.vecs[3] = this.rotation.vecs[3];

        return q;
    }


    normalize()
    {
        if (this.rotation.length() <= 0.0)
        {
            return new Quaternion();
        }
        let q = this.copy();

        let len = q.rotation.length();
        for (let i = 0; i < 4; ++i) q.rotation[i] /= len;
        return q;
    }

    multiply(aQuat)
    {
        let q = new Quaternion();
        
        q.rotation.vecs[0] = this.rotation.vecs[0] * aQuat.rotation.vecs[0] - this.rotation.vecs[1] * aQuat.rotation.vecs[1] - this.rotation.vecs[2] * aQuat.rotation.vecs[2] - this.rotation.vecs[3] * aQuat.rotation.vecs[3];
        q.rotation.vecs[1] = this.rotation.vecs[0] * aQuat.rotation.vecs[1] + this.rotation.vecs[1] * aQuat.rotation.vecs[0] + this.rotation.vecs[2] * aQuat.rotation.vecs[3] - this.rotation.vecs[3] * aQuat.rotation.vecs[2];
        q.rotation.vecs[2] = this.rotation.vecs[0] * aQuat.rotation.vecs[2] + this.rotation.vecs[2] * aQuat.rotation.vecs[0] + this.rotation.vecs[3] * aQuat.rotation.vecs[1] - this.rotation.vecs[1] * aQuat.rotation.vecs[3];
        q.rotation.vecs[3] = this.rotation.vecs[0] * aQuat.rotation.vecs[3] + this.rotation.vecs[3] * aQuat.rotation.vecs[0] + this.rotation.vecs[1] * aQuat.rotation.vecs[2] - this.rotation.vecs[2] * aQuat.rotation.vecs[1];
        return q;
    }


    get_mat4()
    {
        // Result[0][0] = T(1) - T(2) * (qyy +  qzz);
		// Result[0][1] = T(2) * (qxy + qwz);
		// Result[0][2] = T(2) * (qxz - qwy);

		// Result[1][0] = T(2) * (qxy - qwz);
		// Result[1][1] = T(1) - T(2) * (qxx +  qzz);
		// Result[1][2] = T(2) * (qyz + qwx);

		// Result[2][0] = T(2) * (qxz + qwy);
		// Result[2][1] = T(2) * (qyz - qwx);
		// Result[2][2] = T(1) - T(2) * (qxx +  qyy);
        let mat = new Matrix4();
        mat.mat[0] = 1.0 - 2.0 * (this.rotation.vecs[2] * this.rotation.vecs[2] + this.rotation.vecs[3] * this.rotation.vecs[3]);
        mat.mat[1] = 2.0 * (this.rotation.vecs[1] * this.rotation.vecs[2] + this.rotation.vecs[0] * this.rotation.vecs[3]);
        mat.mat[2] = 2.0 * (this.rotation.vecs[1] * this.rotation.vecs[3] - this.rotation.vecs[2] * this.rotation.vecs[0]);

        mat.mat[4] = 2.0 * this.rotation.vecs[1] * this.rotation.vecs[2] - 2.0 * this.rotation.vecs[3] * this.rotation.vecs[0];
        mat.mat[5] = 1.0 - 2.0 * (this.rotation.vecs[1] * this.rotation.vecs[1] + this.rotation.vecs[3] * this.rotation.vecs[3]);
        mat.mat[6] = 2.0 * this.rotation.vecs[2] * this.rotation.vecs[3] + 2.0 * this.rotation.vecs[1] * this.rotation.vecs[0];


        mat.mat[8] = 2.0 * (this.rotation.vecs[1] * this.rotation.vecs[3] + this.rotation.vecs[2] * this.rotation.vecs[0]);
        mat.mat[9] = 2.0 * (this.rotation.vecs[2] * this.rotation.vecs[3] - this.rotation.vecs[1] * this.rotation.vecs[0]);
        mat.mat[10] = 1.0 - 2.0 * (this.rotation.vecs[1] * this.rotation.vecs[1] + this.rotation.vecs[2] * this.rotation.vecs[2]);
        return mat;
    }


}

class ComponentType
{
    constructor(shader, texture, shape)
    {
        this.shader = shader;
        this.texture = texture;
        this.shape = shape;
        this.position = Vector.vec3_zero();
        this.rotation = new Quaternion();
        this.scale = Vector.vec3_one();
        this.scale.vecs[0] = 0.5;
    }


    render(gl, camera)
    {

        gl.useProgram(this.shader);
        let vpos = gl.getAttribLocation(this.shader, "vertex");
        gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 20, 0);
        let upos = gl.getAttribLocation(this.shader, "uv_val");
        gl.vertexAttribPointer(upos, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.useProgram(this.shader);

        camera.render(gl, this.shader);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "transformation_mat"), false,
         new Float32Array(this.position.as_transform_matrix().multiply(this.rotation.get_mat4()).multiply(this.scale.as_scale_matrix()).mat));
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shape.ebo);
        

        gl.drawElements(gl.TRIANGLES, this.shape.size, gl.UNSIGNED_SHORT, 0);



        (this.rotation.multiply(Quaternion.angleAxis(0.1, 0.0, 0.0, 1.0)).normalize());
        this.rotation = this.rotation.multiply(Quaternion.angleAxis(0.01, 0.0, 1.0, 0.0));



        

    }
}



class Camera
{
    constructor()
    {
        this.position = new Vector(3);
        this.forward = new Vector(3);
        this.forward.vecs[2] = 1.0;
        this.up = new Vector(3);
        this.up.vecs[1] = 1.0;
        this.right = this.up.cross(this.forward);
        this.c_up = this.forward.cross(this.right).normalize();
        console.log(this.get_view_mat());
        this.position.vecs[2] = 0.3;
    }



    


    render(gl, shader)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view_mat"), false,
         new Float32Array(this.get_view_mat().mat));
        
        


    }

    get_view_mat()
    {

        let fwd = this.forward.minus(this.position).normalize();
        let rgt = this.up.cross(fwd);
        let up = fwd.cross(rgt);

        let fmat = new Matrix4();
        fmat.mat[0] = rgt.vecs[0];
        fmat.mat[4] = rgt.vecs[1];
        fmat.mat[8] = rgt.vecs[2];

        fmat.mat[1] = up.vecs[0];
        fmat.mat[5] = up.vecs[1];
        fmat.mat[9] = up.vecs[2];

        fmat.mat[2] = fwd.vecs[0];
        fmat.mat[6] = fwd.vecs[1];
        fmat.mat[10] = fwd.vecs[2];

        fmat.mat[12] = rgt.dot(this.position) * -1.0;
        fmat.mat[13] = up.dot(this.position) * -1.0;
        fmat.mat[14] = fwd.dot(this.position) * -1.0;
        return fmat;
    }


    key_pressed(event)
    {
        if (event.key == 'w')
        {
            this.position.vecs[2] += 0.01;
        }

        if (event.key == 's')
        {
            this.position.vecs[2] -= 0.01;
        }
    }


    key_released(event)
    {

    }
}