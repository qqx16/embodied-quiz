export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>取消</button>
          <button className="btn btn-primary" onClick={onConfirm}>确认</button>
        </div>
      </div>
    </div>
  )
}
