import React from 'react'
import Style from './Container.module.css'
function Container({ children}) {
    return (
        <main className={Style.container}>
            {children}
        </main>
    )
}

export default Container