const $ = s => document.querySelector(s);
let editingId = null;
let imageData = "";      // new image chosen (data URL)
let existingImage = "";  // image already saved on the project being edited

function msg(el, text, ok) { el.textContent = text; el.className = "msg " + (ok ? "ok" : "err"); }

/* Resize + compress the image in the browser, so it is small enough to store */
function compressImage(file, maxW = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      let q = 0.82, out = c.toDataURL("image/jpeg", q);
      while (out.length > 380000 && q > 0.4) { q -= 0.1; out = c.toDataURL("image/jpeg", q); }
      URL.revokeObjectURL(url);
      resolve(out);
    };
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = url;
  });
}

async function showState() {
  if (!sb) { $("#setupWarn").classList.remove("hidden"); return; }
  const { data } = await sb.auth.getSession();
  const loggedIn = !!data.session;
  $("#loginForm").classList.toggle("hidden", loggedIn);
  $("#app").classList.toggle("hidden", !loggedIn);
  $("#logout").classList.toggle("hidden", !loggedIn);
  if (loggedIn) refreshList();
}

$("#loginForm").onsubmit = async e => {
  e.preventDefault();
  const { error } = await sb.auth.signInWithPassword({ email: $("#email").value.trim(), password: $("#password").value });
  if (error) return msg($("#loginMsg"), error.message, false);
  $("#password").value = "";
  showState();
};

$("#logout").onclick = async e => { e.preventDefault(); await sb.auth.signOut(); showState(); };

$("#image").onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    imageData = await compressImage(f);
    $("#preview").src = imageData;
    $("#preview").style.display = "block";
  } catch (err) { msg($("#formMsg"), err.message, false); }
};

function resetForm() {
  editingId = null; imageData = ""; existingImage = "";
  $("#projectForm").reset();
  $("#featured").checked = true;
  $("#preview").style.display = "none";
  $("#formTitle").textContent = "Add a project";
  $("#saveBtn").textContent = "Save project";
  $("#cancelBtn").classList.add("hidden");
}
$("#cancelBtn").onclick = () => { resetForm(); $("#formMsg").textContent = ""; };

$("#projectForm").onsubmit = async e => {
  e.preventDefault();
  const link = $("#link").value.trim();
  if (!/^https?:\/\//i.test(link)) return msg($("#formMsg"), "The GitHub link must start with https://", false);

  const row = {
    title: $("#title").value.trim(),
    domain: $("#domain").value.trim(),
    tools: $("#tools").value.trim(),
    link,
    description: $("#description").value.trim(),
    featured: $("#featured").checked,
    image: imageData || existingImage || null
  };

  $("#saveBtn").disabled = true;
  const res = editingId
    ? await sb.from("projects").update(row).eq("id", editingId)
    : await sb.from("projects").insert(row);
  $("#saveBtn").disabled = false;

  if (res.error) return msg($("#formMsg"), "Could not save: " + res.error.message, false);
  msg($("#formMsg"), editingId ? "Project updated." : "Project added. It is now live on your site.", true);
  resetForm();
  refreshList();
};

async function refreshList() {
  const { data, error } = await sb.from("projects").select("*").order("created_at", { ascending: false });
  const list = $("#list");
  if (error) { list.textContent = error.message; return; }

  $("#domainList").innerHTML = [...new Set(data.map(p => p.domain))].map(d => `<option value="${esc(d)}">`).join("");

  if (!data.length) { list.innerHTML = `<p style="color:var(--muted)">No projects yet. Add your first one above.</p>`; return; }
  list.innerHTML = data.map(p => `
    <div class="item" data-id="${esc(p.id)}">
      ${p.image ? `<img src="${esc(p.image)}" alt="">` : `<div class="ph"></div>`}
      <div class="info"><b>${esc(p.title)}</b><span>${esc(p.domain)} · ${esc(p.tools || "")}</span></div>
      <button class="mini" data-act="edit">Edit</button>
      <button class="mini del" data-act="del">Delete</button>
    </div>`).join("");

  list.onclick = async e => {
    const act = e.target.dataset.act;
    if (!act) return;
    const id = e.target.closest(".item").dataset.id;
    const p = data.find(x => x.id === id);
    if (act === "del") {
      if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
      const { error } = await sb.from("projects").delete().eq("id", id);
      if (error) return alert(error.message);
      refreshList();
    } else {
      editingId = id; imageData = ""; existingImage = p.image || "";
      $("#title").value = p.title; $("#domain").value = p.domain; $("#tools").value = p.tools || "";
      $("#link").value = p.link; $("#description").value = p.description || ""; $("#featured").checked = !!p.featured;
      if (p.image) { $("#preview").src = p.image; $("#preview").style.display = "block"; } else $("#preview").style.display = "none";
      $("#formTitle").textContent = "Edit project";
      $("#saveBtn").textContent = "Update project";
      $("#cancelBtn").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
}

showState();
