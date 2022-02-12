import React, {ChangeEvent} from "react";

type Props = {
    title: string,
    name: string,
    handleChange: (e : ChangeEvent<HTMLTextAreaElement>) => void,
    rows: number
    value: string
    className?: string,
    errorDiv?: string,
    errorMsg?: string
}

const TextArea = (props : Props) => {
    return (
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            <textarea className={`form-control ${props.className}`}
                      id={props.name} name={props.name} value={props.value}
                      onChange={props.handleChange} rows={props.rows}
            />
            <div className={props.errorDiv}>{props.errorMsg}</div>
        </div>
    )
}

export default TextArea