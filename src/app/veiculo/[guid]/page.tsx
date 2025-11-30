import { getVehicleById } from '@/services/vehicles'
import { cache } from 'react'
import { Metadata } from 'next'
import styles from './styles.module.css'
import ErrorPage from './_error-page/page'
import VehicleBasic from './_vehicle-basic/page'
import Description from './_description/page'
import Specifications from './_specifications/page'
import VehicleCarousel from './_vehicle-carousel/page'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import { Vehicle } from '@/types/vehicles'

// ✅ Cria uma função memoizada — o mesmo request é reutilizado dentro da mesma renderização
const getVehicleCached = cache(async (guid: string) => {
    return await getVehicleById(guid)
})

export async function generateMetadata({ params }: { params: Promise<{ guid: string }> }): Promise<Metadata> {
    const { guid } = await params

    try {
        const vehicle = await getVehicleCached(guid)
        if (!vehicle) return { title: 'Veículo não encontrado | .carro' }

        return {
            title: `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} ${vehicle.engine} ${vehicle.transmission} | .carro`,
            description: vehicle.description?.slice(0, 150) || 'Anúncio de veículo no .carro',
        }
    } catch {
        return { title: 'Erro ao carregar veículo | .carro' }
    }
}

export default async function Veiculo({ params }: { params: Promise<{ guid: string }> }) {
    const { guid } = await params

    try {
        const vehicle = await getVehicleCached(guid)
        if (!vehicle) return <ErrorPage message="Veículo não encontrado." />

        return (
            <section className={styles.container}>
                <BackButtonAnnounce text='Voltar aos anúncios' />
                <div className={styles.content}>
                    <div className={styles.division}>
                        <div className={styles.carousel}>
                            <VehicleCarousel vehicleId={vehicle._id} />
                        </div>
                        <div className={styles.infos}>
                            <VehicleBasic vehicle={vehicle} />
                        </div>
                    </div>
                    <div className={styles.divisor} />
                    <div className={styles.division}>
                        {vehicle.description && (
                            <div className={styles.description}>
                                <Description description={vehicle.description} />
                            </div>
                        )}
                        {vehicle.features && vehicle.features.length > 0 && (
                            <div className={styles.specifications}>
                                <Specifications features={vehicle.features} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    } catch (error: any) {
        return <ErrorPage message={error.message} />
    }
}
