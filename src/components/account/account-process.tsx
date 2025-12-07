import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Login from './login/login'
import CreateAccount from './create-account/create-account'
import UpdateAccount from './update-account/update-account'
import { useAuth } from '@/context/AuthContext'
import ForgotPassword from './forgot-password/forgot-password'

export type AccountProcessType = 'login' | 'createAccount' | 'updateAccount' | 'forgotPassword'

interface Props {
    accountProccessType?: AccountProcessType
    setHeaderLabel(e: string): void
}

export default function AccountProcess(props: Props) {
    const { user } = useAuth();
    const [moveTo, setMoveTo] = useState<AccountProcessType>(!user ? 'login' : props.accountProccessType ?? 'login')

    const renderUI = () => {
        if (moveTo === 'login')
            return <Login moveTo={setMoveTo} />

        if (moveTo === 'createAccount')
            return <CreateAccount moveTo={setMoveTo} />

        if (moveTo === 'updateAccount')
            return <UpdateAccount />

        if (moveTo === 'forgotPassword')
            return <ForgotPassword moveTo={setMoveTo} />

        return <></>
    }

    useEffect(() => {
        switch (moveTo) {
            case 'login':
                props.setHeaderLabel('Entrar na sua conta')
                break;
            case 'createAccount':
                props.setHeaderLabel('Crie sua conta')
                break;
            case 'updateAccount':
                props.setHeaderLabel('Atualize sua conta')
                break;
            case 'forgotPassword':
                props.setHeaderLabel('Esqueci a senha')
                break;
            default:
                props.setHeaderLabel('')
                break;
        }
    }, [moveTo])

    return (
        <div className={styles.container}>
            {renderUI()}
        </div>
    )
}
