
// Class to controll the camera projection and view matricies
class CameraMatrixController {
	static keyWDown = false;
	static keyADown = false;
	static keySDown = false;
	static keyDDown = false;
	static keyShiftDown = false;
	static keySpaceDown = false;
	static flyToggle = false;

	static mouseDiffX = 0.0;
	static mouseDiffY = 0.0;

	static canvas; 

	constructor(options={}) {

		this.flySpeed = Abubu.readOption(options.flySpeed, 1.0);
		this.rotateSpeed = Abubu.readOption(options.rotateSpeed, 0.01);

		this.position = Abubu.readOption(options.position, [-15.0, 28.0, 30.0]);
		this.rotation = Abubu.readOption(options.rotation, [0.0, -0.25*3.14159]);

		this.fieldOfView = Abubu.readOption(options.fieldOfView, Math.PI/2.0);
		this.aspectRatio = Abubu.readOption(options.aspectRatio, 1.0);
		this.nearZClip = Abubu.readOption(options.nearZClip, 0.5);
		this.farZClip = Abubu.readOption(options.farZClip, 150.0);

		this.perspectiveMatrix = mat4.create();
		mat4.perspective(this.perspectiveMatrix, this.fieldOfView,
		 				 this.aspectRatio, this.nearZClip, this.farZClip);
	}

	static addListeners(canvas) {
		CameraMatrixController.canvas = canvas;

		document.addEventListener('keydown', CameraMatrixController.keyDownHandler, false);
		document.addEventListener('keyup', CameraMatrixController.keyUpHandler, false);
		document.addEventListener('mousemove', CameraMatrixController.mouseHandler, false);


		canvas.requestPointerLock = canvas.requestPointerLock ||
									canvas.mozRequestPointerLock ||
									canvas.webkitRequestPointerLock;

		document.exitPointerLock = document.exitPointerLock ||
								   document.mozExitPointerLock ||
								   document.webkitExitPointerLock;

		document.addEventListener('pointerlockchange',
								  CameraMatrixController.pointerLockHandler, false);
		document.addEventListener('mozpointerlockchange', 
								  CameraMatrixController.pointerLockHandler, false);
		document.addEventListener('webkitpointerlockchange',
								  CameraMatrixController.pointerLockHandler, false);
	}

	static pointerLockHandler(event) {
		if (!(document.pointerLockElement === CameraMatrixController.canvas ||
		    document.mozPointerLockElement === CameraMatrixController.canvas ||
		    document.webkitPointerLockElement === CameraMatrixController.canvas)) {
		 	// Pointer was just unlocked
			CameraMatrixController.flyToggle = false;
		}
	}

	static keyDownHandler(event) {
		switch (event.keyCode) {
		case 87:
			CameraMatrixController.keyWDown = true;
			break;
		case 65:
			CameraMatrixController.keyADown = true; 
			break;
		case 83:
			CameraMatrixController.keySDown = true; 
			break;
		case 68:
			CameraMatrixController.keyDDown = true;
			break;
		case 16:
			CameraMatrixController.keyShiftDown = true;
			break;
		case 32:
			CameraMatrixController.keySpaceDown = true;
			break;
		case 70:
			CameraMatrixController.flyToggle = !CameraMatrixController.flyToggle;
			if (CameraMatrixController.flyToggle) {
				CameraMatrixController.canvas.requestPointerLock();
			} else {
				document.exitPointerLock();
			}

			CameraMatrixController.mouseDiffX = 0.0;
			CameraMatrixController.mouseDiffY = 0.0;
			break;
		default:
		}
	}

	static keyUpHandler(event) {
		switch (event.keyCode) {
		case 87:
			CameraMatrixController.keyWDown = false
			break;
		case 65:
			CameraMatrixController.keyADown = false; 
			break;
		case 83:
			CameraMatrixController.keySDown = false; 
			break;
		case 68:
			CameraMatrixController.keyDDown = false;
			break;
		case 16:
			CameraMatrixController.keyShiftDown = false;
			break;
		case 32:
			CameraMatrixController.keySpaceDown = false;
			break;
		default:
		}
	}

	static mouseHandler(event) {
		CameraMatrixController.mouseDiffX += event.movementX;
		CameraMatrixController.mouseDiffY += event.movementY;
	}

	updateCameraMatrix() {
		if (CameraMatrixController.flyToggle) {
			this.rotation[0] -= CameraMatrixController.mouseDiffY*this.rotateSpeed;
			this.rotation[1] -= CameraMatrixController.mouseDiffX*this.rotateSpeed;

			CameraMatrixController.mouseDiffX = 0.0;
			CameraMatrixController.mouseDiffY = 0.0;

			var forwards = [0.0, 0.0, -this.flySpeed];
			vec3.rotateY(forwards, forwards, [0.0, 0.0, 0.0], this.rotation[1]);
			var right = vec3.clone(forwards);
			right[0] = -forwards[2];
			right[2] = forwards[0]; 

			if (CameraMatrixController.keyWDown) vec3.add(this.position, this.position, forwards);
			if (CameraMatrixController.keySDown) vec3.scaleAndAdd(this.position, this.position, forwards, -1.0);
			if (CameraMatrixController.keyDDown) vec3.add(this.position, this.position, right);
			if (CameraMatrixController.keyADown) vec3.scaleAndAdd(this.position, this.position, right, -1.0);
			if (CameraMatrixController.keyShiftDown) vec3.add(this.position, this.position, [0.0, -this.flySpeed, 0.0]);
			if (CameraMatrixController.keySpaceDown) vec3.add(this.position, this.position, [0.0, this.flySpeed, 0.0]);

		}
	}

	getCameraMatrix() {
		var cameraMatrix = mat4.clone(this.perspectiveMatrix);
		var rotationInv = [-this.rotation[0], -this.rotation[1]];
		var positionInv = [-this.position[0], -this.position[1], -this.position[2]];
		mat4.rotateX(cameraMatrix, cameraMatrix, rotationInv[0]);
		mat4.rotateY(cameraMatrix, cameraMatrix, rotationInv[1]);
		mat4.translate(cameraMatrix, cameraMatrix, positionInv)
		return cameraMatrix;
	}
}

