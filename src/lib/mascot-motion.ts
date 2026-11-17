import { mascotPaths } from "./mascot";

type Pose = {
  sleep: number;
  leftEar: number;
  rightEar: number;
  lookX: number;
  lookY: number;
};

type Segment = { command: string; points: number[] };

// Keep the original Bezier segments: nearby points move together, so the
// hand-drawn contour bends continuously instead of separating into pieces.
function parsePath(path: string): Segment[] {
  return Array.from(
    path.matchAll(/([MCZ])([^MCZ]*)/g),
    ([, command, values]) => ({
      command,
      points: (values.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number),
    }),
  );
}

const paths = Object.fromEntries(
  Object.entries(mascotPaths).map(([name, path]) => [name, parsePath(path)]),
) as Record<keyof typeof mascotPaths, Segment[]>;

function deformPath(segments: Segment[], pose: Pose) {
  return segments
    .map(({ command, points }) => {
      const moved: string[] = [];
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        const head = Math.max(0, Math.min(1, (710 - y) / 128));
        let dx = pose.lookX * head * 2.2 * (1 - pose.sleep);
        let dy = pose.lookY * head * 1.5 * (1 - pose.sleep);

        for (const [tipX, baseX, angle] of [
          [428, 435, pose.leftEar],
          [546, 529, pose.rightEar],
        ]) {
          const weight = Math.exp(
            -(((x - tipX) / 38) ** 2 + ((y - 586) / 43) ** 2),
          );
          const theta = angle * weight;
          dx +=
            (x - baseX) * (Math.cos(theta) - 1) - (y - 638) * Math.sin(theta);
          dy +=
            (x - baseX) * Math.sin(theta) + (y - 638) * (Math.cos(theta) - 1);
        }
        moved.push((x + dx).toFixed(2), (y + dy).toFixed(2));
      }
      return command + moved.join(" ");
    })
    .join(" ");
}

function flick(elapsed: number, duration = 720) {
  const t = elapsed / duration;
  return t < 0 || t > 1 ? 0 : Math.sin(t * Math.PI * 3) * Math.sin(t * Math.PI);
}

export function createMascotMotion(root: HTMLElement) {
  const outline = root.querySelector<SVGPathElement>(".mascot-outline")!;
  const eyes = root.querySelectorAll<SVGPathElement>(".mascot-eye");
  let active = false;
  let frame = 0;
  let lastFrame = 0;
  let clock = 0;
  let nextEar = 0;
  let leftEarAt = -Infinity;
  let rightEarAt = -Infinity;
  let targetSleep = 0;
  let sleep = 0;
  let targetX = 0;
  let targetY = 0;
  let lookX = 0;
  let lookY = 0;

  function draw(pose: Pose) {
    outline.setAttribute("d", deformPath(paths.outline, pose));
    eyes[0].setAttribute("d", deformPath(paths.leftEye, pose));
    eyes[1].setAttribute("d", deformPath(paths.rightEye, pose));
  }

  function tick(now: number) {
    if (!active) return;
    frame = requestAnimationFrame(tick);
    if (now - lastFrame < 1000 / 30) return;
    const dt = Math.min(now - lastFrame, 64);
    clock += dt;
    lastFrame = now;
    const settle = 1 - Math.exp(-dt / 180);
    lookX += (targetX - lookX) * settle;
    lookY += (targetY - lookY) * settle;
    sleep += (targetSleep - sleep) * (1 - Math.exp(-dt / 900));
    const sleeping = targetSleep >= 0.95;
    if (clock >= nextEar && (targetSleep < 0.1 || sleeping)) {
      if (Math.random() > 0.5) leftEarAt = clock;
      else rightEarAt = clock;
      nextEar = clock + (sleeping ? 5200 : 3600) + Math.random() * 4200;
    }
    const earStrength = 1 - sleep * 0.68;
    const earDuration = sleeping ? 1100 : 720;
    draw({
      sleep,
      leftEar: -0.16 * flick(clock - leftEarAt, earDuration) * earStrength,
      rightEar: 0.18 * flick(clock - rightEarAt, earDuration) * earStrength,
      lookX,
      lookY,
    });
  }

  return {
    setActive(next: boolean) {
      if (active === next) return;
      active = next;
      cancelAnimationFrame(frame);
      if (active) {
        clock = 0;
        lastFrame = performance.now();
        leftEarAt = rightEarAt = -Infinity;
        nextEar = 2400;
        frame = requestAnimationFrame(tick);
      } else {
        lookX = lookY = targetX = targetY = 0;
        sleep = targetSleep = 0;
        outline.setAttribute("d", mascotPaths.outline);
        eyes[0].setAttribute("d", mascotPaths.leftEye);
        eyes[1].setAttribute("d", mascotPaths.rightEye);
      }
    },
    look(x: number, y: number) {
      targetX = x;
      targetY = y;
    },
    sleep(amount: number) {
      if (targetSleep > 0 && amount === 0) nextEar = clock + 1800;
      if (targetSleep < 0.95 && amount >= 0.95) nextEar = clock + 1800;
      targetSleep = amount;
    },
    perk() {
      if (!active) return;
      leftEarAt = clock;
      rightEarAt = clock + 160;
      nextEar = clock + 5000;
    },
  };
}
