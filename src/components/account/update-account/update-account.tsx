import React, { useEffect, useState } from 'react'
import AccountForm, { AccountFormData } from "../account-form/account-form"
import { useAuth } from "@/context/AuthContext"
import { toast } from 'react-toastify'

export default function UpdateAccount() {
    const { user, setUser } = useAuth();
    const [initialData, setInitialData] = useState<Partial<AccountFormData>>();

    useEffect(() => {
        if (user) {
            setInitialData({
                name: user.username,
                email: user.email,
                phone: user.phone,
                state: user.state,
                city: user.city,
            });
        }
    }, [user]);

    return (
        <AccountForm mode="update" initialData={initialData} onSuccess={(updatedUser) => {
            setUser(updatedUser)
            toast.success('Conta atualizada com sucesso!')
        }} />
    )
}
