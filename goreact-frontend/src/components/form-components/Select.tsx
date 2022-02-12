import React, {ChangeEvent} from "react";
import {Option} from "../../interfaces/Interfaces";

type Props = {
    name: string,
    value: string,
    handleChange: (e:ChangeEvent<HTMLSelectElement>) => void,
    placeholder: string,
    title: string,
    options: Option[],
    className?: string,
    errorDiv?: string,
    errorMsg?: string
}



const Select = (props: Props) => {
    return (
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">
                {" "}
                {props.title}{" "}
            </label>
            <select
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                className={`form-control ${props.className}`}>

                <option value="">{props.placeholder}</option>
                {props.options.map(option => (
                    <option className="form-select"
                            key={option.id}
                            value={option.value}
                            label={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>
            <div className={props.errorDiv}>{props.errorMsg}</div>
        </div>
    )
}

export default Select