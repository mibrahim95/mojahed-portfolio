// The exact text the Telegram API builds (see telegramApi ReceiveRequests.java):
// "Name: …\nEmail: …" plus "\nMessage: …" when a message was written.
function Line({ label, value, placeholder }) {
  return (
    <>
      {label}: {value ? value : <span className="is-empty">{placeholder}</span>}
    </>
  );
}

function Chat({ name, email, msg, typing = false }) {
  return (
    <div className="chat" data-ui>
      <p className="chat__meta">Telegram, new message</p>
      <p className={`chat__bubble${typing ? " is-typing" : ""}`}>
        <Line label="Name" value={name} placeholder="your name" />
        {"\n"}
        <Line label="Email" value={email} placeholder="you@example.com" />
        {"\n"}
        <Line label="Message" value={msg} placeholder="what you write here" />
      </p>
    </div>
  );
}

export default Chat;
