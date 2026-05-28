import styles from './PrincipleCard.module.css';

export function PrincipleCard() {
  return (
    <footer className={styles.section} aria-label={'\u539f\u7406\u8bf4\u660e'}>
      <div className={styles.copy}>
        <h2>{'\u58f0\u97f3\u63a9\u853d\u7684\u539f\u7406'}</h2>
        <p>
          {'\u7528\u7a33\u5b9a\u3001\u67d4\u548c\u7684\u80cc\u666f\u58f0\u964d\u4f4e\u7a81\u5140\u566a\u97f3\u7684\u5b58\u5728\u611f\uff0c\u8ba9\u4f60\u66f4\u5bb9\u6613\u56de\u5230\u4e13\u6ce8\u72b6\u6001\u3002'}
        </p>
      </div>
      <div className={styles.lines} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.privacy}>
        {'Quietly \u4ec5\u5728\u672c\u5730\u5206\u6790\u58f0\u97f3\u7279\u5f81\uff0c\u4e0d\u4fdd\u5b58\u4e5f\u4e0d\u4e0a\u4f20\u97f3\u9891\u3002'}
      </p>
    </footer>
  );
}
