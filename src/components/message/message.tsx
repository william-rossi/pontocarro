import React from 'react'
import styles from './styles.module.css'

interface Props {
  message?: string
  type: 'success' | 'info' | 'error'
}

const _message = 'Não foi possível concluir a operação.'

export default function Message({ message = _message, type }: Props) {
  return (
    <p className={`${styles.container} ${styles[type]}`}>
      {message}
    </p>
  )
}
