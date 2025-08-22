// Import required Three.js modules
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
	const modelId = document.body.dataset.modelId;
	const videoCode = document.body.dataset.videoCode;
	if (!modelId) {
		console.error("Model ID is missing.");
		return;
	}
	previewSimulation(modelId, videoCode);
});

// Function to fetch model details from the server
function previewSimulation(modelId, videoCode) {
	fetch("../phpscripts/std/get-model.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ model_id: modelId }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.status === "success" && data.model.length > 0) {
				const modelUrl = `../assets/models/${data.model[0].file}`;
				load3DModel(modelUrl, videoCode);
			} else {
				console.error("Error:", data.message);
			}
		})
		.catch((error) => {
			console.error("Fetch Error:", error);
		});
}

// Function to load and display the 3D model
function load3DModel(modelUrl, videoCode) {
	const container = document.getElementById("simulationPreview");
	const loaderElement = document.getElementById("loader");

	// Show loader
	loaderElement.style.display = "block";

	// Create a wrapper div for fade-in effect
	let modelContainer = container.querySelector(".model-container");
	if (!modelContainer) {
		modelContainer = document.createElement("div");
		modelContainer.className = "model-container";
		container.appendChild(modelContainer);
	}

	let canvas = modelContainer.querySelector("canvas");
	if (!canvas) {
		canvas = document.createElement("canvas");
		modelContainer.appendChild(canvas);
	}

	let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.physicallyCorrectLights = true;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.2;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.setClearColor(0xffffff, 1);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x87ceeb);

	// Lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(5, 10, 7.5);
	scene.add(directionalLight);

	const camera = new THREE.PerspectiveCamera(
		75,
		container.clientWidth / container.clientHeight,
		0.1,
		1000
	);
	camera.position.set(0, 1.6, 3);

	// Model Controls
	const controls = new PointerLockControls(camera, document.body);
	container.addEventListener("click", () => {
		controls.lock();
	});

	const moveSpeed = 0.1;
	const keys = {
		w: false,
		s: false,
		a: false,
		d: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	document.addEventListener("keydown", (event) => {
		if (event.key in keys) keys[event.key] = true;
	});

	document.addEventListener("keyup", (event) => {
		if (event.key in keys) keys[event.key] = false;
	});

	// Updated moveCamera function to handle vertical movement
	function moveCamera() {
		const direction = new THREE.Vector3();

		// Get camera direction
		camera.getWorldDirection(direction);

		if (keys.w) {
			// Move forward (along the direction)
			controls.moveForward(moveSpeed);
		}
		if (keys.s) {
			// Move backward (along the direction)
			controls.moveForward(-moveSpeed);
		}
		if (keys.a) {
			// Move left
			controls.moveRight(-moveSpeed);
		}
		if (keys.d) {
			// Move right
			controls.moveRight(moveSpeed);
		}
		// For moving vertically (upwards or downwards)
		if (keys["ArrowUp"]) {
			// Move upwards (Y-axis)
			camera.position.y += moveSpeed;
		}
		if (keys["ArrowDown"]) {
			// Move downwards (Y-axis)
			camera.position.y -= moveSpeed;
		}
	}

	const loader = new GLTFLoader();
	let mixer;
	const clock = new THREE.Clock();

	function animate() {
		requestAnimationFrame(animate);
		moveCamera();
		if (mixer) mixer.update(clock.getDelta());
		renderer.render(scene, camera);
	}

	window.addEventListener("resize", () => {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	});

	loader.load(
		modelUrl,
		function (gltf) {
			const model = gltf.scene;
			scene.add(model);

			model.traverse((node) => {
				if (node.isMesh) {
					node.material.needsUpdate = true;
					if (node.material.map) {
						node.material.map.encoding = THREE.sRGBEncoding;
						node.material.map.anisotropy =
							renderer.capabilities.getMaxAnisotropy();
					}
					node.material.flatShading = false; // Smooths out faces
					node.castShadow = true;
					node.receiveShadow = true;
					node.geometry.computeVertexNormals();
				}
			});

			model.scale.set(1, 1, 1);
			model.position.set(0, 0, 0);
			model.rotation.y = Math.PI / 2;

			mixer = new THREE.AnimationMixer(model);
			const animations = gltf.animations;
			if (animations.length > 0) {
				const action = mixer.clipAction(animations[0]);
				action.play();
				createControlButtons(mixer, animations, videoCode);
			}

			// ✅ Hide loader smoothly
			loaderElement.style.opacity = "0";
			setTimeout(() => {
				loaderElement.style.display = "none";
			}, 300); // Smooth hide animation delay

			// ✅ Apply fade-in effect to the model
			modelContainer.classList.add("show");

			animate();
		},
		function (xhr) {
			console.log(
				`Loading model: ${Math.round((xhr.loaded / xhr.total) * 100)}%`
			);
		},
		function (error) {
			console.error("An error occurred while loading the model:", error);
			loaderElement.style.display = "none";
		}
	);
}

function createControlButtons(mixer, animations, videoCode) {
	let buttonContainer = document.getElementById("buttonContainer");
	if (!buttonContainer) {
		console.error("Button container not found.");
		return;
	}

	buttonContainer.innerHTML = "";
	buttonContainer.classList.add(
		"d-flex",
		"flex-wrap",
		"justify-content-center",
		"gap-2",
		"mt-3"
	);

	// Info Button
	const infoButton = document.createElement("button");
	infoButton.innerHTML = '<i class="fas fa-info-circle"></i> Info';
	infoButton.className = "btn btn-sm btn-primary";
	infoButton.addEventListener("click", () => {
		showInfoModal();
	});
	buttonContainer.appendChild(infoButton);

	// Reset Button
	const resetButton = document.createElement("button");
	resetButton.innerHTML = '<i class="fas fa-redo"></i> Reset';
	resetButton.className = "btn btn-sm btn-danger";
	resetButton.addEventListener("click", () => {
		activeActions.forEach((action) => {
			action.reset(); // Reset animation time
			action.paused = true; // Pause it
		});
		isPlaying = false;
		playPauseButton.innerHTML = '<i class="fas fa-play"></i> Play Animation';
	});

	buttonContainer.appendChild(resetButton);

	// Play/Pause Toggle Button
	const playPauseButton = document.createElement("button");
	playPauseButton.innerHTML = '<i class="fas fa-play"></i> Play Animation';
	playPauseButton.className = "btn btn-sm btn-success";

	let isPlaying = false; // Track play state
	let activeActions = []; // Store active animations

	playPauseButton.addEventListener("click", () => {
		if (isPlaying) {
			// Pause all actions
			activeActions.forEach((action) => (action.paused = true));
			playPauseButton.innerHTML =
				'<i class="fas fa-play"></i> Play Animation';
		} else {
			// Play or resume animations
			if (activeActions.length === 0) {
				// Start animations only once
				animations.forEach((clip) => {
					const action = mixer.clipAction(clip);
					action.play();
					action.clampWhenFinished = true;
					action.loop = THREE.LoopOnce;
					activeActions.push(action);
				});
			} else {
				// Resume animations
				activeActions.forEach((action) => (action.paused = false));
			}
			playPauseButton.innerHTML =
				'<i class="fas fa-pause"></i> Pause Animation';
		}
		isPlaying = !isPlaying;
	});

	buttonContainer.appendChild(playPauseButton);

	// Info Button
	const playVideo = document.createElement("button");
	playVideo.innerHTML =
		'<i class="fa-solid fa-video text-light"></i> Play Video';
	playVideo.className = "btn btn-sm btn-warning text-light";
	playVideo.addEventListener("click", () => {
		showVideoModal(videoCode);
	});
	buttonContainer.appendChild(playVideo);
}

function showInfoModal() {
	const modalElement = document.getElementById("reusableModal");
	const modalTitle = modalElement.querySelector(".modal-title");
	const modalBody = modalElement.querySelector(".modal-body");
	const modalHeader = modalElement.querySelector(
		"#reusableModal .modal-header"
	);
	modalHeader.style.paddingBottom = "0";

	if (!modalTitle || !modalBody) {
		console.error("Modal elements not found.");
		return;
	}

	modalTitle.textContent = "Simulation Controls";
	modalBody.innerHTML = `
		<div class="p-2">
			<h6 class="fw-bold">Navigation:</h6>
			<ul class="mb-2">
				<li><strong>Mouse:</strong> Look around</li>
				<li><strong>W, A, S, D:</strong> Move forward, left, backward, right</li>
				<li><strong>Arrow Up / Down:</strong> Zoom in and out</li>
			</ul>
			<hr>
			<h6 class="fw-bold">Simulation Controls:</h6>
			<ul class="mb-2">
				<li><strong>Play Video:</strong> Watch the simulation in video</li>
				<li><strong>Play/Pause:</strong> Start or pause the simulation</li>
				<li><strong>Reset:</strong> Restart the simulation</li>
			</ul>
			<hr>
			<h6 class="fw-bold">Tips:</h6>
			<ul>
				<li>Use smooth mouse movements for better navigation.</li>
				<li>Zoom in to focus on specific details.</li>
				<li>Pause the simulation to examine static frames.</li>
			</ul>
		</div>
	`;

	// Show the modal
	let modal = new bootstrap.Modal(document.getElementById("reusableModal"));
	modal.show();
}

function showVideoModal(videoSrc) {
	const modalElement = document.getElementById("reusableModal");
	const modalDialog = modalElement.querySelector(".modal-dialog");
	const modalTitle = modalElement.querySelector(".modal-title");
	const modalBody = modalElement.querySelector(".modal-body");
	modalBody.style.padding = ".25rem";
	modalBody.style.paddingBottom = "0";
	const modalHeader = modalElement.querySelector(".modal-header");
	modalHeader.style.paddingBottom = ".25rem";

	if (!modalTitle || !modalBody || !modalDialog) {
		console.error("Modal elements not found.");
		return;
	}

	// modalTitle.textContent = "Video Simulation";

	if (!videoSrc) {
		modalBody.innerHTML = `<p class="text-center text-danger">Currently, no video simulation is available.</p>`;
	} else {
		modalBody.innerHTML = `
            <video id="modalVideo" width="100%" autoplay>
                <source src="../assets/videos/${videoSrc}.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
		modalDialog.classList.add("modal-lg");
	}

	let modal = new bootstrap.Modal(modalElement);
	modal.show();

	modalElement.addEventListener("hidden.bs.modal", function () {
		const video = document.getElementById("modalVideo");
		if (video) {
			video.pause();
			video.currentTime = 0;
		}
	});
}
