export default function Notification({ mensagem }) {

  if (!mensagem) return null;

  return (
    <div className="notification-popup">
      {mensagem}
    </div>
  );
}