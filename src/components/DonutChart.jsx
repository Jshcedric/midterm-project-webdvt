// A dependency-free donut chart built with plain SVG <circle> stroke
// tricks: each slice is a circle drawn with a dashed stroke sized to its
// share of the total, then rotated into position along the ring.
function DonutChart({ data, size = 190, thickness = 26, centerLabel, centerValue }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;

  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="donut-svg">
        {/* Track shown underneath so gaps between slices read cleanly */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--bg)" strokeWidth={thickness} />

        {total > 0 &&
          data.map((d) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const strokeDasharray = `${dash} ${circumference - dash}`;
            const strokeDashoffset = -cumulative;
            cumulative += dash;

            return (
              <circle
                key={d.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${center} ${center})`}
              />
            );
          })}
      </svg>

      <div className="donut-center">
        <span className="donut-center-label">{centerLabel}</span>
        <span className="donut-center-value">{centerValue}</span>
      </div>
    </div>
  );
}

export default DonutChart;
