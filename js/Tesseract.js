
let container;
let stats;
let camera;
let scene;
let renderer;
let mesh;

function init() {

    container = document.querySelector('#scene-container');
    

    //create a Scene 創造場景
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    //background color 背景顏色
    // const loaderBg = new THREE.TextureLoader();
    // const bgTexture = loaderBg.load('../textures/space6.jpeg');

    // const canvasAspect = container.clientWidth / container.clientHeight;
    // const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    // const aspect = imageAspect / canvasAspect;

    // bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    // bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    // bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    // bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
    // scene.background = bgTexture;
    // scene.background = new THREE.Color(0x222222);


    //camera 創造相機
    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 8000);
    camera.position.z = 2750;

    const segments = geometryData.segments;

    // create a geometry 創造幾何圖型
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ vertexColors: true });

    const box = new THREE.BoxBufferGeometry(650, 650, 600, 50, 50, 50);

    var wireframe = new THREE.WireframeGeometry(box);

    var line = new THREE.LineSegments(wireframe);
    line.material.depthTest = true;
    line.material.opacity = 0.3;
    line.material.transparent = true;

    // const cube = new THREE.Mesh(box);



    //OrbitControls 模型控制器
    // function createControls() {
    //     controls = new THREE.TrackballControls(camera, container);
    // }
    // createControls();

    

    const controls = new THREE.OrbitControls(camera, container);


    const positions = [];
    const colors = [];

    const r = geometryData.radius;

    for (var i = 0; i < segments; i++) {

        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = Math.random() * r - r / 2;

        // positions

        positions.push(x, y, z);

        // colors

        colors.push((x / r) + 0.2);
        colors.push((y / r) + 0.6);
        colors.push((z / r) + 1);

    }

    //axes, grid helper
    const size = 1000;
    const divisions = 100;

    const gridHelper = new THREE.GridHelper(size, divisions);

    const axesHelper = new THREE.AxesHelper(1000);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    mesh = new THREE.Line(geometry, material);
    mesh.add(line);
    scene.add(mesh, axesHelper);


    // creat the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

}

//RWD
function onWindowResize() {
    // console.log( '你調整瀏覽器大小' );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize', onWindowResize);


function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}


function render() {

    var time = Date.now() * 0.001;

    mesh.rotation.x = time * geometryData.rotationSpeed;
    mesh.rotation.y = time * geometryData.rotationSpeed;
    // mesh.rotation.z = time * geometryData.rotationSpeed;

    renderer.render(scene, camera);

}

// ====================================

//GUI Display

const gui = new dat.GUI();

//GUI 球體參數
const geometryData = {
    segments: 9000,
    radius: 600,
    rotationSpeed: 0.1,
};


//GUI參數加入
const geometryFolder = gui.addFolder("Tesseract")
geometryFolder.add(geometryData, 'segments', 1, 10000).onChange(regenerateBufferGeometry);
geometryFolder.add(geometryData, 'radius', 1, 800).onChange(regenerateBufferGeometry);
geometryFolder.add(geometryData, 'rotationSpeed', 0, 10).onChange(regenerateBufferGeometry);
geometryFolder.open();

//gui更新需要重新繪製Geometry

function regenerateBufferGeometry() {
    //Geometry

    let newGeometry = new THREE.BufferGeometry();
    
    const positions = [];
    const colors = [];
    const r = geometryData.radius;

    for (var i = 0; i < geometryData.segments; i++) {
        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = Math.random() * r - r / 2;

        // positions
        positions.push(x, y, z);

        // colors
        colors.push((x / r) + 0.2);
        colors.push((y / r) + 0.6);
        colors.push((z / r) + 1);
    }
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    newGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    newGeometry.computeBoundingSphere();

    mesh.geometry.dispose()
    mesh.geometry = newGeometry
}

init();
animate();


