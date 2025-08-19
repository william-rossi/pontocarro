import React from 'react'

interface Props {
    children: React.ReactNode
    quantity: number
}

/** Multiplica os elementos filhos. */
export default function CreateElements(props: Props) {
    return (
        <>
            {
                Array.from({ length: props.quantity }, (_, i) => i + 1).map((index) => (
                    <React.Fragment key={index}>
                        {props.children}
                    </React.Fragment>
                ))
            }
        </>
    )
}
