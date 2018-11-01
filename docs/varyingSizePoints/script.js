let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75,aspect,0.1,1000);
let renderer = new THREE.WebGLRenderer();
let controls = new THREE.OrbitControls(camera);
//Generate Point Texure from a canvas element
let baseMaterial = generatePointTexture();
renderer.setSize(window.innerWidth,window.innerHeight);
scene.background = new THREE.Color( 0xEAEAEA );
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

//Handle resize
window.addEventListener("resize",onWindowResize,false);
//Object that will generate the scene elements
var SceneBuilder = function(){
	//#region Parameters [can be changed via dat.GUI]
	this.xIterations = 10;
	this.zIterations = 10;
	this.startColor = "#00FF00";
	this.endColor = "#FF0000";
	this.minSize = 1;
	this.maxSize = 5;
	//#endregion
	//#region internal vars
	let _this = this;
	//#endregion
	this.rebuild = function(){
		let colorScale = chroma.scale([this.startColor,this.endColor]).mode("lch").domain([0,this.xIterations-1]);

		//#region Delete Old Instace if Exists
		let toDelete = scene.getObjectByName("points");
		if(typeof toDelete !== "undefined"){
			scene.remove(toDelete);
		}
		//#endregion
		//#region Data
		let vertices = [];
		let colors = [];
		let sizes = [];
		//#endregion
		//#region Populating Data Arrays
		for(let xIterator = 0;xIterator < _this.xIterations;xIterator++){
			let xPosition = xIterator;
			for(let zIterator = 0; zIterator < _this.zIterations; zIterator++){
				let yPosition = 0;
				let zPosition = zIterator;
				let color = new THREE.Color(colorScale(xIterator).num());
				let size = _this.minSize+(zIterator/_this.zIterations)*(_this.maxSize-_this.minSize);
				vertices.push(xPosition,yPosition,zPosition);
				colors.push(color.r,color.g,color.b);
				sizes.push(size);
			}
		}

		//#endregion
		//#region Generate the Geometry
		let geometry = new THREE.BufferGeometry();
		geometry.addAttribute("position",new THREE.BufferAttribute(new Float32Array(vertices),3));
		geometry.addAttribute("customColor",new THREE.BufferAttribute(new Float32Array(colors),3));
		geometry.addAttribute("size",new THREE.BufferAttribute(new Float32Array(sizes),1));
		geometry.computeBoundingSphere();
		//#endregion
		//#region Shader
		let shadermaterial = new THREE.ShaderMaterial({
			uniforms: {
				amplitude: {value:1.0},
				color: {value: new THREE.Color(0xFFFFFF)},
				texture: {value: baseMaterial}
			},
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			depthTest:false,
			transparent:true
		});
		//#endregion
		//#region Material

		//#endregion
		//#region Add to Scene
		let points = new THREE.Points(geometry,shadermaterial);
		points.name = "points";
		scene.add(points);
		//#endregion
	};
};
//show in beginning
var sceneBuilder = new SceneBuilder();
sceneBuilder.rebuild();


//#region dat.GUI
let gui = new dat.GUI();
gui.add(sceneBuilder,"xIterations",1,100);
gui.add(sceneBuilder,"zIterations",1,100);
gui.add(sceneBuilder,"minSize",0.1,10);
gui.add(sceneBuilder,"maxSize",0.1,10);
gui.addColor(sceneBuilder,"startColor");
gui.addColor(sceneBuilder,"endColor");
gui.add(sceneBuilder,"rebuild");
//#endregion








//functions
function onWindowResize(){
	aspect = window.innerWidth/window.innerHeight;
	camera.aspect = aspect;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth,window.innerHeight);
}
//#region Generate point material texture
function generatePointTexture(){
	let canvas = document.createElement("canvas");
	canvas.width = canvas.height = 64;
	let ctx = canvas.getContext("2d");
	let tex = new THREE.Texture(canvas);
	ctx.beginPath();
	ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2-3,0,2*Math.PI);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	tex.needsUpdate = true;
	if(tex.minFilter !== THREE.NearestFilter && tex.minFilter !== THREE.LinearFilter){
		tex.minFilter = THREE.NearestFilter;
	}
	return tex;
}
//#endregion


function animate(){
	controls.update();

	renderer.render(scene,camera);
	requestAnimationFrame(animate);
}
animate();
