import { useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/**
 * Built on the native <dialog>: focus trapping, Esc to close and the
 * backdrop come from the browser. Give the heading id="modal-title".
 */
export function Modal({ onClose, children }: { onClose: () => void; children: ComponentChildren }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      class="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close(); // backdrop click
      }}
    >
      <div class="modal-body">
        <button class="modal-close" aria-label="Close" onClick={() => ref.current?.close()}>
          ×
        </button>
        {children}
      </div>
    </dialog>
  );
}
