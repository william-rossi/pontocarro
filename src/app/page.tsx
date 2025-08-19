import Image from "next/image";
import styles from "./page.module.css";
import Vehicles from "@/components/vehicles/vehicles";

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.titleArea}>
        <h1>Encontre o Veículo Perfeito</h1>
        <p>Descubra veículos incríveis de vendedores confiáveis na sua região</p>
      </section>
      <Vehicles />
    </div>
  )
}
