import * as THREE from "three";
import { Sfx } from "./audio";
import {
  AIR,
  ATLAS_H,
  ATLAS_W,
  CRYSTAL,
  FACE_SHADE,
  GLASS,
  GRASS,
  HOTBAR,
  LAMP,
  LEAVES,
  ORE,
  isOpaque,
  isSolid,
  tileFor,
} from "./blocks";
import { CS, VIEW, WORLD_H, genChunk, heightAt, idx as cidx } from "./worldgen";

const GRAVITY = 22;
const JUMP = 8.4;
const SPEED = 4.6;
const SPRINT = 6.2;
const EYE = 1.62;
const HW = 0.3;
const HH = 1.8;

export type HudSnap = {
  hp: number;
  crystals: number;
  slot: number;
  counts: number[];
  grounded: boolean;
  msg: string;
  locked: boolean;
};

type MobKind = "zombie" | "creeper" | "skeleton" | "spider";

type Mob = {
  kind: MobKind;
  mesh: THREE.Object3D;
  x: number;
  y: number;
  z: number;
  hp: number;
  hurt: number;
};

type Particle = { m: THREE.Mesh; vx: number; vy: number; vz: number; life: number };

function ck(cx: number, cz: number) {
  return `${cx},${cz}`;
}

export class HeliosEngine {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  private world = new Map<string, Uint8Array>();
  private meshes = new Map<string, THREE.Mesh>();
  private mat!: THREE.MeshLambertMaterial;
  private atlas!: THREE.Texture;
  private keys = new Set<string>();
  private qaKeys: string[] | null = null;
  private yaw = 0.35;
  private pitch = -0.18;
  pos = new THREE.Vector3(16.5, 24, 13.5);
  private vel = new THREE.Vector3();
  private grounded = false;
  private locked = false;
  private running = false;
  private last = 0;
  private acc = 0;
  private highlight = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02)),
    new THREE.LineBasicMaterial({ color: 0xece7de }),
  );
  private target: { x: number; y: number; z: number; nx: number; ny: number; nz: number } | null =
    null;
  private mobs: Mob[] = [];
  private parts: Particle[] = [];
  private partGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  hp = 10;
  crystals = 0;
  slot = 4;
  counts = [0, 0, 0, 24, 48, 16, 16, 8, 16];
  msg = "Click the world to look around";
  private raf = 0;
  private canvas: HTMLCanvasElement;
  private onHud?: (h: HudSnap) => void;
  private touch = { lx: 0, ly: 0, active: false };
  private disposeFns: Array<() => void> = [];
  private sfx = new Sfx();
  private stepT = 0;
  private lastCX = 999;
  private lastCZ = 999;
  private look = new THREE.Vector3();
  private tmp = new THREE.Vector3();
  private lights: THREE.PointLight[] = [];

  constructor(canvas: HTMLCanvasElement, onHud?: (h: HudSnap) => void) {
    this.canvas = canvas;
    this.onHud = onHud;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
    this.renderer.setClearColor(0x0a121c, 1);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a121c, 0.016);
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.08, 180);
    this.scene.add(this.highlight);
  }

  async start() {
    const tex = await new THREE.TextureLoader().loadAsync("/game/atlas.png");
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.atlas = tex;
    this.mat = new THREE.MeshLambertMaterial({
      map: tex,
      vertexColors: true,
      alphaTest: 0.2,
      transparent: false,
    });
    this.scene.add(new THREE.HemisphereLight(0xb8d4ee, 0x3a4034, 0.95));
    const sun = new THREE.DirectionalLight(0xffe6c4, 1.15);
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
      setSteer: (v: number) => {
        this.yaw += v * 0.08;
      },
      setKeys: (codes: string[]) => {
        this.qaKeys = codes;
      },
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

  setTouch(lx: number, ly: number, active: boolean) {
    this.touch = { lx, ly, active };
  }

  jump() {
    if (this.grounded) {
      this.vel.y = JUMP;
      this.grounded = false;
    }
  }

  pickSlot(i: number) {
    this.slot = Math.max(0, Math.min(8, i));
  }

  private addStars() {
    const n = 1600;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 70 + Math.random() * 90;
      const t = Math.random() * Math.PI;
      const p = Math.random() * Math.PI * 2;
      pos[i * 3] = r * Math.sin(t) * Math.cos(p);
      pos[i * 3 + 1] = r * Math.cos(t) * 0.55 + 18;
      pos[i * 3 + 2] = r * Math.sin(t) * Math.sin(p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18 })));
  }

  private addPlanet() {
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(7, 28, 18),
      new THREE.MeshBasicMaterial({ color: 0x3a6ea5 }),
    );
    earth.position.set(-48, 36, -72);
    this.scene.add(earth);
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(7.7, 28, 18),
      new THREE.MeshBasicMaterial({ color: 0x7ec8ff, transparent: true, opacity: 0.16 }),
    );
    atmo.position.copy(earth.position);
    this.scene.add(atmo);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xc8c2b4 }),
    );
    moon.position.set(50, 42, -40);
    this.scene.add(moon);
  }

  private getChunk(cx: number, cz: number) {
    const k = ck(cx, cz);
    let d = this.world.get(k);
    if (!d) {
      d = genChunk(cx, cz);
      this.world.set(k, d);
    }
    return d;
  }

  getBlock(x: number, y: number, z: number) {
    if (y < 0 || y >= WORLD_H) return AIR;
    const cx = Math.floor(x / CS);
    const cz = Math.floor(z / CS);
    const d = this.world.get(ck(cx, cz));
    if (!d) return AIR;
    const lx = ((x % CS) + CS) % CS;
    const lz = ((z % CS) + CS) % CS;
    return d[cidx(lx, y, lz)];
  }

  setBlock(x: number, y: number, z: number, id: number) {
    if (y < 1 || y >= WORLD_H - 1) return;
    const cx = Math.floor(x / CS);
    const cz = Math.floor(z / CS);
    const lx = ((x % CS) + CS) % CS;
    const lz = ((z % CS) + CS) % CS;
    const d = this.getChunk(cx, cz);
    d[cidx(lx, y, lz)] = id;
    this.rebuildChunk(cx, cz);
    if (lx === 0) this.rebuildChunk(cx - 1, cz);
    if (lx === CS - 1) this.rebuildChunk(cx + 1, cz);
    if (lz === 0) this.rebuildChunk(cx, cz - 1);
    if (lz === CS - 1) this.rebuildChunk(cx, cz + 1);
  }

  private streamChunks(pcx: number, pcz: number) {
    this.lastCX = pcx;
    this.lastCZ = pcz;
    const keep = new Set<string>();
    for (let cz = pcz - VIEW; cz <= pcz + VIEW; cz++) {
      for (let cx = pcx - VIEW; cx <= pcx + VIEW; cx++) {
        keep.add(ck(cx, cz));
        this.getChunk(cx, cz);
        if (!this.meshes.has(ck(cx, cz))) this.rebuildChunk(cx, cz);
      }
    }
    for (const [k, m] of this.meshes) {
      if (keep.has(k)) continue;
      m.geometry.dispose();
      this.scene.remove(m);
      this.meshes.delete(k);
    }
  }

  private rebuildChunk(cx: number, cz: number) {
    const k = ck(cx, cz);
    const old = this.meshes.get(k);
    if (old) {
      old.geometry.dispose();
      this.scene.remove(old);
      this.meshes.delete(k);
    }
    const data = this.getChunk(cx, cz);
    const pos: number[] = [];
    const nrm: number[] = [];
    const uv: number[] = [];
    const col: number[] = [];
    const faces: [number, number, number][] = [
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
      [1, 0, 0],
      [-1, 0, 0],
    ];
    for (let z = 0; z < CS; z++) {
      for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < CS; x++) {
          const id = data[cidx(x, y, z)];
          if (!id) continue;
          const wx = cx * CS + x;
          const wz = cz * CS + z;
          for (const [nx, ny, nz] of faces) {
            const nid = this.getBlock(wx + nx, y + ny, wz + nz);
            if (isOpaque(nid)) continue;
            if (nid === id && (id === GLASS || id === LEAVES)) continue;
            const tile = tileFor(id, nx, ny, nz);
            this.emitFace(pos, nrm, uv, col, wx, y, wz, nx, ny, nz, tile, id);
          }
        }
      }
    }
    if (!pos.length) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const mesh = new THREE.Mesh(geo, this.mat);
    this.scene.add(mesh);
    this.meshes.set(k, mesh);
  }

  private ao(x: number, y: number, z: number, nx: number, ny: number, nz: number, corner: number[]) {
    const [cx, cy, cz] = corner;
    const side1 = isOpaque(this.getBlock(x + nx + (ny || nz ? cx : 0), y + ny + (nx ? cy : 0), z + nz + (nx || ny ? cz : 0)))
      ? 1
      : 0;
    const side2 = isOpaque(this.getBlock(x + nx + (ny ? 0 : cx), y + ny + (nz ? cy : 0), z + nz + (ny ? cz : 0)))
      ? 1
      : 0;
    const cornerB = isOpaque(this.getBlock(x + (nx || cx), y + (ny || cy), z + (nz || cz))) ? 1 : 0;
    const occ = side1 && side2 ? 3 : side1 + side2 + cornerB;
    return 1 - occ * 0.2;
  }

  private emitFace(
    pos: number[],
    nrm: number[],
    uv: number[],
    col: number[],
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    tile: number,
    id: number,
  ) {
    let corners: number[][];
    if (ny === 1)
      corners = [
        [x, y + 1, z],
        [x, y + 1, z + 1],
        [x + 1, y + 1, z + 1],
        [x + 1, y + 1, z],
      ];
    else if (ny === -1)
      corners = [
        [x, y, z + 1],
        [x, y, z],
        [x + 1, y, z],
        [x + 1, y, z + 1],
      ];
    else if (nz === 1)
      corners = [
        [x, y, z + 1],
        [x + 1, y, z + 1],
        [x + 1, y + 1, z + 1],
        [x, y + 1, z + 1],
      ];
    else if (nz === -1)
      corners = [
        [x + 1, y, z],
        [x, y, z],
        [x, y + 1, z],
        [x + 1, y + 1, z],
      ];
    else if (nx === 1)
      corners = [
        [x + 1, y, z + 1],
        [x + 1, y, z],
        [x + 1, y + 1, z],
        [x + 1, y + 1, z + 1],
      ];
    else
      corners = [
        [x, y, z],
        [x, y, z + 1],
        [x, y + 1, z + 1],
        [x, y + 1, z],
      ];
    const colI = tile % ATLAS_W;
    const row = Math.floor(tile / ATLAS_W);
    const pad = 0.002;
    const u0 = colI / ATLAS_W + pad;
    const u1 = (colI + 1) / ATLAS_W - pad;
    const v0 = 1 - (row + 1) / ATLAS_H + pad;
    const v1 = 1 - row / ATLAS_H - pad;
    const uvs = [
      [u0, v0],
      [u1, v0],
      [u1, v1],
      [u0, v1],
    ];
    const shade = FACE_SHADE[`${nx},${ny},${nz}`] ?? 0.8;
    const glow = id === LAMP || id === CRYSTAL || id === ORE ? 0.25 : 0;
    const idx = [
      [0, 1, 2],
      [0, 2, 3],
    ];
    const aoC = corners.map((c) => {
      const ox = c[0] === x ? -1 : 1;
      const oy = c[1] === y ? -1 : 1;
      const oz = c[2] === z ? -1 : 1;
      return this.ao(x, y, z, nx, ny, nz, [ox, oy, oz]);
    });
    for (const tri of idx) {
      for (const i of tri) {
        pos.push(corners[i][0], corners[i][1], corners[i][2]);
        nrm.push(nx, ny, nz);
        uv.push(uvs[i][0], uvs[i][1]);
        const s = Math.min(1, shade * aoC[i] + glow);
        col.push(s, s, s);
      }
    }
  }

  private placeLamps() {
    const spots = [
      [8, 24, 5],
      [24, 24, 5],
      [16, 24, 12],
      [26, 24, 20],
      [33, 30, 4],
    ];
    for (const [x, y, z] of spots) {
      const l = new THREE.PointLight(0xffd89a, 2.4, 14);
      l.position.set(x + 0.5, y + 0.5, z + 0.5);
      this.scene.add(l);
      this.lights.push(l);
    }
  }

  private mobSprite(kind: MobKind) {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 128;
    const g = c.getContext("2d")!;
    g.imageSmoothingEnabled = false;
    const scale = 4;
    const p = (x: number, y: number, w: number, h: number, color: string) => {
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
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(kind === "spider" ? 1.4 : 1, kind === "spider" ? 1.1 : 2, 1);
    return spr;
  }

  private spawnMobs() {
    const kinds: MobKind[] = [
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
      "spider",
    ];
    kinds.forEach((kind, i) => {
      const a = (i / kinds.length) * Math.PI * 2;
      const r = 18 + (i % 5) * 3;
      const x = 16 + Math.cos(a) * r;
      const z = 12 + Math.sin(a) * r;
      const y = heightAt(Math.floor(x), Math.floor(z)) + 1;
      const mesh = this.mobSprite(kind);
      mesh.position.set(x, y + (kind === "spider" ? 0.4 : 1), z);
      this.scene.add(mesh);
      this.mobs.push({ kind, mesh, x, y, z, hp: kind === "creeper" ? 6 : 10, hurt: 0 });
    });
  }

  private bindInput() {
    const down = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) e.preventDefault();
      const d = e.code.match(/^Digit([1-9])$/);
      if (d) this.slot = Number(d[1]) - 1;
      if (e.code === "KeyE") this.msg = "Hotbar is the whole kit — 1 to 9 to switch";
    };
    const up = (e: KeyboardEvent) => this.keys.delete(e.code);
    const move = (e: MouseEvent) => {
      if (!this.locked) return;
      this.yaw -= e.movementX * 0.0022;
      this.pitch -= e.movementY * 0.0022;
      this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
    };
    const click = (e: MouseEvent) => {
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
      this.msg = this.locked
        ? "LMB mine · RMB place · 1–9 hotbar · Shift sprint"
        : "Click the world to look around";
    };
    const ctx = (e: Event) => e.preventDefault();
    const blur = () => this.keys.clear();
    const wheel = (e: WheelEvent) => {
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

  private held(code: string) {
    if (this.qaKeys) return this.qaKeys.includes(code);
    return this.keys.has(code);
  }

  private loop(now: number) {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.1);
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
      locked: this.locked,
    });
    this.raf = requestAnimationFrame(this.loop);
  }

  private simulate(dt: number) {
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
      if (this.stepT > (sprint ? 0.28 : 0.4)) {
        this.stepT = 0;
        this.sfx.step();
      }
    }
    const cx = Math.floor(this.pos.x / CS);
    const cz = Math.floor(this.pos.z / CS);
    if (cx !== this.lastCX || cz !== this.lastCZ) this.streamChunks(cx, cz);
    this.tickMobs(dt);
  }

  private moveAxis(dx: number, dy: number, dz: number) {
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
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        for (let x = x0; x <= x1; x++) {
          if (!isSolid(this.getBlock(x, y, z))) continue;
          if (dx > 0) this.pos.x = x - HW - 0.001;
          if (dx < 0) this.pos.x = x + 1 + HW + 0.001;
          if (dz > 0) this.pos.z = z - HW - 0.001;
          if (dz < 0) this.pos.z = z + 1 + HW + 0.001;
          if (dy > 0) {
            this.pos.y = y - HH - 0.001;
            this.vel.y = 0;
          }
          if (dy < 0) {
            this.pos.y = y + 1;
            this.vel.y = 0;
            this.grounded = true;
          }
        }
      }
    }
    if (this.pos.y < 1) {
      this.pos.y = 1;
      this.vel.y = 0;
      this.grounded = true;
    }
  }

  private tickMobs(dt: number) {
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
        e.x += (dx / d) * speed * dt;
        e.z += (dz / d) * speed * dt;
      }
      e.y = heightAt(Math.floor(e.x), Math.floor(e.z)) + 1;
      const lift = e.kind === "spider" ? 0.45 : 1;
      e.mesh.position.set(e.x, e.y + lift, e.z);
      if (d < 1.25) {
        this.hp = Math.max(0, this.hp - dt * 1.1);
        this.msg = this.hp <= 0 ? "Suit breach — respawning" : "Crew contact";
        if (this.hp <= 0) this.reboot();
      }
    }
  }

  private hitMob() {
    const dir = this.tmp.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    let best: Mob | null = null;
    let bestT = 4;
    for (const e of this.mobs) {
      if (e.hp <= 0) continue;
      const to = new THREE.Vector3(e.x, e.y + 1, e.z).sub(this.camera.position);
      const t = to.dot(dir);
      if (t < 0.2 || t > bestT) continue;
      const closest = this.camera.position.clone().addScaledVector(dir, t);
      if (closest.distanceTo(new THREE.Vector3(e.x, e.y + 1, e.z)) < 0.7) {
        best = e;
        bestT = t;
      }
    }
    if (!best) return false;
    best.hp -= 4;
    best.hurt = 0.2;
    this.burst(best.x, best.y + 1, best.z, 0x3ee0d0);
    this.sfx.hurt();
    if (best.hp <= 0) {
      best.mesh.visible = false;
      this.crystals += 1;
      this.msg = `${best.kind === "zombie" ? "Astro undead" : best.kind} down`;
    }
    return true;
  }

  private reboot() {
    this.sfx.hurt();
    this.hp = 10;
    const h = heightAt(16, 13);
    this.pos.set(16.5, h + 2.1, 13.5);
    this.vel.set(0, 0, 0);
    this.msg = "Respirator cycled. Back at the well.";
  }

  private updateTarget() {
    const dir = this.tmp.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const hit = this.ray(this.camera.position, dir, 6);
    this.target = hit;
    if (hit) {
      this.highlight.visible = true;
      this.highlight.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5);
    } else this.highlight.visible = false;
  }

  private ray(origin: THREE.Vector3, dir: THREE.Vector3, max: number) {
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
    let nx = 0,
      ny = 0,
      nz = 0;
    let t = 0;
    while (t <= max) {
      if (isSolid(this.getBlock(x, y, z))) return { x, y, z, nx, ny, nz };
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

  private burst(x: number, y: number, z: number, color: number) {
    const mat = new THREE.MeshBasicMaterial({ color });
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(this.partGeo, mat.clone());
      m.position.set(x + 0.5, y + 0.5, z + 0.5);
      this.scene.add(m);
      this.parts.push({
        m,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 1,
        vz: (Math.random() - 0.5) * 4,
        life: 0.45,
      });
    }
  }

  private tickParticles(dt: number) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.life -= dt;
      p.vy -= 12 * dt;
      p.m.position.x += p.vx * dt;
      p.m.position.y += p.vy * dt;
      p.m.position.z += p.vz * dt;
      if (p.life <= 0) {
        this.scene.remove(p.m);
        (p.m.material as THREE.Material).dispose();
        this.parts.splice(i, 1);
      }
    }
  }

  private breakBlock() {
    if (!this.target) return;
    const id = this.getBlock(this.target.x, this.target.y, this.target.z);
    if (id === AIR) return;
    this.setBlock(this.target.x, this.target.y, this.target.z, AIR);
    this.burst(this.target.x, this.target.y, this.target.z, 0xc4b8a5);
    this.sfx.break();
    if (id === ORE || id === CRYSTAL || id === LAMP) this.crystals += 1;
    const slot = HOTBAR.findIndex((s) => s.id === (id === GRASS ? GRASS : id));
    if (slot >= 0) this.counts[slot] += 1;
    this.msg = "Block broken";
  }

  private placeBlock() {
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

  private overlapsPlayer(x: number, y: number, z: number) {
    return (
      x >= this.pos.x - HW - 0.2 &&
      x <= this.pos.x + HW + 0.2 &&
      y >= this.pos.y - 0.2 &&
      y <= this.pos.y + HH &&
      z >= this.pos.z - HW - 0.2 &&
      z <= this.pos.z + HW + 0.2
    );
  }

  private resize() {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setSteer?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
    };
  }
}
