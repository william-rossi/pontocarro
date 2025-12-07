import React from 'react';
import styles from './styles.module.css';
import Button from '@/components/button/button';
import Link from 'next/link';
import { VehicleSummary } from '@/types/vehicles';
import { API_BASE_URL } from '@/constants/secrets';
import Image from 'next/image';
import { formatMileage } from '@/services/utils';

interface UserVehicleCardProps {
    vehicle: VehicleSummary;
    onDelete: (vehicleId: string) => void;
}

const UserVehicleCard: React.FC<UserVehicleCardProps> = ({ vehicle, onDelete }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageArea}>
                <img
                    src={`${API_BASE_URL}${vehicle.firstImageUrl}`}
                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                />
            </div>
            <div className={styles.infoArea}>
                <div className={styles.titleArea}>
                    <h3 className={styles.title}>{vehicle.year} {vehicle.brand} {vehicle.vehicleModel} {vehicle.engine}</h3>
                    <span className={styles.price}>R$ {vehicle.price.toLocaleString('pt-BR')}</span>
                </div>
                <div className={styles.subInfo}>
                    <div className={styles.city}>
                        <Image src={'/assets/svg/location.svg'} width={17} height={17} alt='' />
                        <span>{`${vehicle.city}, ${vehicle.state}`}</span>
                    </div>
                    {
                        vehicle.created_at &&
                        <div className={styles.dateArea}>
                            <Image src={'/assets/svg/location.svg'} width={17} height={17} alt='' />
                            <span className={styles.date}>Publicado em {new Date(vehicle.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                    }
                </div>
                <div className={styles.details}>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/speedometer.svg'} width={17} height={17} alt='' />
                        <span>{formatMileage(vehicle.mileage)} km</span>
                    </div>
                    <div className={styles.resource}>
                        <div className={`${styles.dot} ${styles.green}`} />
                        <span>{vehicle.fuel}</span>
                    </div>
                    <div className={styles.resource}>
                        <div className={`${styles.dot} ${styles.red}`} />
                        <span>{vehicle.transmission}</span>
                    </div>
                    <div className={styles.resource}>
                        <div className={`${styles.dot} ${styles.purple}`} />
                        <span>{vehicle.bodyType}</span>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Link href={`/veiculo/${vehicle._id}`} passHref>
                        <Button
                            className={styles.btnGoToVehicle}
                            text="Visualizar"
                            svg="/assets/svg/eye.svg"
                            iconSize={18}
                        />
                    </Link>
                    <Link href={`/editar/${vehicle._id}`} passHref>
                        <Button
                            className={styles.edit} text="Editar"
                            svg="/assets/svg/edit.svg"
                            iconSize={18}
                        />
                    </Link>
                    <Button
                        className={styles.delete}
                        text="Excluir"
                        svg="/assets/svg/trash.svg"
                        onClick={() => onDelete(vehicle._id)}
                        iconSize={18}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserVehicleCard;
