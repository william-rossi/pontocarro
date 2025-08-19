'use client'

import React from 'react'
import styles from './styles.module.css'
import Button from '@/components/button/button'

export default function ContactButton() {

    return (
        <Button text='Entrar em contato' onClick={() => null} className={styles.btn} />
    )
}
