'use client'

import React, { useState } from 'react'
import styles from './styles.module.css'
import Button from '@/components/button/button'
import Modal from '@/components/overlays/modal/modal'
import { Vehicle } from '@/types/vehicles'
import Image from 'next/image'
import { formatPhoneNumber } from '@/utils/phone-helpers'

interface Props {
    vehicle: Vehicle
}

export default function ContactButton({ vehicle }: Props) {
    const [isModal, setIsModal] = useState(false)

    const generateMessageText = (contactType: 'whatsapp' | 'email') => {
        const vehicleInfo = `${vehicle.year} ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.transmission} ${vehicle.engine}`
        let message = `Olá, ${vehicle.announcerName}! Encontrei o anúncio do seu veículo ${vehicleInfo} no site .CARRO e gostaria de obter mais informações sobre a disponibilidade e as condições de venda.`
        if (contactType === 'email') {
            message += `\n\nPor favor, entre em contato.`;
        }
        return message;
    }

    const handleWhatsAppClick = () => {
        const phoneNumber = vehicle.announcerPhone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(generateMessageText('whatsapp'));
        const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Função para abrir o cliente de e-mail (mailto)
    const handleEmailClick = () => {
        const email = vehicle.announcerEmail;
        const subject = encodeURIComponent(`Interesse no veículo: ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.transmission} ${vehicle.engine} - ${vehicle.year}`);
        const body = encodeURIComponent(generateMessageText('email'));
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
    }

    return (
        <>
            {
                isModal &&
                <Modal
                    onClose={() => setIsModal(false)}
                    isOpen={isModal}
                    isInterceptRouting={false}
                    options={{ animation: 'fade', headProps: { headTitle: 'Entrar em contato' } }}
                >
                    <div className={styles.contactArea}>
                        <h3>Envie uma mensagem para o vendedor do(a) <b>{vehicle.year} {vehicle.brand} {vehicle.vehicleModel} {vehicle.transmission} {vehicle.engine}</b> e feche negócio!</h3>
                        <div className={styles.infoArea}>
                            <h5>Informações do vendedor</h5>
                            <div className={styles.resource}>
                                <Image src={'/assets/svg/user.svg'} width={17} height={17} alt='' />
                                <span>{vehicle.announcerName}</span>
                            </div>
                            <div className={styles.resource}>
                                <Image src={'/assets/svg/email.svg'} width={17} height={17} alt='' />
                                <span>{vehicle.announcerEmail}</span>
                            </div>
                            <div className={styles.resource}>
                                <Image src={'/assets/svg/phone.svg'} width={17} height={17} alt='' />
                                <span>{formatPhoneNumber(vehicle.announcerPhone)}</span>
                            </div>
                        </div>
                        <div className={styles.contactBtns}>
                            <Button
                                svg='/assets/svg/email.svg'
                                text='Enviar e-mail'
                                iconSize={20}
                                invert
                                onClick={handleEmailClick}
                            />
                            <Button
                                className={styles.whatsAppBtn}
                                svg='/assets/svg/whatsapp-white.svg'
                                iconSize={20}
                                text='Enviar WhatsApp'
                                onClick={handleWhatsAppClick}
                            />
                        </div>
                    </div>
                </Modal>
            }
            <Button text='Entrar em contato' onClick={() => setIsModal(true)} className={styles.btn} />
        </>
    )
}
