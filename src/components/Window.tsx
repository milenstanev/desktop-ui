import React, {useState} from 'react';
import styles from './Window.module.css';

interface WindowProps {
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ children }) => {
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);

  return (
    <div
      style={{ left: `${clientX}px`, top: `${clientY}px` }}
      className={styles.window}
      draggable={true}
      onDrag={(event) => {
        const dragEvent = event as React.DragEvent<HTMLDivElement>;
        console.log(dragEvent.nativeEvent);
        if (dragEvent.clientX > 0 && dragEvent.clientY > 0) {
          setClientX(dragEvent.clientX);
          setClientY(dragEvent.clientY);
        }
      }}>
      {children}
    </div>
  )
}

export default Window;
