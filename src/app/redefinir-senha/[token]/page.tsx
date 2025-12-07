'use client'

import { useParams } from 'next/navigation';
import React from 'react'

export default function RedefinirSenha() {
    const params = useParams();
    const { token } = params;

    return (
        <div>RedefinirSenha</div>
    )
}
