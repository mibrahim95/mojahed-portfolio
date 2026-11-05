import { logoBySlug } from "../skills";
import { SkillLogo } from "./logo";

// Two projects have no screenshot. Their pictures are drawn from what they are.

// What the Telegram API delivers: the same three lines the contact function sends.
function ApiMedia() {
  return (
    <div className="gen gen-api" role="img" aria-label="A contact-form message delivered to Telegram by the API">
      <p className="gen-req">
        <b>POST</b> /api/contact <span>200 OK</span>
      </p>
      <p className="gen-bubble">
        Name: Dana Whitfield
        <br />
        Email: dana@company.com
        <br />
        Message: Hi Mojahed, can we talk about a role?
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
  if (project.imgPath) {
    return <img src={project.imgPath} alt={`Screenshot of ${project.header}`} width="800" height="480" loading="lazy" sizes={sizes} />;
  }
  return project.header === "Homelab" ? <RackMedia /> : <ApiMedia />;
}
