/* Connects the site to the database and loads projects. */

const CONFIGURED = SUPABASE_URL.startsWith("http") && !SUPABASE_ANON_KEY.startsWith("YOUR");
const sb = CONFIGURED && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* Escape text so nothing typed in the admin form can break the page */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function safeUrl(u) {
  return /^https?:\/\//i.test(u || "") ? u : "#";
}

async function loadProjects() {
  // Not connected yet: show the sample projects from projects-data.js
  if (!sb) return PROJECTS;
  const { data, error } = await sb.from("projects").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

/* Shows a floating "+ Add project" button, only to you when logged in */
async function showAdminButton() {
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  if (data.session) {
    const a = document.createElement("a");
    a.className = "fab";
    a.href = "admin.html";
    a.textContent = "+ Add project";
    document.body.appendChild(a);
  }
}
