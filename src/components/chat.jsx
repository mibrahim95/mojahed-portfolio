// Live preview of the message the contact function sends (netlify/functions/contact.js):
// "Name: …\nEmail: …\nMessage: …". `provider` picks the look: "telegram" or "slack".
function Line({ label, value, placeholder }) {
  return (
    <>
      {label}: {value ? value : <span className="is-empty">{placeholder}</span>}
    </>
  );
}

function Body({ name, email, msg }) {
  return (
    <>
      <Line label="Name" value={name} placeholder="your name" />
      {"\n"}
      <Line label="Email" value={email} placeholder="you@example.com" />
      {"\n"}
      <Line label="Message" value={msg} placeholder="what you write here" />
    </>
  );
}

function Chat({ provider = "telegram", name, email, msg, typing = false }) {
  if (provider === "inbox") {
    return (
      <div className="chat chat--inbox" data-provider="inbox" data-ui>
        <div className="chat__header">
          <p className="chat__title">Inbox</p>
          <p className="chat__sub">1 new</p>
        </div>
        <div className={`chat__mail${typing ? " is-typing" : ""}`}>
          <p className="chat__meta">
            <strong>Portfolio contact form</strong> <span className="chat__time">now</span>
          </p>
          <p className="chat__subject">New message{name ? ` from ${name}` : ""}</p>
          <p className="chat__text">
            <Body name={name} email={email} msg={msg} />
          </p>
        </div>
      </div>
    );
  }

  if (provider === "slack") {
    return (
      <div className="chat chat--slack" data-provider="slack" data-ui>
        <div className="chat__header">
          <p className="chat__title"># portfolio-messages</p>
        </div>
        <div className={`chat__message${typing ? " is-typing" : ""}`}>
          <span className="chat__avatar" aria-hidden="true">MI</span>
          <div>
            <p className="chat__meta">
              <strong>Portfolio</strong> <span className="chat__tag">APP</span> <span className="chat__time">now</span>
            </p>
            <p className="chat__text">
              <Body name={name} email={email} msg={msg} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat chat--telegram" data-provider="telegram" data-ui>
      <div className="chat__header">
        <span className="chat__avatar" aria-hidden="true">MI</span>
        <div>
          <p className="chat__title">Portfolio messages</p>
          <p className="chat__sub">bot</p>
        </div>
      </div>
      <p className={`chat__bubble${typing ? " is-typing" : ""}`}>
        <Body name={name} email={email} msg={msg} />
        <span className="chat__time">now</span>
      </p>
    </div>
  );
}

export default Chat;
