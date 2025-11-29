import React from 'react';
import styles from './styles.module.css';

const UserVehicleCardSkeleton: React.FC = () => {
    return (
        <div className={styles.cardSkeleton}>
            <div className={styles.imageSkeleton} />
            <div className={styles.infoSkeleton}>
                <div className={styles.titleSkeleton} />
                <div className={styles.locationSkeleton} />
                <div className={styles.detailsSkeleton}>
                    <div className={styles.detailItemSkeleton} />
                    <div className={styles.detailItemSkeleton} />
                    <div className={styles.detailItemSkeleton} />
                    <div className={styles.detailItemSkeleton} />
                </div>
                <div className={styles.actionsSkeleton}>
                    <div className={styles.actionButtonSkeleton} />
                    <div className={styles.actionButtonSkeleton} />
                    <div className={styles.actionButtonSkeleton} />
                </div>
            </div>
            <div className={styles.priceSkeleton}>
                <div className={styles.priceTextSkeleton} />
                <div className={styles.dateTextSkeleton} />
            </div>
        </div>
    );
};

export default UserVehicleCardSkeleton;
