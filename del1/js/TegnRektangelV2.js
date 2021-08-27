// TegnRektangel.js
//
function main() {
	// Henter <canvas> elementet:
	let canvas = document.getElementById('eksempel_1');
	if (!canvas) {
	 console.log('Fikk ikke hentet <canvas> elementet');
	 return;
	}

	// RenderingContext for 2D
	let ctx = canvas.getContext('2d');
	// Tegner et grønt rektangel:
	ctx.fillStyle = 'rgba(0, 255, 0, 1.0)';//Grønn farge
	ctx.fillRect(0, 0, 1250, 1250); // Fylt rektangel
}
