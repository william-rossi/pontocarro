'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

export default function AuthErrorToastHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('authError') === 'expired') {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.')
    }
  }, [searchParams])

  return null
}
