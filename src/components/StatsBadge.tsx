interface StatsBadgeProps {
    label: string;
    value: number;
    color?: string;
}

function StatsBadge({ label, value, color = "#2563eb" }: StatsBadgeProps) {

   return (
    <div
        style={{
            border: `2px solid ${color}`,
            borderRadius: "10px",
            padding: "16px",
            width: "180px",
            textAlign: "center"
        }}
    >
        <h2 style={{ color, margin: 0 }}>
            {value}
        </h2>

        <p
            style={{
            marginTop: "10px",
            color: "#64748b",
            fontSize: "14px",
            }}
        >
            {label}
        </p>
    </div>
);

}

export default StatsBadge;