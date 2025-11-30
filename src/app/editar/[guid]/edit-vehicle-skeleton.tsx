'use client'

import React from 'react'
import styles from './edit-vehicle-skeleton.module.css'

export default function EditVehicleSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.backButtonSkeleton}></div>
            <div className={styles.headerSkeleton}>
                <div className={styles.titleSkeleton}></div>
                <div className={styles.imageUploadSkeleton}></div>
            </div>
            <div className={styles.formSectionSkeleton}>
                <div className={styles.inputGroupSkeleton}>
                    <div className={styles.inputLabelSkeleton}></div>
                    <div className={styles.inputFieldSkeleton}></div>
                </div>
                <div className={styles.inputGroupSkeleton}>
                    <div className={styles.inputLabelSkeleton}></div>
                    <div className={styles.inputFieldSkeleton}></div>
                </div>
                <div className={styles.inputGroupSkeleton}>
                    <div className={styles.inputLabelSkeleton}></div>
                    <div className={styles.inputFieldSkeleton}></div>
                </div>
                <div className={styles.inputGroupSkeleton}>
                    <div className={styles.inputLabelSkeleton}></div>
                    <div className={styles.inputFieldSkeleton}></div>
                </div>
                <div className={styles.inputGroupSkeleton}>
                    <div className={styles.inputLabelSkeleton}></div>
                    <div className={styles.inputFieldSkeleton}></div>
                </div>
            </div>
            <div className={styles.buttonGroupSkeleton}>
                <div className={styles.buttonSkeleton}></div>
                <div className={styles.buttonSkeleton}></div>
            </div>
        </div>
    )
}
