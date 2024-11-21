export default function DialogButton({ 
  dialogId, 
  title,
  children,
  closeButtonId,
  state
}: { 
  dialogId: string, 
  title: string,
  children: React.ReactNode;
  closeButtonId: string
  state?: 'error'
}) {
  return (
    <>
      <button 
        className={`
          btn 
          ${state === 'error' ? 'btn-error' : 'btn-primary'}
        `}
        onClick={() => 
          // @ts-expect-error showmodal
          document.getElementById(dialogId)!.showModal()
        }>
          {title}
      </button>

      <dialog id={dialogId} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button 
              id={closeButtonId} 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
