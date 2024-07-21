import React, {useState} from 'react';
import { useAppDispatch } from '../app/hooks';
import { removeWindow } from '../features/Desktop/DesktopSlice';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  name?: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
   id,
   name,
   children
}) => {
  const dispatch = useAppDispatch();
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
      <header className={styles.header}>
        {name}
        <div>
          <button className="drag-handle">
            Drag here
          </button>
          <button
            onClick={() => dispatch(removeWindow(id))}
          >
            Remove
          </button>
        </div>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}

export default Window;
