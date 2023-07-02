import styles from './Button.module.css';

export const Button = ({ onClick }) => {
  return (
    <div className={styles.btnContainer}>
      <button onClick={onClick} type="button" className={styles.Button}>
        Load more
      </button>
    </div>
  );
};
