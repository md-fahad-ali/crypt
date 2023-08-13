import React, { useState, useEffect } from "react";
import styles from "../../styles/modal.module.css";

const Modal = ({ children, isOpen, toggle, closebtnShow }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Set isBrowser to true on the client-side
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    // Don't render anything on the server-side
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalMain}>
      <div className={styles.clsBtn} style={{ display: closebtnShow }}>
        <button onClick={toggle}>&#10005;</button>
      </div>
      <div className={styles.modalContent}>{children}</div>
    </div>
  );
};

export default Modal;
