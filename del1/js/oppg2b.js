// Vertex shader program.
// Her er point-size fjernet, kun aktuell n�r man tegner punkter.

// NB! Legg merke til bruk av spesialenkeltapostrof (alt+�)
let VSHADER_SOURCE = `
	attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;    // Setter posisjon.
        v_Color = a_Color;              // Videresender fargen
	}`;

// Fragment shader program
// Bruker prefiks u_ for � indikere uniform
let FSHADER_SOURCE = ` 
   precision mediump float;
   varying vec4 v_Color;        // Mottas via vaying-parametret i verteksshaderen. Interpolert verdi.
   void main() {
    gl_FragColor = v_Color;  // Setter fargeverdi.
   }`;

function main() {
    // Hent <canvas> elementet
    let canvas = document.getElementById('webgl');
    // Rendering context for WebGL, brukes til � kj�re/referere OpenGL-funksjoner/metoder og attributter:
    let gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Fikk ikke tak i rendering context for WebGL');
        return;
    }
    // Initialiser shadere:
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Feil ved initialisering av shaderkoden.');
        return;
    }
    let colors = new Float32Array([
        //Horisontal linje
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Vertikal linje
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        //Pil høyre
        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,
        //Pil venstre
        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,
        //pil opp
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        //pil ned
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        //Stor pil blå
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1
    ])

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    let colorAttrib = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(colorAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //Rensker skjermen:
    gl.clearColor(0.0, 1.0, 0.4, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /* Tegner */
    let arrows = addArrowToLine(gl);
    gl.drawArrays(gl.TRIANGLES, 4, arrows);

    let vectors = initLineBuffers(gl);
    gl.drawArrays(gl.LINES, 0, vectors);
}

function initLineBuffers(gl) {
    /* Linjer */
    let vertices = new Float32Array([
        0, 1, //Vertikal linje
        0, -1,
        1, 0, //Horisontal linje
        -1, 0
    ]);

    let vectors = vertices.length / 2;
    let positionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let posAttribL = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vectors;
}

function addArrowToLine(gl) {
    let verticesT = new Float32Array([
        //4 punkt for å la gl.LINES få korrekte farger
        //Vil gjerne ha tilbakemedling på bedre løsning enn dette
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0.98, 0.02, 0, //Pil høyre
        0.98, -0.02, 0,
        1, 0, 0,
        -0.98, 0.02, 0, //Pil venstre
        -0.98, -0.02, 0,
        -1, 0, 0,
        0.02, 0.98, 0, //Pil opp
        -0.02, 0.98, 0,
        0, 1, 0,
        0.02, -0.98, 0, //Pil ned
        -0.02, -0.98, 0,
        0, -1, 0,
        /*Stor Pil Start*/
        0.8, 0, 0, //Hode
        0.3, 0.6, 0,
        0.3, -0.6, 0,
        0.3, 0.25, 0, //Kropp Topp
        0.3, -0.25, 0,
        -0.6, 0.25, 0,
        0.3, -0.25, 0, //Kropp Bunn
        -0.6, -0.25, 0,
        -0.6, 0.25, 0,
        -0.6, 0.25, 0, //Hale Topp
        -0.8, 0.25, 0,
        -0.6, 0, 0,
        -0.6, -0.25, 0, //Hale Bunn
        -0.8, -0.25, 0,
        -0.6, 0, 0
    ]);

    let arrows = verticesT.length / 3;
    let positionBufferT = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferT);
    gl.bufferData(gl.ARRAY_BUFFER, verticesT, gl.STATIC_DRAW);
    let posAttribT = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(posAttribT, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribT);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return arrows;
}

/*
function colorLinesBuffer(gl) {

    let colorLines = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ]);

    let colorLinesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    let colorAttrib = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(colorAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return colorLinesBuffer;
}

function  colorTrianglesBuffer(gl) {

let colorLines = new Float32Array([

    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,


]);

let colorBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorLines, gl.STATIC_DRAW);

let colorAttrib = gl.getAttribLocation(gl.program, "a_Color");
gl.vertexAttribPointer(colorAttrib, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorAttrib);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
}*/