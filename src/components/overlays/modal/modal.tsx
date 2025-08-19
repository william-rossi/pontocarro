"use client"

import { useCallback, useRef, useEffect, MouseEventHandler, useState, useLayoutEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import styles from './styles.module.css'
import animation from './animation.module.css'
import ReactDOM from "react-dom"
import Image from "next/image"

type Animation = 'fade' | 'pop' | 'scale' | false
type BackButtonTheme = 'primary' | 'inverted'
type BackgroundHeadTheme = 'primary' | 'inverted'

interface HeadProps {
  /** ID do elemento que quando desaparecer da tela, ativa barra superior. */
  elToObserveId?: string
  /** Força o head para aparecer mesmo sem ID */
  forceEnableHead?: boolean
  /** Título da barra superior se ativa. */
  headTitle?: string
  /** Cor do background da barra superior ativa no scroll */
  backgroundHeadTheme?: BackgroundHeadTheme
}

interface Options {
  /** Duração da animação do modal. Ex: .2s */
  animationDuration?: string
  /** Tipo de animação a ser aplicada. */
  animation?: Animation
  /** Habilita o botão de fechar no topo do modal. */
  enableCloseButton?: boolean
  /** Tema do botão de fechar. */
  closeButtonTheme?: BackButtonTheme
  canClickOnOverlayToClose?: boolean
  headProps?: HeadProps
  hasLoadedContent?: boolean
}

interface BaseProps {
  children: React.ReactNode
  /** Se o modal tem uma rota para ser interceptada. */
  isInterceptRouting: boolean
  options?: Options
  className?: string
}

interface InterceptRoutingTrueProps extends BaseProps {
  isInterceptRouting: true
  onClose?: never
  isOpen?: never
}

interface InterceptRoutingFalseProps extends BaseProps {
  isInterceptRouting: false
  onClose: () => void
  isOpen: boolean
}

type Props = InterceptRoutingTrueProps | InterceptRoutingFalseProps

/** Modal centralizado na página. */
export default function Modal(props: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [animationClass, setAnimationClass] = useState("")
  const [bgAnimationClass, setBgAnimationClass] = useState("")
  const [showHead, setShowHead] = useState(false)

  const canClickOnOverlayToClose = props.options?.canClickOnOverlayToClose ?? true

  const previousPathnameRef = useRef<string | null>(null)
  const overlay = useRef(null)
  const wrapper = useRef<HTMLDivElement | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  const onDismiss = useCallback(async (ignoreRouteBack: boolean = false) => {
    handleCloseAnimation()
    setTimeout(() => {
      setIsVisible(false)
      if (!ignoreRouteBack) {
        if (props.isInterceptRouting) router.back()
        else props.onClose()
      }
    }, animationDuration() * 1000)
  }, [router, props])

  const onClick: MouseEventHandler = (e) => {
    if (e.target === overlay.current && canClickOnOverlayToClose) onDismiss()
  }

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onDismiss()
  }, [onDismiss])

  const animationDuration = () => {
    const duration = props.options?.animationDuration?.replace("s", "")
    return duration ? parseFloat(duration) : 0.1
  }

  const handleStyle = (): React.CSSProperties => ({
    animationDuration: `${props.options?.animationDuration || '0.15s'}`
  })

  const handleOpenAnimation = () => {
    setBgAnimationClass(animation.show)
    switch (props.options?.animation) {
      case 'fade':
        setAnimationClass(animation.fadeIn)
        break
      case 'scale':
        setAnimationClass(animation.scaleIn)
        break
      default:
        setAnimationClass(animation.popIn)
        break
    }
  }

  const handleCloseAnimation = () => {
    setBgAnimationClass(animation.hide)
    setAnimationClass(
      animation[`${props.options?.animation}Out`] || animation.popOut
    )
  }

  useLayoutEffect(() => {
    if (props.isOpen || props.isInterceptRouting) {
      setIsVisible(true)
      handleOpenAnimation()
      document.addEventListener("keydown", onKeyDown)
      return () => document.removeEventListener("keydown", onKeyDown)
    }
  }, [props.isOpen, props.isInterceptRouting, onKeyDown])

  useEffect(() => {
    if (previousPathnameRef.current && previousPathnameRef.current !== pathname)
      onDismiss()
    previousPathnameRef.current = pathname
  }, [pathname, onDismiss])

  useEffect(() => {
    const handlePopState = () => onDismiss(true)
    window.addEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const observeHead = () => {
      if (props.options?.headProps?.forceEnableHead) {
        setShowHead(true)
      }
      else if (props.options?.headProps?.elToObserveId) {
        const id = props.options.headProps.elToObserveId.replace(/^#/, "")
        const head = document.getElementById(id)

        const observer = new IntersectionObserver(
          entries => setShowHead(!entries[entries.length - 1]?.isIntersecting),
          {
            threshold: 0
          }
        )

        head && observer.observe(head)
        return () => head && observer.unobserve(head)
      }
    }

    observeHead()

    if (!props.options?.hasLoadedContent) {
      setTimeout(() => {
        observeHead()
      }, 150)
    }
  }, [props.options?.headProps, props.options?.hasLoadedContent])

  useEffect(() => {
    setTimeout(() => {
      if (isVisible && wrapper.current) {
        const element = wrapper.current

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'data-dismiss' &&
              element.getAttribute('data-dismiss') === 'true'
            ) {
              onDismiss()
            }
          })
        })

        observer.observe(element, {
          attributes: true,
          attributeFilter: ['data-dismiss'],
        })

        return () => observer.disconnect()
      }
    }, 1);
  }, [isVisible, onDismiss])

  if (!isVisible) return null

  if (typeof document === 'undefined')
    return <></>

  return ReactDOM.createPortal(
    <div ref={overlay} className={`${styles.background} ${bgAnimationClass}`} onClick={onClick}>
      <div
        ref={wrapper}
        className={`${styles.container} ${props.className ?? ""} ${animationClass} generic-modal generic-modal-center`}
        data-dismiss='false'
        style={handleStyle()}
      >
        <div className={styles.head}>
          <h3 className={styles.headTitle}>{props.options?.headProps?.headTitle}</h3>
          <Image className={styles.closeBtn} src={'/assets/svg/close.svg'} alt="close" onClick={() => onDismiss()} width={37} height={37} />
        </div>
        {props.children}
      </div>
    </div>,
    document.body
  )
}