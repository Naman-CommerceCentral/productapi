import ReactDOM from "react-dom/client";
import styles from "./Button.module.css";

function Button({ children, onclick }) {
  return (
    <button className={styles.button} onClick={onclick}>
      {children}
    </button>
  );
}

export default Button;
