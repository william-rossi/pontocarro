/** Classe para manipulação dos modais _Bottom sheet_, _Drawer_ e modal padrão. */
export class Overlay {
    /** Observa se há modais _generic-modal_ presentes no HTML para manipular o scroll da página. */
    static startWatch() {
        const styleElement = document.createElement('style')
        styleElement.textContent = `
            .cancel-scroll {
                overflow: hidden
            }
            .add-right-padding {
                padding-right: var(--scrollbar-width)
            }
            .head-modal-hidden {
                display: none;
            }`
        document.head.appendChild(styleElement)

        const updateBodyClasses = () => {
            const modals = document.querySelectorAll('.generic-modal')

            const anyModalVisible = Array.from(modals).some(modal => {
                const rect = modal.getBoundingClientRect()
                return rect.width > 0 && rect.height > 0
            })

            if (anyModalVisible) {
                if ((window.innerWidth > window.innerHeight) && (document.body.scrollHeight > window.innerHeight)) {
                    document.body.classList.add('add-right-padding')
                }
                document.body.classList.add('cancel-scroll')

                const modalsLength = Array.from(modals).length
                const heads = document.querySelectorAll('.head-modal')

                if (modalsLength > 1 && (heads && heads.length > 0)) {
                    heads[heads.length - 1].classList.add('head-modal-hidden')
                }
                else {
                    if (heads && heads.length > 0)
                        heads[heads.length - 1].classList.remove('head-modal-hidden')
                }
            } else {
                document.body.classList.remove('add-right-padding')
                document.body.classList.remove('cancel-scroll')
            }
        }

        const mutationObserver = new MutationObserver(() => {
            updateBodyClasses()
        })

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })

        updateBodyClasses()

        return () => {
            mutationObserver.disconnect()
            document.head.removeChild(styleElement)
        }
    }

    /** Fecha o último modal aberto no HTML. */
    static dismiss() {
        const modals = document.querySelectorAll('.generic-modal[data-dismiss="false"]')

        if (modals && modals[modals.length - 1])
            modals[modals.length - 1].setAttribute('data-dismiss', 'true')
        else
            this.dismissAll()
    }

    /** Fecha todos os modais abertos no HTML. */
    static dismissAll() {
        const modals = document.querySelectorAll('.generic-modal[data-dismiss="false"]')
        if (modals) {
            modals.forEach(modal => {
                modal.setAttribute('data-dismiss', 'true')
            })
        }
    }

    /** Utilizado em conjunto com *openWithQs* para que ao clicar no botão de voltar do browser, feche o modal corretamente. */
    static startPopstateListener(close: () => void) {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault()
            close()
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }
}
