import { logoBySlug } from "../skills";
import { SkillLogo } from "./logo";
import { PixelHeart } from "./hero";

// Two projects have no screenshot. Their pictures are drawn from what they are.

// What the Telegram API does: the request the contact form sends, and the message it becomes.
function ApiMedia() {
  return (
    <div className="gen gen-api" role="img" aria-label="A contact-form request to the API, and the Telegram message it turns into">
      <div className="gen-code">
        <p className="gen-req">
          <b>POST</b> /api/contact <span>200 OK</span>
        </p>
        <pre>{`{
  "name": "Dana Whitfield",
  "email": "dana@company.com",
  "message": "Can we talk about a role?"
}`}</pre>
      </div>
      <p className="gen-hop" aria-hidden="true">
        <span /> Telegram Bot API
      </p>
      <p className="gen-bubble">
        <b>New message from your site</b>
        Dana Whitfield, dana@company.com
        <br />
        Can we talk about a role?
        <span className="gen-time">9:41</span>
      </p>
    </div>
  );
}

// The homelab's own service list (projects.json), drawn as a server rack.
const RACK = [
  { slug: "proxmox", name: "Proxmox", role: "Host, one container per service" },
  { slug: "immich", name: "Immich", role: "Phone photo backup" },
  { slug: "nextcloud", name: "Nextcloud", role: "Files" },
  { slug: "pihole", name: "Pi-hole", role: "Local names for each service" },
  { slug: "nginx", name: "Nginx Proxy Manager", role: "Reverse proxy" },
  { slug: "tailscale", name: "Tailscale", role: "The only way in from outside" },
];

function RackMedia() {
  return (
    <div className="gen gen-rack" role="img" aria-label="The homelab services stacked like units in a server rack">
      {RACK.map((r, i) => (
        <div className="rack-u" key={r.slug} style={{ "--i": i }}>
          <span className="rack-led" />
          <SkillLogo logo={logoBySlug(r.slug)} name={r.name} size={14} />
          <span className="rack-name">{r.name}</span>
          <span className="rack-role">{r.role}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectMedia({ project, sizes }) {
  if (project.header === "Heartbeat Frame") {
    return (
      <span className="media-heart">
        <img src={project.imgPath} alt={`Photo of ${project.header}`} width="800" height="480" loading="lazy" sizes={sizes} />
        <PixelHeart />
      </span>
    );
  }
  if (project.imgPath) {
    return <img src={project.imgPath} alt={`Screenshot of ${project.header}`} width="800" height="480" loading="lazy" sizes={sizes} />;
  }
  return project.header === "Homelab" ? <RackMedia /> : <ApiMedia />;
}
