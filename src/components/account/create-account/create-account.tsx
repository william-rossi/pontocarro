"use client"

import React from "react"
import { AccountProcessType } from "../account-process"
import AccountForm from "../account-form/account-form"

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function CreateAccount({ moveTo }: Props) {
    return <AccountForm mode="create" moveTo={moveTo} />
}
