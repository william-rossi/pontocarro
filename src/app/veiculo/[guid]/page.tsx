import { getVehicleById } from '@/services/vehicles'
import { cache } from 'react'
import { Metadata } from 'next'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import Description from '@/components/vehicle-details/description/description'
import ErrorPage from '@/components/vehicle-details/error-page/error-page'
import Specifications from '@/components/vehicle-details/specifications/specifications'
import VehicleBasic from '@/components/vehicle-details/vehicle-basic/vehicle-basic'
import VehicleCarousel from '@/components/vehicle-details/vehicle-carousel/vehicle-carousel'
// Cria uma função memoizada: o mesmo request é reutilizado dentro da mesma renderização
const getVehicleCached = cache(async (guid: string) => {
    return await getVehicleById(guid)
})

export async function generateMetadata({ params }: { params: Promise<{ guid: string }> }): Promise<Metadata> {
    const { guid } = await params

    try {
        const vehicle = await getVehicleCached(guid)
        if (!vehicle) return { title: 'Veículo não encontrado | .CARRO' }

        return {
            title: `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} ${vehicle.engine} ${vehicle.transmission} | .CARRO`,
            description: vehicle.description?.slice(0, 150) || 'Anúncio de veículo no .CARRO',
        }
    } catch {
        return { title: 'Erro ao carregar veículo | .CARRO' }
    }
}

export default async function Veiculo({ params }: { params: Promise<{ guid: string }> }) {
    const { guid } = await params

    try {
        const vehicle = await getVehicleCached(guid)
        if (!vehicle) return <ErrorPage message="Veículo não encontrado." />

        return (
            <section className={styles.container}>
                <BackButtonAnnounce destination='/' />
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
    } catch (error: unknown) {
        return <ErrorPage message={(error instanceof Error) ? error.message : "An unexpected error occurred."} />
    }
}
