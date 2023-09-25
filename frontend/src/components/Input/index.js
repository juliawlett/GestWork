//import Styles from './Input.module.css'

function Input({ className, type, label, placeholder, name, display, value, handleChange }) {//declarar a variavel aq em cima e colcoar dentro da div
    return (

        <div className=''>
            <label className={`form-label w-50 ${display}`} >{label}</label>
            <input
                className={className}
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChange}
            />

        </div>

    )
}

export default Input