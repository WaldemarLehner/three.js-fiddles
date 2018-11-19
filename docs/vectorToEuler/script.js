var startBtn = document.getElementById("start");
var output = document.getElementById("output");
startBtn.addEventListener("click",start);
function start(){
	let message = "";
	let x = Number(document.getElementById("vec_x").value);
	let y = Number(document.getElementById("vec_y").value);
	if(isNaN(x) || isNaN(y)){
		log("Error: At least one input is not a valid number!");
		return;
	}
	//turn degrees into radians
	x = clampTwoPi(x*Math.PI/180);
	y = clampTwoPi(y*Math.PI/180);


//See what we started with:
	let negZ = new THREE.Vector3(0,0,-1);
	message += "Using Unit Vector (0,0,-1) and Euler Angle("+Math.round(x*1000)/1000+","+Math.round(y*1000)/1000+",0);<br>";
//Apply rotation to vector:
	let appliedEuler = negZ.applyEuler(new THREE.Euler(x,y,0,"ZYX"));
	message += "Applying Euler on Vector: v( "+round(appliedEuler.x)+" | "+round(appliedEuler.y)+" | "+round(appliedEuler.z)+" )<br>";
//Get spherical coordinates from vector
	//let spherical = new THREE.Spherical().setFromVector3(appliedEuler);
	//message += `Spherical coordinates from rotated vector:phi ${round(spherical.phi)} ;theta ${round(spherical.theta)}<br>`;
//Get yaw and pitch
	let yaw = clampTwoPi(Math.atan2(appliedEuler.x,appliedEuler.z));
	let v_xz = new THREE.Vector2(appliedEuler.x,appliedEuler.z);
	console.log(v_xz.length());
	let pitch =	clampTwoPi(Math.atan2(v_xz.length(),y));
	message += `Finding Pitch and Yaw: p: ${round(pitch)} y: ${round(yaw)} <br>`;



	log(message);
}
function round(input){
	return Math.round(input*1000)/1000;
}
function clampTwoPi(i){
	if(i > 0){
		i = i%(2*Math.PI);
	}else if(i < 0){
		i = i%(2*Math.PI)+2*Math.PI;
	}
	return i;
}
function log(input){
	output.innerHTML = input;
}
