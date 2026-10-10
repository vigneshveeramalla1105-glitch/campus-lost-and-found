export default function MapArtwork() {
  return (
    <div className="map-artwork" role="img" aria-label="Illustrated map of the campus">
      <svg viewBox="0 0 720 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="720" height="460" fill="#e8e9e7" />
        <path d="M0 58 111 26 180 100 142 191 0 208ZM287 0 440 0 485 80 426 144 301 113ZM563 25 720 0 720 135 628 179 550 118ZM0 310 94 281 177 349 128 460 0 460ZM250 262 356 240 418 327 364 460 235 432ZM499 220 610 191 720 240 720 360 601 400 497 340Z" fill="#d3d7d4" stroke="#fff" strokeWidth="8" />
        <path d="M0 216 92 185 158 221 141 284 21 310ZM204 133 276 107 318 157 300 229 218 248ZM398 148 491 131 532 191 481 251 398 221ZM136 18 234 0 275 62 224 130 154 112ZM410 354 477 311 550 350 540 460 425 460Z" fill="#dcebd6" />
        <path d="M-40 202C120 168 186 212 302 198S531 113 761 171" fill="none" stroke="#8ac9d7" strokeWidth="30" />
        <path d="M-40 202C120 168 186 212 302 198S531 113 761 171" fill="none" stroke="#c7e9ee" strokeWidth="3" strokeDasharray="5 11" />
        <path d="M-10 81 745 309M54 -20 223 484M380 -20 250 480M734 68 102 492M-25 371 742 119M-22 279 750 393M196 -30 475 495M520 -32 360 485" fill="none" stroke="#fff" strokeWidth="11" />
        <path d="M-10 81 745 309M54 -20 223 484M380 -20 250 480M734 68 102 492M-25 371 742 119M-22 279 750 393M196 -30 475 495M520 -32 360 485" fill="none" stroke="#cdd2cf" strokeWidth="1.5" />
        <path d="M15 151 712 355M147 -15 408 478M-15 420 727 41" fill="none" stroke="#f8f9f7" strokeWidth="4" />
        <g fill="#899997" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="1.2"><text x="82" y="156" transform="rotate(17 82 156)">LIBRARY ROAD</text><text x="429" y="340" transform="rotate(-17 429 340)">CAMPUS WALK</text><text x="282" y="82" transform="rotate(74 282 82)">NORTH AVENUE</text><text x="560" y="215" transform="rotate(14 560 215)">STUDENT CENTRE</text></g>
      </svg>
      <span className="map-park-tag">CAMPUS GREEN</span>
      <span className="map-marker"><i /></span>
      <span className="map-scale"><i /> Approximate campus location</span>
    </div>
  );
}
