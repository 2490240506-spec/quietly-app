import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          <span />
        </span>
        <span className={styles.wordmark}>Quietly</span>
      </div>
      <button className={styles.menuButton} aria-label="打开菜单">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
