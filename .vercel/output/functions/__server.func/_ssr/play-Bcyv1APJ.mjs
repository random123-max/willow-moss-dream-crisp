import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as ArrowLeft } from "../_libs/lucide-react.mjs";
import { C as SphereGeometry, D as Vector3, E as TextureLoader, S as Scene, T as SpriteMaterial, _ as PerspectiveCamera, a as CanvasTexture, b as PointsMaterial, c as Float32BufferAttribute, d as LineBasicMaterial, f as LineSegments, g as NearestFilter, h as MeshLambertMaterial, i as BufferGeometry, l as FogExp2, m as MeshBasicMaterial, n as BoxGeometry, o as DirectionalLight, p as Mesh, r as BufferAttribute, s as EdgesGeometry, t as WebGLRenderer, u as HemisphereLight, v as PointLight, w as Sprite, x as SRGBColorSpace, y as Points } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-Bcyv1APJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Tiny WebAudio SFX bus. Unlock from the first gesture. */
var Sfx = class {
	ctx = null;
	master = null;
	unlock() {
		if (!this.ctx) {
			const C = window.AudioContext || window.webkitAudioContext;
			this.ctx = new C({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.master.gain.value = .22;
			this.master.connect(this.ctx.destination);
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	beep(freq, dur, type, gain = .4) {
		if (!this.ctx || !this.master) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(gain, t + .01);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(this.master);
		osc.start(t);
		osc.stop(t + dur + .02);
	}
	break() {
		this.unlock();
		this.beep(180 + Math.random() * 40, .08, "square", .35);
	}
	place() {
		this.unlock();
		this.beep(320 + Math.random() * 30, .06, "triangle", .3);
	}
	hurt() {
		this.unlock();
		this.beep(140, .14, "sawtooth", .28);
	}
	step() {
		this.unlock();
		this.beep(90 + Math.random() * 20, .04, "square", .12);
	}
};
/** Atlas tile index. Grass/log use per-face mapping in tileFor. */
var TILE = {
	[1]: 0,
	[2]: 2,
	[3]: 3,
	[4]: 4,
	[5]: 5,
	[6]: 6,
	[7]: 8,
	[8]: 9,
	[9]: 10,
	[10]: 11,
	[11]: 12,
	[12]: 13,
	[13]: 14,
	[14]: 15,
	[15]: 16,
	[16]: 17,
	[17]: 18,
	[18]: 19
};
var OPAQUE = {
	[1]: true,
	[2]: true,
	[3]: true,
	[4]: true,
	[5]: true,
	[6]: true,
	[7]: true,
	[8]: false,
	[9]: false,
	[10]: true,
	[11]: true,
	[12]: true,
	[13]: true,
	[14]: true,
	[15]: true,
	[16]: true,
	[17]: true,
	[18]: true
};
function isSolid(id) {
	return id !== 0;
}
function isOpaque(id) {
	return !!OPAQUE[id];
}
function tileFor(id, nx, ny, nz) {
	if (id === 1) {
		if (ny === 1) return 0;
		if (ny === -1) return 2;
		return 1;
	}
	if (id === 6) {
		if (ny !== 0) return 7;
		return 6;
	}
	if (id === 10) {
		if (ny !== 0) return 11;
		return 23;
	}
	return TILE[id] ?? 3;
}
var HOTBAR = [
	{
		id: 1,
		name: "Lunar crust",
		tile: 0
	},
	{
		id: 2,
		name: "Regolith",
		tile: 2
	},
	{
		id: 3,
		name: "Basalt",
		tile: 3
	},
	{
		id: 4,
		name: "Cobble",
		tile: 4
	},
	{
		id: 7,
		name: "Starwood",
		tile: 8
	},
	{
		id: 6,
		name: "Starwood log",
		tile: 6
	},
	{
		id: 9,
		name: "Void glass",
		tile: 10
	},
	{
		id: 10,
		name: "Beacon",
		tile: 11
	},
	{
		id: 13,
		name: "Habitat plate",
		tile: 14
	}
];
var FACE_SHADE = {
	"0,1,0": 1,
	"0,-1,0": .5,
	"1,0,0": .6,
	"-1,0,0": .6,
	"0,0,1": .8,
	"0,0,-1": .8
};
var VILLAGE = {
	x0: 0,
	z0: 0,
	x1: 36,
	z1: 28,
	y: 20
};
function hash2(x, z) {
	let n = x * 374761393 + z * 668265263 | 0;
	n = (n ^ n >> 13) * 1274126177;
	return ((n ^ n >> 16) >>> 0) / 4294967295;
}
function heightAt(x, z) {
	if (inVillage(x, z)) return VILLAGE.y;
	const nx = x * .04;
	const nz = z * .04;
	let h = 18 + Math.sin(nx) * 3.4 + Math.cos(nz * 1.15) * 2.6 + Math.sin((nx + nz) * .55) * 2.1 + Math.sin(nx * 2.2) * .8;
	if (hash2(Math.floor(x / 22), Math.floor(z / 22)) > .78) {
		const cx = Math.floor(x / 22) * 22 + 11;
		const cz = Math.floor(z / 22) * 22 + 11;
		const d = Math.hypot(x - cx, z - cz);
		if (d < 7) h -= (7 - d) * .9;
	}
	return Math.max(6, Math.floor(h));
}
function inVillage(x, z) {
	return x >= VILLAGE.x0 && x <= VILLAGE.x1 && z >= VILLAGE.z0 && z <= VILLAGE.z1;
}
function idx(x, y, z) {
	return x + y * 16 + z * 16 * 40;
}
var stamps = null;
function add(list, x, y, z, id) {
	list.push({
		x,
		y,
		z,
		id
	});
}
function fillBox(list, x0, y0, z0, x1, y1, z1, id, hollow = false) {
	for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
		if (hollow) {
			if (!(x === x0 || x === x1 || z === z0 || z === z1 || y === y0 || y === y1)) continue;
		}
		add(list, x, y, z, id);
	}
}
function house(list, ox, oz, w, d, wall, floor, roof) {
	const y = VILLAGE.y;
	const h = 4;
	fillBox(list, ox, y, oz, ox + w - 1, y, oz + d - 1, floor);
	fillBox(list, ox, y + 1, oz, ox + w - 1, y + h, oz + d - 1, wall, true);
	for (let yy = y; yy <= y + h; yy++) {
		add(list, ox, yy, oz, 6);
		add(list, ox + w - 1, yy, oz, 6);
		add(list, ox, yy, oz + d - 1, 6);
		add(list, ox + w - 1, yy, oz + d - 1, 6);
	}
	fillBox(list, ox - 1, y + h, oz - 1, ox + w, y + h, oz + d, roof);
	fillBox(list, ox, y + h + 1, oz, ox + w - 1, y + h + 1, oz + d - 1, roof);
	const dx = ox + Math.floor(w / 2);
	add(list, dx, y + 1, oz, 0);
	add(list, dx, y + 2, oz, 0);
	add(list, ox + 1, y + 2, oz, 9);
	add(list, ox + w - 2, y + 2, oz, 9);
	add(list, ox, y + 2, oz + 2, 9);
	add(list, ox + w - 1, y + 2, oz + 2, 9);
	add(list, ox + 2, y + 1, oz + d - 2, 15);
	add(list, ox + 3, y + 1, oz + d - 2, 15);
	add(list, dx, y + h - 1, oz + 2, 10);
	add(list, ox + w - 2, y + 1, oz + 2, 7);
}
function tree(list, tx, tz) {
	const h = heightAt(tx, tz);
	const th = 4 + Math.floor(hash2(tx, tz) * 3);
	for (let y = 1; y <= th; y++) add(list, tx, h + y, tz, 6);
	const top = h + th;
	for (let dy = -1; dy <= 2; dy++) {
		const r = dy === 2 ? 1 : 2;
		for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
			if (Math.abs(dx) === r && Math.abs(dz) === r && hash2(tx + dx, tz + dz) < .4) continue;
			if (dx === 0 && dz === 0 && dy <= 0) continue;
			add(list, tx + dx, top + dy, tz + dz, 8);
		}
	}
	add(list, tx, top + 2, tz, 8);
}
function getStamps() {
	if (stamps) return stamps;
	const list = [];
	const y = VILLAGE.y;
	for (let x = 2; x <= 34; x++) {
		add(list, x, y, 12, 17);
		add(list, x, y, 13, 17);
	}
	for (let z = 2; z <= 24; z++) {
		add(list, 16, y, z, 17);
		add(list, 17, y, z, 17);
	}
	house(list, 2, 2, 7, 6, 7, 7, 14);
	house(list, 20, 2, 8, 6, 4, 7, 14);
	house(list, 4, 16, 7, 6, 7, 7, 13);
	fillBox(list, 22, y, 16, 30, y, 24, 2);
	fillBox(list, 22, y + 1, 16, 30, y + 4, 24, 9, true);
	fillBox(list, 22, y + 4, 16, 30, y + 4, 24, 9);
	add(list, 26, y + 1, 16, 0);
	add(list, 26, y + 2, 16, 0);
	add(list, 26, y + 3, 20, 10);
	for (let z = 18; z <= 22; z++) for (let x = 24; x <= 28; x++) add(list, x, y, z, 5);
	fillBox(list, 14, y, 10, 18, y + 1, 14, 4, true);
	add(list, 16, y, 12, 12);
	add(list, 16, y - 1, 12, 12);
	add(list, 16, y + 3, 12, 10);
	fillBox(list, 32, y, 20, 34, y + 8, 22, 4, true);
	fillBox(list, 31, y + 8, 19, 35, y + 8, 23, 7);
	add(list, 33, y + 1, 20, 0);
	add(list, 33, y + 2, 20, 0);
	add(list, 33, y + 9, 21, 10);
	for (let yy = y + 1; yy <= y + 10; yy++) add(list, 33, yy, 4, 13);
	add(list, 33, y + 11, 4, 10);
	add(list, 32, y + 10, 4, 13);
	add(list, 34, y + 10, 4, 13);
	fillBox(list, 31, y, 2, 35, y, 6, 13);
	for (let z = 16; z <= 20; z++) for (let x = 10; x <= 14; x++) add(list, x, y, z, 2);
	add(list, 12, y + 1, 16, 10);
	add(list, 12, y + 1, 20, 10);
	fillBox(list, 1, y, 10, 3, y, 14, 3);
	add(list, 2, y + 1, 12, 18);
	add(list, 2, y + 2, 12, 18);
	for (let z = -40; z <= 50; z += 6) for (let x = -40; x <= 50; x += 6) {
		const jx = x + Math.floor(hash2(x, z) * 4) - 2;
		const jz = z + Math.floor(hash2(z, x) * 4) - 2;
		if (inVillage(jx, jz)) continue;
		if (hash2(jx, jz) > .55) tree(list, jx, jz);
	}
	stamps = list;
	return list;
}
function genChunk(cx, cz) {
	const d = /* @__PURE__ */ new Uint8Array(10240);
	for (let z = 0; z < 16; z++) for (let x = 0; x < 16; x++) {
		const wx = cx * 16 + x;
		const wz = cz * 16 + z;
		const h = heightAt(wx, wz);
		const pond = !inVillage(wx, wz) && hash2(Math.floor(wx / 14), Math.floor(wz / 14)) > .88;
		for (let y = 0; y <= h && y < 40; y++) {
			let id = 3;
			if (y === 0) id = 16;
			else if (y === h) {
				if (pond && h < 17) id = 12;
				else if (inVillage(wx, wz)) id = 1;
				else id = 1;
			} else if (y > h - 3) id = 2;
			if (y < h - 4 && y > 3 && hash2(wx * 3, wz + y * 7) > .973) id = 11;
			if (y < h - 5 && y > 4 && hash2(wx + y, wz * 5) > .985) id = 18;
			if (y > 3 && y < h - 3) {
				if (Math.sin(wx * .21 + y * .17) * Math.cos(wz * .19 - y * .13) + hash2(wx, y + wz) * .35 > .72) id = 0;
			}
			d[idx(x, y, z)] = id;
		}
		if (!inVillage(wx, wz) && hash2(wx + 2, wz + 9) > .993 && h + 1 < 40) d[idx(x, h + 1, z)] = 10;
	}
	const x0 = cx * 16;
	const z0 = cz * 16;
	for (const s of getStamps()) {
		if (s.x < x0 || s.x >= x0 + 16 || s.z < z0 || s.z >= z0 + 16) continue;
		if (s.y < 0 || s.y >= 40) continue;
		d[idx(s.x - x0, s.y, s.z - z0)] = s.id;
	}
	return d;
}
var GRAVITY = 22;
var JUMP = 8.4;
var SPEED = 4.6;
var SPRINT = 6.2;
var EYE = 1.62;
var HW = .3;
var HH = 1.8;
function ck(cx, cz) {
	return `${cx},${cz}`;
}
var HeliosEngine = class {
	renderer;
	scene;
	camera;
	world = /* @__PURE__ */ new Map();
	meshes = /* @__PURE__ */ new Map();
	mat;
	atlas;
	keys = /* @__PURE__ */ new Set();
	qaKeys = null;
	yaw = .35;
	pitch = -.18;
	pos = new Vector3(16.5, 24, 13.5);
	vel = new Vector3();
	grounded = false;
	locked = false;
	running = false;
	last = 0;
	acc = 0;
	highlight = new LineSegments(new EdgesGeometry(new BoxGeometry(1.02, 1.02, 1.02)), new LineBasicMaterial({ color: 15525854 }));
	target = null;
	mobs = [];
	parts = [];
	partGeo = new BoxGeometry(.12, .12, .12);
	hp = 10;
	crystals = 0;
	slot = 4;
	counts = [
		0,
		0,
		0,
		24,
		48,
		16,
		16,
		8,
		16
	];
	msg = "Click the world to look around";
	raf = 0;
	canvas;
	onHud;
	touch = {
		lx: 0,
		ly: 0,
		active: false
	};
	disposeFns = [];
	sfx = new Sfx();
	stepT = 0;
	lastCX = 999;
	lastCZ = 999;
	look = new Vector3();
	tmp = new Vector3();
	lights = [];
	constructor(canvas, onHud) {
		this.canvas = canvas;
		this.onHud = onHud;
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false
		});
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
		this.renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
		this.renderer.setClearColor(659996, 1);
		this.scene = new Scene();
		this.scene.fog = new FogExp2(659996, .016);
		this.camera = new PerspectiveCamera(72, 1, .08, 180);
		this.scene.add(this.highlight);
	}
	async start() {
		const tex = await new TextureLoader().loadAsync("/game/atlas.png");
		tex.magFilter = NearestFilter;
		tex.minFilter = NearestFilter;
		tex.colorSpace = SRGBColorSpace;
		this.atlas = tex;
		this.mat = new MeshLambertMaterial({
			map: tex,
			vertexColors: true,
			alphaTest: .2,
			transparent: false
		});
		this.scene.add(new HemisphereLight(12113134, 3817524, .95));
		const sun = new DirectionalLight(16770756, 1.15);
		sun.position.set(40, 70, 18);
		this.scene.add(sun);
		this.addStars();
		this.addPlanet();
		this.streamChunks(1, 0);
		const h = heightAt(16, 13);
		this.pos.set(16.5, h + 2.1, 13.5);
		this.spawnMobs();
		this.placeLamps();
		const onResize = () => this.resize();
		window.addEventListener("resize", onResize);
		this.disposeFns.push(() => window.removeEventListener("resize", onResize));
		this.bindInput();
		this.resize();
		this.running = true;
		this.last = performance.now();
		this.loop = this.loop.bind(this);
		this.raf = requestAnimationFrame(this.loop);
		window.__controlsTest = {
			getYaw: () => this.yaw,
			getSpeed: () => Math.hypot(this.vel.x, this.vel.z),
			setSteer: (v) => {
				this.yaw += v * .08;
			},
			setKeys: (codes) => {
				this.qaKeys = codes;
			}
		};
	}
	destroy() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.disposeFns.forEach((f) => f());
		this.meshes.forEach((m) => {
			m.geometry.dispose();
			this.scene.remove(m);
		});
		this.mobs.forEach((m) => this.scene.remove(m.mesh));
		this.parts.forEach((p) => this.scene.remove(p.m));
		this.partGeo.dispose();
		this.mat?.dispose();
		this.atlas?.dispose();
		this.renderer.dispose();
		delete window.__controlsTest;
	}
	setTouch(lx, ly, active) {
		this.touch = {
			lx,
			ly,
			active
		};
	}
	jump() {
		if (this.grounded) {
			this.vel.y = JUMP;
			this.grounded = false;
		}
	}
	pickSlot(i) {
		this.slot = Math.max(0, Math.min(8, i));
	}
	addStars() {
		const n = 1600;
		const pos = new Float32Array(n * 3);
		for (let i = 0; i < n; i++) {
			const r = 70 + Math.random() * 90;
			const t = Math.random() * Math.PI;
			const p = Math.random() * Math.PI * 2;
			pos[i * 3] = r * Math.sin(t) * Math.cos(p);
			pos[i * 3 + 1] = r * Math.cos(t) * .55 + 18;
			pos[i * 3 + 2] = r * Math.sin(t) * Math.sin(p);
		}
		const g = new BufferGeometry();
		g.setAttribute("position", new BufferAttribute(pos, 3));
		this.scene.add(new Points(g, new PointsMaterial({
			color: 16777215,
			size: .18
		})));
	}
	addPlanet() {
		const earth = new Mesh(new SphereGeometry(7, 28, 18), new MeshBasicMaterial({ color: 3829413 }));
		earth.position.set(-48, 36, -72);
		this.scene.add(earth);
		const atmo = new Mesh(new SphereGeometry(7.7, 28, 18), new MeshBasicMaterial({
			color: 8308991,
			transparent: true,
			opacity: .16
		}));
		atmo.position.copy(earth.position);
		this.scene.add(atmo);
		const moon = new Mesh(new SphereGeometry(2.2, 16, 12), new MeshBasicMaterial({ color: 13157044 }));
		moon.position.set(50, 42, -40);
		this.scene.add(moon);
	}
	getChunk(cx, cz) {
		const k = ck(cx, cz);
		let d = this.world.get(k);
		if (!d) {
			d = genChunk(cx, cz);
			this.world.set(k, d);
		}
		return d;
	}
	getBlock(x, y, z) {
		if (y < 0 || y >= 40) return 0;
		const cx = Math.floor(x / 16);
		const cz = Math.floor(z / 16);
		const d = this.world.get(ck(cx, cz));
		if (!d) return 0;
		return d[idx((x % 16 + 16) % 16, y, (z % 16 + 16) % 16)];
	}
	setBlock(x, y, z, id) {
		if (y < 1 || y >= 39) return;
		const cx = Math.floor(x / 16);
		const cz = Math.floor(z / 16);
		const lx = (x % 16 + 16) % 16;
		const lz = (z % 16 + 16) % 16;
		const d = this.getChunk(cx, cz);
		d[idx(lx, y, lz)] = id;
		this.rebuildChunk(cx, cz);
		if (lx === 0) this.rebuildChunk(cx - 1, cz);
		if (lx === 15) this.rebuildChunk(cx + 1, cz);
		if (lz === 0) this.rebuildChunk(cx, cz - 1);
		if (lz === 15) this.rebuildChunk(cx, cz + 1);
	}
	streamChunks(pcx, pcz) {
		this.lastCX = pcx;
		this.lastCZ = pcz;
		const keep = /* @__PURE__ */ new Set();
		for (let cz = pcz - 4; cz <= pcz + 4; cz++) for (let cx = pcx - 4; cx <= pcx + 4; cx++) {
			keep.add(ck(cx, cz));
			this.getChunk(cx, cz);
			if (!this.meshes.has(ck(cx, cz))) this.rebuildChunk(cx, cz);
		}
		for (const [k, m] of this.meshes) {
			if (keep.has(k)) continue;
			m.geometry.dispose();
			this.scene.remove(m);
			this.meshes.delete(k);
		}
	}
	rebuildChunk(cx, cz) {
		const k = ck(cx, cz);
		const old = this.meshes.get(k);
		if (old) {
			old.geometry.dispose();
			this.scene.remove(old);
			this.meshes.delete(k);
		}
		const data = this.getChunk(cx, cz);
		const pos = [];
		const nrm = [];
		const uv = [];
		const col = [];
		const faces = [
			[
				0,
				1,
				0
			],
			[
				0,
				-1,
				0
			],
			[
				0,
				0,
				1
			],
			[
				0,
				0,
				-1
			],
			[
				1,
				0,
				0
			],
			[
				-1,
				0,
				0
			]
		];
		for (let z = 0; z < 16; z++) for (let y = 0; y < 40; y++) for (let x = 0; x < 16; x++) {
			const id = data[idx(x, y, z)];
			if (!id) continue;
			const wx = cx * 16 + x;
			const wz = cz * 16 + z;
			for (const [nx, ny, nz] of faces) {
				const nid = this.getBlock(wx + nx, y + ny, wz + nz);
				if (isOpaque(nid)) continue;
				if (nid === id && (id === 9 || id === 8)) continue;
				const tile = tileFor(id, nx, ny, nz);
				this.emitFace(pos, nrm, uv, col, wx, y, wz, nx, ny, nz, tile, id);
			}
		}
		if (!pos.length) return;
		const geo = new BufferGeometry();
		geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
		geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
		geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
		geo.setAttribute("color", new Float32BufferAttribute(col, 3));
		const mesh = new Mesh(geo, this.mat);
		this.scene.add(mesh);
		this.meshes.set(k, mesh);
	}
	ao(x, y, z, nx, ny, nz, corner) {
		const [cx, cy, cz] = corner;
		const side1 = isOpaque(this.getBlock(x + nx + (ny || nz ? cx : 0), y + ny + (nx ? cy : 0), z + nz + (nx || ny ? cz : 0))) ? 1 : 0;
		const side2 = isOpaque(this.getBlock(x + nx + (ny ? 0 : cx), y + ny + (nz ? cy : 0), z + nz + (ny ? cz : 0))) ? 1 : 0;
		const cornerB = isOpaque(this.getBlock(x + (nx || cx), y + (ny || cy), z + (nz || cz))) ? 1 : 0;
		return 1 - (side1 && side2 ? 3 : side1 + side2 + cornerB) * .2;
	}
	emitFace(pos, nrm, uv, col, x, y, z, nx, ny, nz, tile, id) {
		let corners;
		if (ny === 1) corners = [
			[
				x,
				y + 1,
				z
			],
			[
				x,
				y + 1,
				z + 1
			],
			[
				x + 1,
				y + 1,
				z + 1
			],
			[
				x + 1,
				y + 1,
				z
			]
		];
		else if (ny === -1) corners = [
			[
				x,
				y,
				z + 1
			],
			[
				x,
				y,
				z
			],
			[
				x + 1,
				y,
				z
			],
			[
				x + 1,
				y,
				z + 1
			]
		];
		else if (nz === 1) corners = [
			[
				x,
				y,
				z + 1
			],
			[
				x + 1,
				y,
				z + 1
			],
			[
				x + 1,
				y + 1,
				z + 1
			],
			[
				x,
				y + 1,
				z + 1
			]
		];
		else if (nz === -1) corners = [
			[
				x + 1,
				y,
				z
			],
			[
				x,
				y,
				z
			],
			[
				x,
				y + 1,
				z
			],
			[
				x + 1,
				y + 1,
				z
			]
		];
		else if (nx === 1) corners = [
			[
				x + 1,
				y,
				z + 1
			],
			[
				x + 1,
				y,
				z
			],
			[
				x + 1,
				y + 1,
				z
			],
			[
				x + 1,
				y + 1,
				z + 1
			]
		];
		else corners = [
			[
				x,
				y,
				z
			],
			[
				x,
				y,
				z + 1
			],
			[
				x,
				y + 1,
				z + 1
			],
			[
				x,
				y + 1,
				z
			]
		];
		const colI = tile % 16;
		const row = Math.floor(tile / 16);
		const pad = .002;
		const u0 = colI / 16 + pad;
		const u1 = (colI + 1) / 16 - pad;
		const v0 = 1 - (row + 1) / 2 + pad;
		const v1 = 1 - row / 2 - pad;
		const uvs = [
			[u0, v0],
			[u1, v0],
			[u1, v1],
			[u0, v1]
		];
		const shade = FACE_SHADE[`${nx},${ny},${nz}`] ?? .8;
		const glow = id === 10 || id === 18 || id === 11 ? .25 : 0;
		const idx = [[
			0,
			1,
			2
		], [
			0,
			2,
			3
		]];
		const aoC = corners.map((c) => {
			const ox = c[0] === x ? -1 : 1;
			const oy = c[1] === y ? -1 : 1;
			const oz = c[2] === z ? -1 : 1;
			return this.ao(x, y, z, nx, ny, nz, [
				ox,
				oy,
				oz
			]);
		});
		for (const tri of idx) for (const i of tri) {
			pos.push(corners[i][0], corners[i][1], corners[i][2]);
			nrm.push(nx, ny, nz);
			uv.push(uvs[i][0], uvs[i][1]);
			const s = Math.min(1, shade * aoC[i] + glow);
			col.push(s, s, s);
		}
	}
	placeLamps() {
		for (const [x, y, z] of [
			[
				8,
				24,
				5
			],
			[
				24,
				24,
				5
			],
			[
				16,
				24,
				12
			],
			[
				26,
				24,
				20
			],
			[
				33,
				30,
				4
			]
		]) {
			const l = new PointLight(16767130, 2.4, 14);
			l.position.set(x + .5, y + .5, z + .5);
			this.scene.add(l);
			this.lights.push(l);
		}
	}
	mobSprite(kind) {
		const c = document.createElement("canvas");
		c.width = 64;
		c.height = 128;
		const g = c.getContext("2d");
		g.imageSmoothingEnabled = false;
		const scale = 4;
		const p = (x, y, w, h, color) => {
			g.fillStyle = color;
			g.fillRect(x * scale, y * scale, w * scale, h * scale);
		};
		if (kind === "zombie") {
			p(4, 0, 8, 8, "#4a5664");
			p(5, 3, 6, 4, "#28e0d0");
			p(6, 4, 1, 2, "#ff5032");
			p(9, 4, 1, 2, "#ff5032");
			p(4, 8, 8, 12, "#3a4450");
			p(4, 11, 8, 2, "#ff6a3d");
			p(2, 8, 2, 12, "#3a4450");
			p(12, 8, 2, 12, "#3a4450");
			p(4, 20, 3, 12, "#323a44");
			p(9, 20, 3, 12, "#323a44");
		} else if (kind === "creeper") {
			p(4, 2, 8, 8, "#161e34");
			p(5, 4, 2, 2, "#50ffe0");
			p(9, 4, 2, 2, "#50ffe0");
			p(6, 7, 4, 2, "#50ffe0");
			p(4, 10, 8, 12, "#161e34");
			p(6, 14, 4, 4, "#50ffe0");
			p(4, 22, 3, 8, "#101628");
			p(9, 22, 3, 8, "#101628");
		} else if (kind === "skeleton") {
			p(4, 0, 8, 8, "#dce4e8");
			p(5, 3, 6, 3, "#50ffe0");
			p(6, 4, 1, 1, "#111");
			p(9, 4, 1, 1, "#111");
			p(5, 8, 6, 12, "#c8d0d4");
			p(3, 8, 2, 12, "#dce4e8");
			p(11, 8, 2, 12, "#dce4e8");
			p(5, 20, 2, 12, "#dce4e8");
			p(9, 20, 2, 12, "#dce4e8");
		} else {
			p(2, 10, 12, 8, "#1c1638");
			p(4, 4, 8, 8, "#1c1638");
			p(5, 6, 2, 2, "#c050ff");
			p(9, 6, 2, 2, "#c050ff");
			p(0, 14, 16, 3, "#241c48");
		}
		const tex = new CanvasTexture(c);
		tex.magFilter = NearestFilter;
		tex.minFilter = NearestFilter;
		const mat = new SpriteMaterial({
			map: tex,
			transparent: true
		});
		const spr = new Sprite(mat);
		spr.scale.set(kind === "spider" ? 1.4 : 1, kind === "spider" ? 1.1 : 2, 1);
		return spr;
	}
	spawnMobs() {
		const kinds = [
			"zombie",
			"zombie",
			"zombie",
			"zombie",
			"zombie",
			"zombie",
			"creeper",
			"creeper",
			"creeper",
			"skeleton",
			"skeleton",
			"skeleton",
			"spider",
			"spider"
		];
		kinds.forEach((kind, i) => {
			const a = i / kinds.length * Math.PI * 2;
			const r = 18 + i % 5 * 3;
			const x = 16 + Math.cos(a) * r;
			const z = 12 + Math.sin(a) * r;
			const y = heightAt(Math.floor(x), Math.floor(z)) + 1;
			const mesh = this.mobSprite(kind);
			mesh.position.set(x, y + (kind === "spider" ? .4 : 1), z);
			this.scene.add(mesh);
			this.mobs.push({
				kind,
				mesh,
				x,
				y,
				z,
				hp: kind === "creeper" ? 6 : 10,
				hurt: 0
			});
		});
	}
	bindInput() {
		const down = (e) => {
			this.keys.add(e.code);
			if ([
				"KeyW",
				"KeyA",
				"KeyS",
				"KeyD",
				"Space"
			].includes(e.code)) e.preventDefault();
			const d = e.code.match(/^Digit([1-9])$/);
			if (d) this.slot = Number(d[1]) - 1;
			if (e.code === "KeyE") this.msg = "Hotbar is the whole kit — 1 to 9 to switch";
		};
		const up = (e) => this.keys.delete(e.code);
		const move = (e) => {
			if (!this.locked) return;
			this.yaw -= e.movementX * .0022;
			this.pitch -= e.movementY * .0022;
			this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
		};
		const click = (e) => {
			this.sfx.unlock();
			if (!this.locked) {
				this.canvas.requestPointerLock();
				return;
			}
			if (e.button === 0) {
				if (!this.hitMob()) this.breakBlock();
			}
			if (e.button === 2) this.placeBlock();
		};
		const lock = () => {
			this.locked = document.pointerLockElement === this.canvas;
			this.msg = this.locked ? "LMB mine · RMB place · 1–9 hotbar · Shift sprint" : "Click the world to look around";
		};
		const ctx = (e) => e.preventDefault();
		const blur = () => this.keys.clear();
		const wheel = (e) => {
			if (!this.locked) return;
			this.slot = (this.slot + (e.deltaY > 0 ? 1 : -1) + 9) % 9;
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("mousemove", move);
		this.canvas.addEventListener("mousedown", click);
		document.addEventListener("pointerlockchange", lock);
		this.canvas.addEventListener("contextmenu", ctx);
		window.addEventListener("blur", blur);
		window.addEventListener("wheel", wheel, { passive: true });
		this.disposeFns.push(() => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("mousemove", move);
			this.canvas.removeEventListener("mousedown", click);
			document.removeEventListener("pointerlockchange", lock);
			this.canvas.removeEventListener("contextmenu", ctx);
			window.removeEventListener("blur", blur);
			window.removeEventListener("wheel", wheel);
		});
	}
	held(code) {
		if (this.qaKeys) return this.qaKeys.includes(code);
		return this.keys.has(code);
	}
	loop(now) {
		if (!this.running) return;
		let dt = (now - this.last) / 1e3;
		this.last = now;
		dt = Math.min(dt, .1);
		this.acc += dt;
		const step = 1 / 60;
		while (this.acc >= step) {
			this.simulate(step);
			this.acc -= step;
		}
		this.camera.position.set(this.pos.x, this.pos.y + EYE, this.pos.z);
		const cy = Math.cos(this.yaw);
		const sy = Math.sin(this.yaw);
		const cp = Math.cos(this.pitch);
		const sp = Math.sin(this.pitch);
		this.look.set(this.pos.x - sy * cp, this.pos.y + EYE + sp, this.pos.z - cy * cp);
		this.camera.lookAt(this.look);
		this.updateTarget();
		this.tickParticles(dt);
		this.renderer.render(this.scene, this.camera);
		this.onHud?.({
			hp: this.hp,
			crystals: this.crystals,
			slot: this.slot,
			counts: this.counts,
			grounded: this.grounded,
			msg: this.msg,
			locked: this.locked
		});
		this.raf = requestAnimationFrame(this.loop);
	}
	simulate(dt) {
		const fx = -Math.sin(this.yaw);
		const fz = -Math.cos(this.yaw);
		const rx = Math.cos(this.yaw);
		const rz = -Math.sin(this.yaw);
		let mx = 0;
		let mz = 0;
		if (this.held("KeyW") || this.held("ArrowUp")) {
			mx += fx;
			mz += fz;
		}
		if (this.held("KeyS") || this.held("ArrowDown")) {
			mx -= fx;
			mz -= fz;
		}
		if (this.held("KeyA") || this.held("ArrowLeft")) {
			mx -= rx;
			mz -= rz;
		}
		if (this.held("KeyD") || this.held("ArrowRight")) {
			mx += rx;
			mz += rz;
		}
		if (this.touch.active) {
			mx += fx * -this.touch.ly + -rx * this.touch.lx;
			mz += fz * -this.touch.ly + -rz * this.touch.lx;
		}
		const len = Math.hypot(mx, mz);
		if (len > 0) {
			mx /= len;
			mz /= len;
		}
		const sprint = this.held("ShiftLeft") || this.held("ShiftRight");
		const spd = sprint ? SPRINT : SPEED;
		this.vel.x = mx * spd;
		this.vel.z = mz * spd;
		this.vel.y -= GRAVITY * dt;
		if ((this.held("Space") || this.held("KeyQ")) && this.grounded) {
			this.vel.y = JUMP;
			this.grounded = false;
		}
		this.moveAxis(this.vel.x * dt, 0, 0);
		this.moveAxis(0, this.vel.y * dt, 0);
		this.moveAxis(0, 0, this.vel.z * dt);
		if (this.grounded && len > 0) {
			this.stepT += dt;
			if (this.stepT > (sprint ? .28 : .4)) {
				this.stepT = 0;
				this.sfx.step();
			}
		}
		const cx = Math.floor(this.pos.x / 16);
		const cz = Math.floor(this.pos.z / 16);
		if (cx !== this.lastCX || cz !== this.lastCZ) this.streamChunks(cx, cz);
		this.tickMobs(dt);
	}
	moveAxis(dx, dy, dz) {
		this.pos.x += dx;
		this.pos.y += dy;
		this.pos.z += dz;
		const minX = this.pos.x - HW;
		const maxX = this.pos.x + HW;
		const minY = this.pos.y;
		const maxY = this.pos.y + HH;
		const minZ = this.pos.z - HW;
		const maxZ = this.pos.z + HW;
		const x0 = Math.floor(minX);
		const x1 = Math.floor(maxX);
		const y0 = Math.floor(minY);
		const y1 = Math.floor(maxY);
		const z0 = Math.floor(minZ);
		const z1 = Math.floor(maxZ);
		this.grounded = dy < 0 ? false : this.grounded;
		for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
			if (!isSolid(this.getBlock(x, y, z))) continue;
			if (dx > 0) this.pos.x = x - HW - .001;
			if (dx < 0) this.pos.x = x + 1 + HW + .001;
			if (dz > 0) this.pos.z = z - HW - .001;
			if (dz < 0) this.pos.z = z + 1 + HW + .001;
			if (dy > 0) {
				this.pos.y = y - HH - .001;
				this.vel.y = 0;
			}
			if (dy < 0) {
				this.pos.y = y + 1;
				this.vel.y = 0;
				this.grounded = true;
			}
		}
		if (this.pos.y < 1) {
			this.pos.y = 1;
			this.vel.y = 0;
			this.grounded = true;
		}
	}
	tickMobs(dt) {
		for (const e of this.mobs) {
			if (e.hp <= 0) {
				e.mesh.visible = false;
				continue;
			}
			e.hurt = Math.max(0, e.hurt - dt);
			const dx = this.pos.x - e.x;
			const dz = this.pos.z - e.z;
			const d = Math.hypot(dx, dz) || 1;
			const speed = e.kind === "spider" ? 2.2 : e.kind === "creeper" ? 1.5 : 1.8;
			if (d < 22 && d > 1.1) {
				e.x += dx / d * speed * dt;
				e.z += dz / d * speed * dt;
			}
			e.y = heightAt(Math.floor(e.x), Math.floor(e.z)) + 1;
			const lift = e.kind === "spider" ? .45 : 1;
			e.mesh.position.set(e.x, e.y + lift, e.z);
			if (d < 1.25) {
				this.hp = Math.max(0, this.hp - dt * 1.1);
				this.msg = this.hp <= 0 ? "Suit breach — respawning" : "Crew contact";
				if (this.hp <= 0) this.reboot();
			}
		}
	}
	hitMob() {
		const dir = this.tmp.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
		let best = null;
		let bestT = 4;
		for (const e of this.mobs) {
			if (e.hp <= 0) continue;
			const t = new Vector3(e.x, e.y + 1, e.z).sub(this.camera.position).dot(dir);
			if (t < .2 || t > bestT) continue;
			if (this.camera.position.clone().addScaledVector(dir, t).distanceTo(new Vector3(e.x, e.y + 1, e.z)) < .7) {
				best = e;
				bestT = t;
			}
		}
		if (!best) return false;
		best.hp -= 4;
		best.hurt = .2;
		this.burst(best.x, best.y + 1, best.z, 4120784);
		this.sfx.hurt();
		if (best.hp <= 0) {
			best.mesh.visible = false;
			this.crystals += 1;
			this.msg = `${best.kind === "zombie" ? "Astro undead" : best.kind} down`;
		}
		return true;
	}
	reboot() {
		this.sfx.hurt();
		this.hp = 10;
		const h = heightAt(16, 13);
		this.pos.set(16.5, h + 2.1, 13.5);
		this.vel.set(0, 0, 0);
		this.msg = "Respirator cycled. Back at the well.";
	}
	updateTarget() {
		const dir = this.tmp.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
		const hit = this.ray(this.camera.position, dir, 6);
		this.target = hit;
		if (hit) {
			this.highlight.visible = true;
			this.highlight.position.set(hit.x + .5, hit.y + .5, hit.z + .5);
		} else this.highlight.visible = false;
	}
	ray(origin, dir, max) {
		let x = Math.floor(origin.x);
		let y = Math.floor(origin.y);
		let z = Math.floor(origin.z);
		const stepX = dir.x > 0 ? 1 : -1;
		const stepY = dir.y > 0 ? 1 : -1;
		const stepZ = dir.z > 0 ? 1 : -1;
		const tDeltaX = Math.abs(1 / (dir.x || 1e-8));
		const tDeltaY = Math.abs(1 / (dir.y || 1e-8));
		const tDeltaZ = Math.abs(1 / (dir.z || 1e-8));
		let tMaxX = (dir.x > 0 ? x + 1 - origin.x : origin.x - x) * tDeltaX;
		let tMaxY = (dir.y > 0 ? y + 1 - origin.y : origin.y - y) * tDeltaY;
		let tMaxZ = (dir.z > 0 ? z + 1 - origin.z : origin.z - z) * tDeltaZ;
		let nx = 0, ny = 0, nz = 0;
		let t = 0;
		while (t <= max) {
			if (isSolid(this.getBlock(x, y, z))) return {
				x,
				y,
				z,
				nx,
				ny,
				nz
			};
			if (tMaxX < tMaxY) {
				if (tMaxX < tMaxZ) {
					x += stepX;
					t = tMaxX;
					tMaxX += tDeltaX;
					nx = -stepX;
					ny = 0;
					nz = 0;
				} else {
					z += stepZ;
					t = tMaxZ;
					tMaxZ += tDeltaZ;
					nx = 0;
					ny = 0;
					nz = -stepZ;
				}
			} else if (tMaxY < tMaxZ) {
				y += stepY;
				t = tMaxY;
				tMaxY += tDeltaY;
				nx = 0;
				ny = -stepY;
				nz = 0;
			} else {
				z += stepZ;
				t = tMaxZ;
				tMaxZ += tDeltaZ;
				nx = 0;
				ny = 0;
				nz = -stepZ;
			}
		}
		return null;
	}
	burst(x, y, z, color) {
		const mat = new MeshBasicMaterial({ color });
		for (let i = 0; i < 10; i++) {
			const m = new Mesh(this.partGeo, mat.clone());
			m.position.set(x + .5, y + .5, z + .5);
			this.scene.add(m);
			this.parts.push({
				m,
				vx: (Math.random() - .5) * 4,
				vy: Math.random() * 3 + 1,
				vz: (Math.random() - .5) * 4,
				life: .45
			});
		}
	}
	tickParticles(dt) {
		for (let i = this.parts.length - 1; i >= 0; i--) {
			const p = this.parts[i];
			p.life -= dt;
			p.vy -= 12 * dt;
			p.m.position.x += p.vx * dt;
			p.m.position.y += p.vy * dt;
			p.m.position.z += p.vz * dt;
			if (p.life <= 0) {
				this.scene.remove(p.m);
				p.m.material.dispose();
				this.parts.splice(i, 1);
			}
		}
	}
	breakBlock() {
		if (!this.target) return;
		const id = this.getBlock(this.target.x, this.target.y, this.target.z);
		if (id === 0) return;
		this.setBlock(this.target.x, this.target.y, this.target.z, 0);
		this.burst(this.target.x, this.target.y, this.target.z, 12892325);
		this.sfx.break();
		if (id === 11 || id === 18 || id === 10) this.crystals += 1;
		const slot = HOTBAR.findIndex((s) => s.id === (id === 1 ? 1 : id));
		if (slot >= 0) this.counts[slot] += 1;
		this.msg = "Block broken";
	}
	placeBlock() {
		if (!this.target) return;
		const x = this.target.x + this.target.nx;
		const y = this.target.y + this.target.ny;
		const z = this.target.z + this.target.nz;
		if (this.overlapsPlayer(x, y, z)) return;
		if (this.counts[this.slot] <= 0) {
			this.msg = "That slot is empty";
			return;
		}
		this.setBlock(x, y, z, HOTBAR[this.slot].id);
		this.counts[this.slot] -= 1;
		this.sfx.place();
		this.msg = `Placed ${HOTBAR[this.slot].name}`;
	}
	overlapsPlayer(x, y, z) {
		return x >= this.pos.x - HW - .2 && x <= this.pos.x + HW + .2 && y >= this.pos.y - .2 && y <= this.pos.y + HH && z >= this.pos.z - HW - .2 && z <= this.pos.z + HW + .2;
	}
	resize() {
		const w = this.canvas.clientWidth || 1;
		const h = this.canvas.clientHeight || 1;
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}
};
var emptyHud = {
	hp: 10,
	crystals: 0,
	slot: 4,
	counts: [
		0,
		0,
		0,
		24,
		48,
		16,
		16,
		8,
		16
	],
	grounded: true,
	msg: "Click the world to look around",
	locked: false
};
function GameCanvas() {
	const ref = (0, import_react.useRef)(null);
	const engine = (0, import_react.useRef)(null);
	const [hud, setHud] = (0, import_react.useState)(emptyHud);
	const stick = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const e = new HeliosEngine(canvas, setHud);
		engine.current = e;
		e.start();
		return () => e.destroy();
	}, []);
	function onStick(ev) {
		const el = stick.current;
		const eng = engine.current;
		if (!el || !eng) return;
		el.setPointerCapture(ev.pointerId);
		const r = el.getBoundingClientRect();
		const lx = (ev.clientX - r.left) / r.width * 2 - 1;
		const ly = (ev.clientY - r.top) / r.height * 2 - 1;
		eng.setTouch(Math.max(-1, Math.min(1, lx)), Math.max(-1, Math.min(1, ly)), true);
	}
	const hearts = Array.from({ length: 10 }, (_, i) => i < Math.ceil(hud.hp));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[100dvh] w-full overflow-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref,
				className: "block h-full w-full touch-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-fg/90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-fg/90" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-4 top-20 max-w-xs rounded-lg border border-line bg-surface/85 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xs tracking-[0.16em] text-primary",
								children: "HELIOS OUTPOST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-dust",
								children: hud.msg
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-xs tabular-nums text-muted",
								children: ["Crystals ", hud.crystals]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-[5.5rem] left-1/2 flex -translate-x-1/2 gap-1 md:bottom-24",
						children: hearts.map((on, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block h-3 w-3 rotate-45 border ${on ? "border-ember bg-ember" : "border-line bg-transparent"}` }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1 rounded-md border border-line bg-bg/80 p-1",
						children: HOTBAR.map((slot, i) => {
							const col = slot.tile % 16;
							const row = Math.floor(slot.tile / 16);
							const selected = hud.slot === i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `pointer-events-auto relative flex size-9 items-center justify-center rounded-sm border md:size-11 ${selected ? "border-fg bg-elevated" : "border-line bg-surface"}`,
								onClick: () => engine.current?.pickSlot(i),
								"aria-label": slot.name,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block size-8",
									style: {
										backgroundImage: "url(/game/atlas.png)",
										backgroundRepeat: "no-repeat",
										imageRendering: "pixelated",
										backgroundSize: `512px 64px`,
										backgroundPosition: `-${col * 32}px -${row * 32}px`
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-0 right-0 pr-0.5 font-mono text-[10px] tabular-nums text-fg",
									children: hud.counts[i]
								})]
							}, slot.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute bottom-20 left-1/2 hidden -translate-x-1/2 text-xs text-muted md:block",
						children: "WASD move · Space jump · Shift sprint · LMB mine · RMB place"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: stick,
				className: "absolute bottom-28 left-4 size-24 rounded-full border border-line bg-surface/70 md:hidden",
				onPointerDown: onStick,
				onPointerMove: onStick,
				onPointerUp: () => engine.current?.setTouch(0, 0, false),
				onPointerCancel: () => engine.current?.setTouch(0, 0, false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute bottom-28 right-4 rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-fg md:hidden",
				onPointerDown: () => engine.current?.jump(),
				children: "Jump"
			})
		]
	});
}
function Play() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			onClick: () => sessionStorage.setItem("helios-gift-open", "1"),
			className: "absolute left-4 top-4 z-10 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/90 px-4 text-sm text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4 text-primary" }), "Gift pack"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCanvas, {})]
	});
}
//#endregion
export { Play as component };
