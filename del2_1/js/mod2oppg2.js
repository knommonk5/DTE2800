let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	attribute vec4 a_PointSize;
	void main() {
	  gl_PointSize = 4.0;
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
    let lines = initLinesBuffers(gl);
    gl.drawArrays(gl.LINES, 0, lines);

    let lineStrip = initLinesStripsBuffers(gl);
    gl.drawArrays(gl.LINE_STRIP, 0, lineStrip);

    let triangleStrip = initTriangleStripsBuffers(gl);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangleStrip);

    let points = initPointsBuffers(gl);
    gl.drawArrays(gl.POINTS, 0, points);
}

function initPointsBuffers(gl) {
    let pointCoords1 = [];

    for(let i = 0; i < 20; i++){
        //Alle koordinat verdiene holder seg i negativ verdi for å skille sektorer
        pointCoords1.push(Math.random()*-1);
    }

    let pointCoords2 = new Float32Array(pointCoords1)

    let points = pointCoords2.length / 2;
    let positionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, pointCoords2, gl.STATIC_DRAW);
    let posAttribL = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return points;
}

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

function initTriangleStripsBuffers(gl){
    let triangleStripCoord = new Float32Array([
        0.1, -0.2,
        0.4, -0.4,
        0.2, -0.7,
        0.8, -0.4,
        0.9, -0.8,

    ]);

    let triangleStrip = triangleStripCoord.length / 2;
    let positionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, triangleStripCoord, gl.STATIC_DRAW);
    let posAttribL = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return triangleStrip;
}