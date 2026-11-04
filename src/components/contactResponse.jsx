import { Message } from "semantic-ui-react";

function ContactResponse({ success, header, message }) {
  return (
    <Message
      positive={success}
      negative={!success}
      role={success ? "status" : "alert"}
      icon={success ? "check circle" : "warning circle"}
      header={header}
      content={message}
    />
  );
}

export default ContactResponse;
