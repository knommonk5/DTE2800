// Globale variabler:
let gl = null;
let canvas = null;

// Verteksbuffer:
let cubePositionBuffer = null;
let cubeColorBuffer = null;

// "Pekere" som brukes til å sende matrisene til shaderen:
let u_modelviewMatrix = null;
let u_projectionMatrix = null;

// Matrisene:
let modelMatrix = null;
let viewMatrix = null;
let modelviewMatrix = null;
let projectionMatrix = null;

function main() {
    if (!initContext())
        return;

    // Initialiser shadere (cuon-utils).
    let vertexShaderSource = document.getElementById('vertex-shader').innerHTML;
    let fragmentShaderSource = document.getElementById('fragment-shader').innerHTML;
    gl.myShaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!gl.myShaderProgram) {
        console.log('Feil ved initialisering av shadere. Sjekk shaderkoden.');
        return;
    }

    //Initialiserer matrisene:
    modelMatrix = new Matrix4();
    viewMatrix = new Matrix4();
    modelviewMatrix = new Matrix4();
    projectionMatrix = new Matrix4();

    // Setter bakgrunnsfarge:
    gl.clearColor(0.8, 0.8, 0.8, 1.0); //RGBA

    // Initialiserer verteksbuffer:
    initCubeBuffer();
    // Start animasjonsløkka:
    draw();
}

function initCubeBuffer() {
    //36 stk posisjoner:
    let cubePositions = new Float32Array([
        //Forsiden (pos):
        -1, 1, 1,
        -1,-1, 1,
        1,-1, 1,

        -1,1,1,
        1, -1, 1,
        1,1,1,

        //H�yre side:
        1,1,1,
        1,-1,1,
        1,-1,-1,

        1,1,1,
        1,-1,-1,
        1,1,-1,

        //Baksiden (pos):
        1,-1,-1,
        -1,-1,-1,
        1, 1,-1,

        -1,-1,-1,
        -1,1,-1,
        1,1,-1,

        //Venstre side:
        -1,-1,-1,
        -1,1,1,
        -1,1,-1,

        -1,-1,1,
        -1,1,1,
        -1,-1,-1,

        //Topp:
        -1,1,1,
        1,1,1,
        -1,1,-1,

        -1,1,-1,
        1,1,1,
        1,1,-1,

        //Bunn:
        -1, -1, -1,
        1, -1, 1,
        -1, -1, 1,

        -1, -1, -1,
        1, -1, -1,
        1, -1, 1
    ]);

    //Ulike farge for hver side:
    let cubeColors = new Float32Array([
        //Forsiden:
        1.0, 0.0, 0.0, 1,
        1.0, 0.0, 0.0, 1,
        1.0, 0.0, 0.0, 1,

        1.0, 0.0, 0.0, 1,
        1.0, 0.0, 0.0, 1,
        1.0, 0.0, 0.0, 1,

        //H�yre side:
        0.0, 1.0, 0.0, 1,
        0.0, 1.0, 0.0, 1,
        0.0, 1.0, 0.0, 1,

        0.0, 1.0, 0.0, 1,
        0.0, 1.0, 0.0, 1,
        0.0, 1.0, 0.0, 1,

        //Baksiden:
        1.0, 0, 0.0, 1,
        1.0, 0, 0.0, 1,
        1.0, 0, 0.0, 1,

        1.0, 0, 0.0, 1,
        1.0, 0, 0.0, 1,
        1.0, 0, 0.0, 1,

        //Venstre side:
        0.0, 0.0, 1.0, 1,
        0.0, 0.0, 1.0, 1,
        0.0, 0.0, 1.0, 1,

        0.0, 0.0, 1.0, 1,
        0.0, 0.0, 1.0, 1,
        0.0, 0.0, 1.0, 1,

        //Topp
        0.0, 0.0, 1, 1,
        0.0, 0.0, 1, 1,
        0.0, 0.0, 1, 1,

        0.0, 0.0, 1, 1,
        0.0, 0.0, 1, 1,
        0.0, 0.0, 1, 1,

        //Bunn:
        0.5, 0.7, 0.3, 1,
        0.5, 0.7, 0.3, 1,
        0.5, 0.7, 0.3, 1,

        0.5, 0.7, 0.3, 1,
        0.5, 0.7, 0.3, 1,
        0.5, 0.7, 0.3, 1

    ]);

    // Verteksbuffer for trekanten:
    cubePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubePositions, gl.STATIC_DRAW);
    cubePositionBuffer.itemSize = 3; 		// NB!!
    cubePositionBuffer.numberOfItems = 36;	// NB!!
    gl.bindBuffer(gl.ARRAY_BUFFER, null);	// NB!! M� kople fra n�r det opereres med flere buffer! Kopler til i draw().

    //Fargebuffer: oppretter, binder og skriver data til bufret:
    cubeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
    cubeColorBuffer.itemSize = 4; 			// 4 float per farge.
    cubeColorBuffer.numberOfItems = 36; 	// 36 farger.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//NB! Denne tar i mot aktuelt shaderprogram som parameter:
function initUniforms(shaderProgram) {
    // Kopler shaderparametre med Javascript-variabler:
    // Matriser: u_modelviewMatrix & u_projectionMatrix
    u_modelviewMatrix = gl.getUniformLocation(shaderProgram, 'u_modelviewMatrix');
    u_projectionMatrix = gl.getUniformLocation(shaderProgram, 'u_projectionMatrix');
    return true;
}

function drawCube() {

    // NB! PASS PÅ DENNE DERSOM FLERE SHADERPAR ER I BRUK!
    // Binder shaderparametre:
    if (!initUniforms(gl.myShaderProgram))
        return;
    gl.useProgram(gl.myShaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
    let a_Position = gl.getAttribLocation(gl.myShaderProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, cubePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    let a_Color = gl.getAttribLocation(gl.myShaderProgram, 'a_Color');
    gl.vertexAttribPointer(a_Color, cubeColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    //Still inn kamera:
    setupCamera();
    modelMatrix.setIdentity();
    // Slår sammen modell & view til modelview-matrise:
    modelviewMatrix = viewMatrix.multiply(modelMatrix); // NB! rekkef�lge!
    // Sender matriser til shader:
    gl.uniformMatrix4fv(u_modelviewMatrix, false, modelviewMatrix.elements);
    gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix.elements);
    // Tegner trekanten:
    gl.drawArrays(gl.TRIANGLES, 0, cubePositionBuffer.numberOfItems);
}

function draw(currentTime) {

    //Sørger for at draw kalles p� nytt:
    window.requestAnimationFrame(draw);

    // GJENNOMSIKTIGHET:
    // Aktiverer fargeblanding (&indirekte gjennomsiktighet).
    //gl.enable(gl.BLEND);
    // Angir blandefunksjon:
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //Enables depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    //Backface Culling:
    gl.frontFace(gl.CCW);		//indikerer at trekanter med vertekser angitt i CCW er front-facing!
    gl.enable(gl.CULL_FACE);	//enabler culling.
    gl.cullFace(gl.BACK);		//culler baksider.

    //Rensk skjermen:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //TEGNER:
    drawCube();

}

function initContext() {
    // Hent <canvas> elementet
    canvas = document.getElementById('webgl');

    // Rendering context for WebGL:
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Fikk ikke tak i rendering context for WebGL');
        return false;
    }

    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('keydown', handleKeyDown, false);

    return true;
}
