function init() {

  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  //scene untuk menampung semua elemet (object, camera, lighting)

  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;


  // points group
  var spGroup;

  // setup untuk controls
  var controls = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.segments = 12;
    this.phiStart = 0;
    this.phiLength = Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return generatePoints(controls.segments, controls.phiStart, controls.phiLength);
      });
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
  gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

   // menambahkan opsi material agar bisa dipilih dalam control
   gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})
  gui.add(controls, 'redraw');

  //generate 30 points
  function generatePoints(segments, phiStart, phiLength) {

    if (spGroup) scene.remove(spGroup)

    var points = [];
    var height = 5;
    var count = 30;
    for (var i = 0; i < count; i++) {
      points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) +
      count / 2));
    }

    spGroup = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false
    });
    points.forEach(function (point) {

      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.set(point.x, point.y, 0);

      spGroup.add(spMesh);
    });

    scene.add(spGroup);

    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    return latheGeometry;
  }

  var step = 0;
  controls.redraw();
  render();
  
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.005
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step

    if (spGroup) {
      spGroup.rotation.y = step
      spGroup.rotation.x = step
      spGroup.rotation.z = step
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}