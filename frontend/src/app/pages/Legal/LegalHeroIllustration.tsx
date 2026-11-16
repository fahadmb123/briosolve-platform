interface LegalHeroIllustrationProps {
  src?: string;
  alt?: string;
}

export default function LegalHeroIllustration({
  src,
  alt = "Illustration"
}: LegalHeroIllustrationProps = {}) {
  if (src) {
    return (
      <div className="legal-hero-illustration">
        <img src={src} alt={alt} className="legal-illustration-img" />
      </div>
    );
  }

  return (
    <div className="legal-hero-illustration">
      <svg
        viewBox="0 0 420 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="legal-illustration-svg"
      >
        <g className="illust-character">
          <path
            d="M260 115 C260 128 268 138 280 138 C292 138 300 128 300 115 Z"
            fill="#FFEAD9"
            stroke="#180D00"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          <path
            d="M255 105 C255 85 270 70 290 70 C310 70 325 85 325 105 C325 125 310 135 290 135 C270 135 255 125 255 105 Z"
            fill="#FFEAD9"
            stroke="#180D00"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          <path
            d="M252 100 C250 82 262 65 285 64 C305 63 325 72 328 92 C330 96 322 96 318 92 C312 85 304 82 292 84 C278 86 270 95 268 104 C266 108 254 108 252 100 Z"
            fill="#180D00"
          />

          <path
            d="M245 92 C242 80 252 68 266 65 C280 62 292 68 290 76 C276 74 262 78 256 86 C250 94 246 98 245 92 Z"
            fill="#180D00"
          />

          <circle cx="288" cy="104" r="2.5" fill="#180D00" />
          <path
            d="M280 118 Q288 123 294 118"
            stroke="#180D00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            d="M170 320 C185 230 220 155 280 150 C340 145 385 200 415 320 Z"
            fill="#FF7900"
            stroke="#180D00"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          <path
            d="M250 150 L280 178 L310 150"
            fill="#FFFFFF"
            stroke="#180D00"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          <line
            x1="280"
            y1="178"
            x2="280"
            y2="320"
            stroke="#180D00"
            strokeWidth="3.5"
            strokeDasharray="8 6"
          />

          <line
            x1="180"
            y1="270"
            x2="235"
            y2="310"
            stroke="#180D00"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <g className="illust-hand-lens">
            <line
              x1="325"
              y1="135"
              x2="355"
              y2="280"
              stroke="#FFE642"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <line
              x1="325"
              y1="135"
              x2="355"
              y2="280"
              stroke="#180D00"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <line
              x1="325"
              y1="135"
              x2="355"
              y2="280"
              stroke="#FFE642"
              strokeWidth="12"
              strokeLinecap="round"
            />

            <circle
              cx="315"
              cy="115"
              r="34"
              fill="#EBF5FB"
              fillOpacity="0.85"
              stroke="#180D00"
              strokeWidth="5"
            />
            <circle
              cx="315"
              cy="115"
              r="28"
              fill="none"
              stroke="#FFE642"
              strokeWidth="3"
              strokeOpacity="0.6"
            />

            <path
              d="M302 96 A22 22 0 0 1 330 98"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <circle cx="316" cy="114" r="5" fill="#FF7900" />
            <circle cx="314" cy="112" r="1.5" fill="#FFFFFF" />

            <path
              d="M342 165 C336 165 330 170 330 178 C330 186 338 190 348 190 L380 190 C392 190 400 182 400 172 C400 162 390 156 378 156 L342 156 Z"
              fill="#FFEAD9"
              stroke="#180D00"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M340 188 C334 188 328 193 328 200 C328 207 335 212 344 212 L384 212 C395 212 402 205 402 197 C402 189 393 184 382 184 L340 184 Z"
              fill="#FFEAD9"
              stroke="#180D00"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M342 210 C336 210 330 215 330 222 C330 229 337 234 346 234 L386 234 C397 234 404 227 404 219 C404 211 395 206 384 206 L342 206 Z"
              fill="#FFEAD9"
              stroke="#180D00"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M345 232 C340 232 334 237 334 244 C334 251 341 256 350 256 L388 256 C399 256 406 249 406 241 C406 233 397 228 386 228 L345 228 Z"
              fill="#FFEAD9"
              stroke="#180D00"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M375 256 C382 270 395 295 405 320"
              stroke="#180D00"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
