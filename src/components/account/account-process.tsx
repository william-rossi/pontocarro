import React, { useState } from 'react'
import styles from './styles.module.css'
import Login from './login/login'
import CreateAccount from './create-account/create-account'

export type AccountProcessType = 'login' | 'createAccount' | 'forgotPassword'

export default function AccountProcess() {
    const [moveTo, setMoveTo] = useState<AccountProcessType>('login')

    const renderUI = () => {
        if (moveTo === 'login')
            return <Login moveTo={setMoveTo} />

        if (moveTo === 'createAccount')
            return <CreateAccount moveTo={setMoveTo} />

        return <></>
    }

    return (
        <div className={styles.container}>
            {renderUI()}
        </div>
    )
}
