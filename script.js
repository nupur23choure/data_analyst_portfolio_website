/* Builds project cards from the database (or sample data) */

const THUMBS = ["bars", "table", "line"];

function thumbHTML(p, i) {
  if (p.image) return `<img src="${esc(p.image)}" alt="${esc(p.title)}">`;
  const t = p.thumb || THUMBS[i % 3];
  if (t === "table") return `<div class="rows">${"<i></i>".repeat(7)}</div>`;
  if (t === "line") {
    return `<div class="line"><svg viewBox="0 0 400 220" preserveAspectRatio="none">
      <polyline points="0,150 80,110 150,125 230,50 300,80 400,30" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      <polyline points="0,190 90,165 160,175 240,140 330,120 400,100" fill="none" stroke="#6b7280" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg></div>`;
  }
  const heights = [35, 60, 45, 85, 55, 70];
  return `<div class="bars">${heights.map(h => `<i style="height:${h}%"></i>`).join("")}</div>`;
}

function cardHTML(p, i, showDomain) {
  const href = safeUrl(p.link);
  return `<a class="card" href="${esc(href)}" ${href !== "#" ? 'target="_blank" rel="noopener"' : ""}>
    <div class="thumb">${thumbHTML(p, i)}</div>
    ${showDomain ? `<span class="tag">${esc(p.domain)}</span>` : ""}
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <div class="tools">${esc(p.tools)}</div>
  </a>`;
}

const EMPTY = `<p style="color:var(--muted)">Projects coming soon.</p>`;

async function init() {
  const projects = await loadProjects();

  /* HOME PAGE carousel */
  const track = document.getElementById("track");
  if (track) {
    let featured = projects.filter(p => p.featured);
    if (!featured.length) featured = projects.slice(0, 6);
    track.innerHTML = projects.length
      ? featured.map((p, i) => cardHTML(p, i, true)).join("") +
        `<a class="more-card" href="projects.html"><div><b>Show all projects →</b><span style="color:var(--muted)">${projects.length} project${projects.length > 1 ? "s" : ""}, by domain</span></div></a>`
      : EMPTY;

    const step = () => (track.querySelector(".card")?.offsetWidth || 400) + 30;
    document.getElementById("prev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    document.getElementById("next").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
  }

  /* ALL PROJECTS PAGE grouped by domain */
  const list = document.getElementById("domains");
  if (list) {
    const domains = [...new Set(projects.map(p => p.domain))].sort();
    const filters = document.getElementById("filters");
    let active = "All";

    function render() {
      if (!projects.length) { list.innerHTML = EMPTY; return; }
      const shown = active === "All" ? domains : [active];
      list.innerHTML = shown.map(d => {
        const items = projects.filter(p => p.domain === d);
        return `<section class="domain">
          <h2>${esc(d)} <small>${items.length} project${items.length > 1 ? "s" : ""}</small></h2>
          <div class="grid">${items.map((p, i) => cardHTML(p, i, false)).join("")}</div>
        </section>`;
      }).join("");
      filters.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.d === active));
    }

    filters.innerHTML = ["All", ...domains].map(d => `<button class="chip" data-d="${esc(d)}">${esc(d)}</button>`).join("");
    filters.onclick = e => { if (e.target.dataset.d) { active = e.target.dataset.d; render(); } };
    render();
  }

  showAdminButton();
}
init();
