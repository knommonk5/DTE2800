let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	attribute vec4 a_PointSize;
	void main() {
	  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
	  gl_Position = a_Position;
	}`;

let FSHADER_SOURCE = ` 
   precision mediump float;
   uniform vec4 u_FragColor;     
   void main() {
     gl_FragColor = u_FragColor;
   }`;

function main(){
    let canvas = document.getElementById('webgl');
    let gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Fikk ikke tak i rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Feil ved initialisering av shaderkoden.');
        return;
    }

    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (u_FragColor < 0) {
        console.log('Fant ikke uniform-parametret u_FragColor i shaderen!?');
        return;
    }
    let rgba = [0.0, 1.0, 1.0, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.clearColor(0.3, 0.0, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //På tide å tegne:
    /*TODO*/
    //let points = initPointsBuffers(gl);
    //gl.drawArrays(gl.POINTS, 0, points);

    let lines = initLinesBuffers(gl);
    gl.drawArrays(gl.LINES, 0, lines);

    let lineStrip = initLinesStripsBuffers(gl);
    gl.drawArrays(gl.LINE_STRIP, 0, lineStrip);

    //let triangleStrip = initTriangleStripsBuffers(gl);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangleStrips);
}

/*TODO*//*
function initPointsBuffers(gl){
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttrib4f(a_Position, -1, 0, 0.0, 1.0);
    gl.vertexAttrib1f(a_PointSize, 4);

return points;
}*/

/*TODO*/
function initLinesBuffers(gl){
    //Gjenbruk av linjer fra opgpave oppg2b
    let lineCoord = new Float32Array([
        0, 1, //Vertikal linje
        0, -1,
        1, 0, //Horisontal linje
        -1, 0
    ]);

    let lines = lineCoord.length / 2;
    let positionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, lineCoord, gl.STATIC_DRAW);
    let posAttribL = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return lines;
}

/*TODO*/
function initLinesStripsBuffers(gl){
    let stripCoord = new Float32Array([
        0.1, 0.1,
        0.4, 0.2,
        0.2, 0.6,
        0.4, 0.6
    ]);

    let lineStrip = stripCoord.length / 2;
    let positionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, stripCoord, gl.STATIC_DRAW);
    let posAttribL = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return lineStrip;
}

/*TODO*/
function initTriangleStripsBuffers(gl){

}