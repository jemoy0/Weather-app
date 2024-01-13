import "./index.css"

export const InfoRow = ({label, value}) => {
    return (
        <div className="infoRow">
            <span className="label">{label}</span><span className="value">{value}</span>
        </div>
    )
}