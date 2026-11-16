import { moonPixels } from "@/lib/moon";

export function Moon() {
  return (
    <div className="moon-art" aria-hidden="true">
      <svg viewBox="0 0 520 440" fill="none" className="moon-orbit">
        <path
          className="orbit-back"
          d="M85 286C17 268 52 181 188 135C305 94 450 106 477 151C497 189 426 258 297 293C207 317 122 314 85 286Z"
        />
        <path
          className="orbit-sketch"
          d="M79 285C31 263 64 190 185 145C305 99 433 104 469 147"
        />
        <g
          transform="translate(110 62) scale(4.15)"
          fill="currentColor"
          shapeRendering="crispEdges"
        >
          {moonPixels.map((p, i) => (
            <path key={i} d={p.d} opacity={p.opacity} />
          ))}
        </g>
        <path
          className="orbit-front"
          d="M48 232C49 296 167 333 309 292C413 263 478 199 478 164"
        />
        <path
          className="sketch-star"
          d="M416 51L420 66L434 70L420 74L416 88L412 74L399 70L412 66Z"
        />
        <path
          className="sketch-star"
          d="M88 134L90 143L100 145L91 148L88 157L85 148L77 146L85 143Z"
        />
        <path
          className="sketch-star"
          d="M411 311l1 7l7 2l-7 2l-2 7l-2-7l-6-2l7-2z"
        />
        <path
          className="sketch-arrow"
          d="M126 363C168 386 224 392 266 374M255 370l13 3l-7 13"
        />
        <path
          className="pixel-star"
          d="M57 338h4v4h-4zM60 335h4v4h-4zM63 338h4v4h-4zM60 342h4v4h-4zM452 244h3v3h-3zM455 241h3v3h-3zM458 244h3v3h-3zM455 247h3v3h-3z"
          fill="currentColor"
        />
        <text x="280" y="383" transform="rotate(-7 280 383)">
          one package at a time.
        </text>
      </svg>
    </div>
  );
}
