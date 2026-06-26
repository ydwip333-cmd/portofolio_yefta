document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  await loadPublicData();

  setupContactForm();

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  const sectionIds = [
    "home",
    "about",
    "skills",
    "experience",
    "projects",
    "contact",
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "#" + id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
});

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector("nav");
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

async function loadPublicData() {
  try {
    const response = await fetch("/api/main-profile");
    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const res = await response.json();

    if (!res.success || !res.data) {
      showError("Data profil belum tersedia.");
      return;
    }

    const { skills, experiences, projects } = res.data;
    const profile = res.data;

    if (!profile.nama_lengkap) {
      showError("Nama profil kosong.");
      return;
    }

    renderHero(profile);
    renderAbout(profile);
    renderSkills(skills || []);
    renderExperiences(experiences || []);
    renderProjects(projects || []);
    renderContact(profile);
  } catch (error) {
    console.error("Fetch Error:", error);
    showError("Gagal terhubung ke server.");
  }
}

function showError(msg) {
  const heroContent = document.getElementById("hero-content");
  if (heroContent) {
    heroContent.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-circle"></i> ${msg}</div>`;
  }
}

function renderHero(p) {
  const hero = document.getElementById("hero-content");
  if (!hero) return;

  hero.innerHTML = `
        <div class="hero-badge"><i class="fas fa-star"></i> Selamat Datang di Portofolio Saya</div>
        <h1>Halo, Saya<br><span class="highlight">${escapeHtml(p.nama_lengkap)}</span></h1>
        <p class="hero-subtitle">${escapeHtml(p.prodi || "Mahasiswa")}</p>
        <span class="hero-prodi">${escapeHtml(p.universitas || "")}</span>
        <div class="hero-actions">
            <a href="#projects" class="btn"><i class="fas fa-folder-open"></i> Lihat Proyek Saya</a>
        </div>
        <div class="hero-stats">
            <div class="hero-stat-item"><span class="stat-num" id="stat-projects">0</span><span class="stat-label">Proyek</span></div>
            <div class="hero-stat-item"><span class="stat-num" id="stat-skills">0</span><span class="stat-label">Skill</span></div>
            <div class="hero-stat-item"><span class="stat-num" id="stat-exp">0</span><span class="stat-label">Pengalaman</span></div>
        </div>
    `;

  const heroSection = document.querySelector(".hero");
  if (heroSection && !heroSection.querySelector(".scroll-indicator")) {
    const ind = document.createElement("div");
    ind.className = "scroll-indicator";
    ind.innerHTML = '<i class="fas fa-chevron-down"></i>';
    heroSection.appendChild(ind);
  }
}

function renderAbout(p) {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  const oldTitle = aboutSection.querySelector(".section-title");
  if (oldTitle && !aboutSection.querySelector(".section-header")) {
    const header = document.createElement("div");
    header.className = "section-header reveal";
    header.innerHTML =
      '<span class="section-tag">About Me</span><h2 class="section-title">Tentang Saya</h2>';
    oldTitle.replaceWith(header);
  }

  const img = document.getElementById("profile-photo");
  const placeholder = document.getElementById("photo-placeholder");
  if (img && placeholder) {
    if (p.foto_url) {
      img.src = p.foto_url;
      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  }

  const aboutImg = aboutSection.querySelector(".about-img");
  if (aboutImg && !aboutImg.classList.contains("about-img-wrap")) {
    aboutImg.className = "about-img-wrap reveal";
    const frame = document.createElement("div");
    frame.className = "about-img-frame";
    while (aboutImg.firstChild) frame.appendChild(aboutImg.firstChild);
    aboutImg.appendChild(frame);
  }

  const aboutText = document.getElementById("about-text");
  if (aboutText) {
    aboutText.className = "about-text reveal";
    aboutText.innerHTML = `
            <h3>${escapeHtml(p.nama_lengkap)}</h3>
            <span class="about-role">${escapeHtml(p.prodi)} &mdash; ${escapeHtml(p.universitas)}</span>
            <p>Mahasiswa Program Studi ${escapeHtml(p.prodi)}, Fakultas ${escapeHtml(p.fakultas)},
            ${escapeHtml(p.universitas)}. Tertarik dalam pengembangan backend, manajemen database,
            dan arsitektur aplikasi web.</p>
            <div class="about-info-grid">
                <div class="about-info-item"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(p.alamat || "-")}</span></div>
                <div class="about-info-item"><i class="fas fa-graduation-cap"></i><span>${escapeHtml(p.fakultas || "-")}</span></div>
                <div class="about-info-item"><i class="fas fa-envelope"></i><span>${escapeHtml(p.email || "-")}</span></div>
                <div class="about-info-item"><i class="fas fa-university"></i><span>${escapeHtml(p.universitas || "-")}</span></div>
            </div>
            <a href="#contact" class="btn"><i class="fas fa-paper-plane"></i> Hubungi Saya</a>
        `;
  }
}

function renderSkills(skills) {
  const container = document.getElementById("skills-container");
  if (!container) return;

  const skillSection = document.getElementById("skills");
  if (skillSection) {
    const oldTitle = skillSection.querySelector(".section-title");
    if (oldTitle && !skillSection.querySelector(".section-header")) {
      const header = document.createElement("div");
      header.className = "section-header reveal";
      header.innerHTML =
        '<span class="section-tag">Skills</span><h2 class="section-title">Keahlian</h2>';
      oldTitle.replaceWith(header);
    }
  }

  const statEl = document.getElementById("stat-skills");
  if (statEl) statEl.textContent = skills.length + "+";

  if (!skills.length) {
    container.innerHTML = '<p class="empty-state">Belum ada data skill.</p>';
    return;
  }
  container.innerHTML = skills
    .map(
      (s, i) => `
        <div class="skill-card reveal" style="transition-delay:${i * 0.05}s">
            <i class="${escapeHtml(s.icon_class || "fas fa-code")}"></i>
            <h4>${escapeHtml(s.nama_skill)}</h4>
        </div>
    `,
    )
    .join("");
  initReveal();
}

function renderExperiences(exps) {
  const container = document.getElementById("experience-container");
  if (!container) return;

  const expSection = document.getElementById("experience");
  if (expSection) {
    const oldTitle = expSection.querySelector(".section-title");
    if (oldTitle && !expSection.querySelector(".section-header")) {
      const header = document.createElement("div");
      header.className = "section-header reveal";
      header.innerHTML =
        '<span class="section-tag">Experience</span><h2 class="section-title">Pengalaman</h2>';
      oldTitle.replaceWith(header);
    }
  }

  const statEl = document.getElementById("stat-exp");
  if (statEl) statEl.textContent = exps.length;

  if (!exps.length) {
    container.innerHTML = '<p class="empty-state">Belum ada pengalaman.</p>';
    return;
  }
  container.innerHTML = exps
    .map(
      (e) => `
        <div class="timeline-item reveal">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date"><i class="far fa-calendar"></i> ${escapeHtml(e.durasi)}</span>
                <h3>${escapeHtml(e.posisi)}</h3>
                <h4>${escapeHtml(e.perusahaan)}</h4>
                <p>${escapeHtml(e.deskripsi)}</p>
            </div>
        </div>
    `,
    )
    .join("");
  initReveal();
}

function renderProjects(projs) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const projSection = document.getElementById("projects");
  if (projSection) {
    const oldTitle = projSection.querySelector(".section-title");
    if (oldTitle && !projSection.querySelector(".section-header")) {
      const header = document.createElement("div");
      header.className = "section-header reveal";
      header.innerHTML =
        '<span class="section-tag">Projects</span><h2 class="section-title">Proyek Saya</h2>';
      oldTitle.replaceWith(header);
    }
  }

  const statEl = document.getElementById("stat-projects");
  if (statEl) statEl.textContent = projs.length + "+";

  if (!projs.length) {
    container.innerHTML = '<p class="empty-state">Belum ada proyek.</p>';
    return;
  }
  container.innerHTML = projs
    .map(
      (p, i) => `
        <div class="project-card reveal" style="transition-delay:${i * 0.08}s">
            <div class="project-img-wrapper">
                ${
                  p.gambar_url
                    ? `<img src="${escapeHtml(p.gambar_url)}" alt="${escapeHtml(p.judul)}" class="project-img" loading="lazy">`
                    : '<div class="project-img-placeholder"><i class="fas fa-layer-group"></i></div>'
                }
                <div class="project-overlay">
                    <h3 class="project-title-overlay">${escapeHtml(p.judul)}</h3>
                </div>
            </div>
            <div class="project-info">
                <p>${escapeHtml(p.deskripsi?.substring(0, 130))}${(p.deskripsi?.length || 0) > 130 ? "..." : ""}</p>
                <div class="project-links">
                    ${p.link_project ? `<a href="${escapeHtml(p.link_project)}" target="_blank"><i class="fas fa-external-link-alt"></i> Lihat Demo</a>` : ""}
                </div>
            </div>
        </div>
    `,
    )
    .join("");
  initReveal();
}

function renderContact(p) {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const oldTitle = contactSection.querySelector(".section-title");
    if (oldTitle && !contactSection.querySelector(".section-header")) {
      const header = document.createElement("div");
      header.className = "section-header reveal";
      header.innerHTML =
        '<span class="section-tag">Contact</span><h2 class="section-title">Hubungi Saya</h2>';
      oldTitle.replaceWith(header);
    }

    const cc = contactSection.querySelector(".contact-container");
    if (cc) cc.className = "contact-wrapper";
  }
  const emailDisplay = document.getElementById("contact-email-display");
  if (emailDisplay) {
    emailDisplay.className = "contact-intro";
    emailDisplay.innerHTML = `Punya proyek menarik atau ingin berkolaborasi?<br>Jangan ragu untuk menghubungi saya!`;
  }
  initReveal();
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = document.getElementById("sendBtn");
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Mengirim...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("contactName").value,
          email: document.getElementById("contactEmail").value,
          message: document.getElementById("contactMessage").value,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ " + result.message);
        contactForm.reset();
      } else {
        alert("❌ " + (result.error || "Gagal mengirim"));
      }
    } catch (error) {
      alert("❌ Terjadi kesalahan jaringan.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => obs.observe(el));
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
