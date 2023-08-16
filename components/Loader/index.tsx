
import styles from './css/Loader.module.css';
export default function Loader() {
    return (
        <div className={styles.overlay}>
            <div className={styles.overlay__inner}>
                <div className={styles.overlay__content}>
                    <div className={styles.loader}>
                        <div className={styles.ripple}></div>
                        <img src="/images/logo2.svg" alt="logo" />
                    </div>
                </div>
            </div>
        </div>
    )
}
