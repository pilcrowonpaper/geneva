<script>
	import { marchingCubes } from './marchingCubes3';
	import { waveFunction, theta, phi, radius } from './waveFunction';
	import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let threeContainer;
	// L_value: size of the axis
	let L_value = 30;
	// factor: how many points per 1 unit distance
	let factor = 3;
	let n_value = 1;
	let l_value = 0;
	let m_value = 0;
	// minimum_percent: minimum PDF to render in
	let minimum_percent = 0.001;
	let smoothness = 0.01;

	let sizeValue;
	$: sizeValue = L_value * factor;

	let renderer, camera, scene;
	let inner_height, inner_width;

	let cubeCount = 'loading...';
	let error = false;

	let buttonText = 'calculating...';

	const getData = (size) => {
		return new Promise((resolve, reject) => {
			let max_x = 0;
			let max_y = 0;
			let max_z = 0;
			let data = {};
			let x = size * -1;
			while (x <= size) {
				data[x] = {};
				let y = size * -1;
				while (y <= size) {
					let z = size * -1;
					data[x][y] = {};
					while (z <= size) {
						let percent =
							waveFunction(
								n_value,
								l_value,
								m_value,
								radius(x / factor, y / factor, z / factor),
								theta(x / factor, y / factor, z / factor),
								phi(y / factor, x / factor)
							) ** 2;
						if (!isNaN(percent)) {
							data[x][y][z] = percent;
						} else {
							data[x][y][z] = 0;
						}
						if (percent > minimum_percent) {
							if (Math.abs(x) > max_x) {
								max_x = Math.abs(x);
							}
							if (Math.abs(y) > max_y) {
								max_y = Math.abs(y);
							}
							if (Math.abs(z) > max_z) {
								max_z = Math.abs(z);
							}
						}
						z++;
					}
					y++;
				}
				x++;
			}
			resolve({
				object: data,
				x: max_x,
				y: max_y,
				z: max_z
			});
		});
	};

	let object;

	const renderScene = () => {
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}
		error = false;
		getData(sizeValue)
			.then((result) => {
				console.log(result);
				const getPositions = marchingCubes(
					result.object,
					result.x + 1,
					result.y + 1,
					result.z + 1,
					minimum_percent
				);
				const positions = getPositions.mesh;
				cubeCount = getPositions.cubes;

				const geometry = new THREE.BufferGeometry();

				geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
				const mergedGeometry = BufferGeometryUtils.mergeVertices(geometry, smoothness);
				mergedGeometry.computeVertexNormals();

				const material = new THREE.MeshNormalMaterial();
				material.side = THREE.DoubleSide;

				object = new THREE.Mesh(mergedGeometry, material);
				scene.add(object);
				camera.position.z = result.z * 4;

				animate();
				buttonText = 'calculate';
			})
			.catch(() => {
				error = true;
			});
	};

	//console.log(marchingCubes(positivePoints, sizeValue));
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	onMount(() => {
		setTimeout(() => {
			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xffffff);
			camera = new THREE.PerspectiveCamera(45, inner_width / inner_height, 0.1, 2000);

			renderer = new THREE.WebGLRenderer();
			renderer.setSize(inner_width, inner_height);
			threeContainer.appendChild(renderer.domElement);

			const light = new THREE.HemisphereLight(0x456dff, 0x2e4bb3, 1);
			scene.add(light);

			const controls = new OrbitControls(camera, renderer.domElement);
			controls.update();

			calculateScene();
		}, 1000);
	});

	$: if (inner_height && inner_width) {
		if (renderer) {
			renderer.setSize(inner_width, inner_height);
			camera.aspect = inner_width / inner_height;
			camera.updateProjectionMatrix();
		}
	}

	const animate = () => {
		requestAnimationFrame(animate);
		if (rotate) {
			object.rotation.x += 0.01;
			object.rotation.y += 0.01;
		}

		renderer.render(scene, camera);
	};

	const calculateScene = () => {
		buttonText = 'calculating...';
		setTimeout(() => {
			renderScene();
		}, 10);
	};

	let rotate = true
</script>

<div
	class="place-items-center place-content-center h-full w-full flex flex-row"
	in:fade={{ duration: 600 }}
	out:fade={{ duration: 300 }}
>
	<div class="w-72 h-full bg-gray-50 flex flex-col py-12 px-6 gap-6 overflow-scroll">
		<div class="flex flex-col gap-3">
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">detail</div>
				<div class="text-sm text-gray-400 -mt-1">1 ~ 6</div>
				<input
					type="number"
					min="1"
					max="6"
					class="w-20 appearance-none mt-1"
					bind:value={factor}
				/>
			</div>
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">smoothness</div>
				<div class="text-sm text-gray-400 -mt-1">0.0001 ~ 2</div>
				<input type="number" class="w-20 appearance-none mt-1" bind:value={smoothness} />
			</div>
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">box size</div>
				<div class="text-sm text-gray-400 -mt-1">*2 = width of the box</div>
				<input type="number" class="w-20 appearance-none mt-1" bind:value={L_value} />
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">n value</div>
				<div class="text-sm text-gray-400 -mt-1">principal quantum number</div>
				<input type="number" class="w-20 appearance-none mt-1" bind:value={n_value} />
			</div>
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">l value</div>
				<div class="text-sm text-gray-400 -mt-1">angular momentum quantum number</div>
				<input type="number" min="0.0001" class="w-20 appearance-none mt-1" bind:value={l_value} />
			</div>
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">m value</div>
				<div class="text-sm text-gray-400 -mt-1">magnetic quantum number</div>
				<input type="number" class="w-20 appearance-none mt-1" bind:value={m_value} />
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex flex-col">
				<div class="font-semibold text-gray-800">minimum probability</div>
				<div class="text-sm text-gray-400 -mt-1">(shouldn't touch it)</div>
				<input type="number" class="w-20 appearance-none mt-1" bind:value={minimum_percent} />
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex flex-row place-items-center gap-2">
				<input type="checkbox" bind:checked={rotate} />
				<div class="font-semibold text-gray-800">animate</div>
			</div>
		</div>
		<div class="flex flex-col">
			<div class="text-sm text-gray-400">cubes marched:</div>
			<div class="font-semibold text-gray-800">{cubeCount}</div>
		</div>
		<div class="pt-6">
			<div
				class="w-full rounded-md border-2 border-black py-1 bg-gray-800 text-white font-semibold text-center hover:bg-transparent active:bg-gray-100 hover:text-gray-800 active:text-gray-800 cursor-pointer select-none"
				on:click={calculateScene}
			>
				{buttonText}
			</div>
			{#if error}
				<div class="text-sm text-red-400 mt-0.5">an unknown error occured</div>
			{/if}
			<div class="text-sm text-gray-400 mt-1">
				it might take a while to calculate! (the website will freeze when calculating)
			</div>
		</div>
	</div>
	<div class="flex flex-grow h-full bg-white">
		<div
			bind:this={threeContainer}
			bind:offsetWidth={inner_width}
			bind:offsetHeight={inner_height}
			class="h-full w-full"
		/>
	</div>
</div>
