// Find the latest version by visiting https://cdn.skypack.dev/three.
  
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1'

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

import * as dat from "dat.gui"

import gsap from "gsap"


//const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}
//gui.add(world.plane, "width", 1, 500).onChange(generatePlane)

//gui.add(world.plane, "height", 1, 500).onChange(generatePlane)

//gui.add(world.plane, "widthSegments", 1, 60).onChange(generatePlane)

//gui.add(world.plane, "heightSegments", 1, 60).onChange(generatePlane)

function generatePlane() {
  planemesh.geometry.dispose()
  planemesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)

  //vert pozisyonları
const { array } = planemesh.geometry.attributes.position
const randomValues = []

for (let i = 0; i < array.length; i++) {
  
  if(i % 3 === 0){
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]
  
  array[i] = x + (Math.random() - 0.5)
  array[i + 1] = y + (Math.random() - 0.5)*3
  array[i + 2] = z + (Math.random() - 0.5)*3
}
  randomValues.push(Math.random() - 0.5) *3
}
planemesh.geometry.attributes.position.randomValues = randomValues
planemesh.geometry.attributes.position.originalPosition = planemesh.geometry.attributes.position.array

  
const colors = []
for (let i = 0; i < planemesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}

planemesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
  
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.
  PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer() 



renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planematerial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true })
const planemesh = new THREE.Mesh(planeGeometry, planematerial)
scene.add(planemesh)
generatePlane()


const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 1, 1)
scene.add(backLight)

//console.log(planeGeometry)

const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera,)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const { array, originalPosition, randomValues} = planemesh.geometry.attributes.position

  for (let i = 0; i < array.length; i+=3) {
   
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005

    //y
    array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1]) * 0.005
  }

  planemesh.geometry.attributes.position.needsUpdate = true

  
  const intersects = raycaster.intersectObject(planemesh)
  if (intersects.length > 0) {

    const { color } = intersects[0].object.geometry.attributes

    //vert 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)
    //vert 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)
    //vert 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r, g: initialColor.g, b: initialColor.b, onUpdate: () => {
      
    //vert 1
    color.setX(intersects[0].face.a, hoverColor.r)
    color.setY(intersects[0].face.a, hoverColor.g)
    color.setZ(intersects[0].face.a, hoverColor.b)
    //vert 2
    color.setX(intersects[0].face.b, hoverColor.r)
    color.setY(intersects[0].face.b, hoverColor.g)
    color.setZ(intersects[0].face.b, hoverColor.b)
    //vert 3
    color.setX(intersects[0].face.c, hoverColor.r)
    color.setY(intersects[0].face.c, hoverColor.g)
    color.setZ(intersects[0].face.c, hoverColor.b)
    
        color.needsUpdate = true

     }})
  }
  
  //console.log(intersects)
  
  //planemesh.rotation.x +=0.01
}



animate()


addEventListener("mousemove", (event) => {
  
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  //console.log(mouse)
  
})