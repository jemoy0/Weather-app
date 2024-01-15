import "./index.css"

export const SmInfoRow = ({label, value}) => {
    return (
        <div className="infoRow">
            <span className="label">{label}</span><span className="value">{value}</span>
        </div>
    )
}