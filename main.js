const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeButton.textContent = "🌙";
    } else {
        themeButton.textContent = "☀️";
    }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

function addProjectImageFallbacks() {
  document.querySelectorAll(".project-card .project-image img").forEach(image => {
    image.addEventListener("error", () => {
      const container = image.closest(".project-image");
      const projectName = image.closest(".project-card")
        .querySelector(".project-content h3")
        .textContent
        .trim();

      const colors = [
        "#7c3aed",
        "#2563eb",
        "#db2777",
        "#ea580c",
        "#0891b2",
        "#16a34a"
      ];

      const firstColor = colors[Math.floor(Math.random() * colors.length)];
      let secondColor = firstColor;

      while (secondColor === firstColor) {
        secondColor = colors[Math.floor(Math.random() * colors.length)];
      }

      container.classList.add("is-fallback");
      container.style.background =
        `linear-gradient(45deg, ${firstColor}, ${secondColor})`;

      container.textContent =
        projectName.charAt(0).toLocaleUpperCase("uk-UA");
    }, { once: true });
  });
}

const token_key = "";

async function getGitHubEmail() {
  const response = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${token_key}`,
      Accept: 'application/vnd.github+json'
    }
  });

  if (!response.ok) {
    throw new Error('Не вдалося отримати email');
  }

  const emails = await response.json();

  const primaryEmail = emails.find(email =>
    email.primary && email.verified
  );

  return primaryEmail?.email || 'Не вказано';
}

const githubUsername = 'Matviy7878';

const setText = (id, value) => {
  document.getElementById(id).textContent = value;
};

const formatDate = value =>
  new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

async function loadGithubProfile() {
  const loading = document.getElementById('githubLoading');
  const error = document.getElementById('githubError');
  const profile = document.getElementById('githubProfile');

  try {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`),
      fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`),
      fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=100`)
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error('GitHub API недоступний');
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();
    const events = eventsResponse.ok ? await eventsResponse.json() : [];

    const latestEvent = events.find(event => event.created_at);
    const latestRepo = repos
      .map(repo => repo.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);

    const lastActivity = latestEvent?.created_at || latestRepo;
    const isActive = lastActivity &&
      Date.now() - new Date(lastActivity).getTime() <= 30 * 24 * 60 * 60 * 1000;

    document.getElementById('githubAvatar').src = user.avatar_url;
    //document.getElementById('githubAvatar').alt = `Аватар ${user.login}`;
    //document.getElementById('githubLink').href = user.html_url;

    console.log(user)

    getGitHubEmail().then(email => {
        const useremail = email;
        //setText('githubEmail', useremail || 'Не публічний');

        const codeDiv = document.getElementById("codecard");
        codeDiv.innerHTML = `
<span class="purple">const</span> developer = {
    name: <span class="green">"${user.name || 'Не вказано'}"</span>,
    role: <span class="green">"Programmer"</span>,
    bio: <span class="green">"${user.bio || 'Біо не публічне або не вказане.'}"</span>,
    passion: <span class="green">"Games & Web"</span>,
    email: <span class="green">"${useremail || 'Не публічний'}"</span>,
    location: <span class="green">"${user.location || 'Не вказано'}"</span>,
    followers: <span class="green">"${user.followers}"</span>,
    following: <span class="green">"${user.following}"</span>,
    repositories: <span class="green">"${user.public_repos}"</span>,
    last-time-active: <span class="green">"${lastActivity ? formatDate(lastActivity) : 'Немає публічних даних'}"</span>,
    status: <span class="green">"${isActive ? 'Active' : 'Not active'}"</span>
};
        `
    });

    //setText('githubName', user.name || user.login);
    //setText('githubUsername', user.login);
    //setText('githubDisplayName', user.name || 'Не вказано');
    //setText('githubLocation', user.location || 'Не вказано');
    //setText('githubBio', user.bio || 'Біо не публічне або не вказане.');
    //setText('githubFollowers', user.followers);
    //setText('githubFollowing', user.following);
    //setText('githubRepositories', user.public_repos);
    //setText(
    //  'githubLastActive',
    //  lastActivity ? formatDate(lastActivity) : 'Немає публічних даних'
    //);

    //const status = document.getElementById('githubStatus');
    //status.textContent = lastActivity
    //  ? isActive ? '● Active' : '● Nonactive'
    //  : '● Unknown';
//
    //status.className = `status ${isActive ? 'active' : ''}`;

    //setText(
    //  'githubActivityNote',
    //  latestEvent
    //    ? 'Остання активність — остання публічна GitHub-подія.'
    //    : latestRepo
    //      ? 'Публічних подій немає: показано останнє оновлення репозиторію.'
    //      : 'GitHub не повернув публічних даних про активність.'
    //);

    //loading.hidden = true;
    //profile.hidden = false;
  } catch {
    //loading.hidden = true;
    //error.textContent =
    //  'Не вдалося завантажити GitHub-профіль. Спробуйте оновити сторінку пізніше.';
    //error.hidden = false;
  }
}

function createProjectCard(project) {
  const tags = project.tags
    .map(tag => `<span>${tag}</span>`)
    .join("");

  const buttons = project.buttons
    .map(button => `
      <a href="${button.href}" target="_blank"
         class="button ${button.type}">
        ${button.button_text}
      </a>
    `)
    .join("");

  return `
    <article class="project-card">
      <div class="project-image">
        <img src="${project.img_url}" alt="${project.name}">
      </div>

      <div class="project-content">
        <span class="project-type">${project.project_type}</span>
        <h3>${project.name}</h3>
        <p>${project.desc}</p>

        <div class="project-tags">
          ${tags}
        </div>

        <div class="project-buttons">
          ${buttons}
        </div>
      </div>
    </article>
  `;
}

async function loadOtherProjects() {
  try {
    const response = await fetch("other_projects.json");

    if (!response.ok) {
      throw new Error("Не вдалося завантажити other_projects.json");
    }

    const projects = await response.json();

    document.getElementById("featuredList").innerHTML =
      projects.featured.map(createProjectCard).join("");

    document.getElementById("unfeaturedList").innerHTML =
      projects.unfeatured.map(createProjectCard).join("");

    addProjectImageFallbacks();
  } catch (error) {
    console.error(error);
  }
}

async function loadWebsites() {
  const websitesList = document.getElementById("websitesList");

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error("Не вдалося завантажити GitHub-проєкти");
    }

    const repositories = await response.json();

    websitesList.innerHTML = repositories.map(repo => `
      <article class="project-card">
        <div class="project-image github-project-image">
            <img
                src=""
                alt="${repo.name}"
            >
        </div>

        <div class="project-content">
          <span class="project-type">GitHub Project</span>
          <h3>${repo.name}</h3>
          <p>${repo.description || "Опис проєкту ще не додано."}</p>

          <div class="project-tags">
            <span>${repo.language || "Code"}</span>
            ${repo.homepage ? "<span>Website</span>" : ""}
          </div>

          <div class="project-buttons">
            ${repo.homepage ? `
              <a href="${repo.homepage}" target="_blank" class="button primary">
                🌐 Open Website
              </a>
            ` : ""}

            <a href="${repo.html_url}" target="_blank" class="button secondary">
              💻 GitHub
            </a>
          </div>
        </div>
      </article>
    `).join("");
    addProjectImageFallbacks();
  } catch (error) {
    websitesList.innerHTML = `
      <p class="error">Не вдалося завантажити GitHub-проєкти.</p>
    `;

    console.error(error);
  }
}

loadWebsites();
loadOtherProjects();

function addImageFallback(image) {
  const container = image.closest('.project-image');
  const title = image.closest('.project-card')
    ?.querySelector('.project-content h3')
    ?.textContent
    ?.trim() || image.alt || 'P';

  const colors = [
    '#7c3aed', '#2563eb', '#db2777',
    '#ea580c', '#0891b2', '#16a34a'
  ];

  const first = colors[Math.floor(Math.random() * colors.length)];
  let second = first;

  while (second === first) {
    second = colors[Math.floor(Math.random() * colors.length)];
  }

  container.classList.add('is-fallback');
  container.style.background = `linear-gradient(45deg, ${first}, ${second})`;
  container.textContent = title.charAt(0).toLocaleUpperCase('uk-UA');
}

document.querySelectorAll('.project-card .project-image img').forEach(image => {
  image.addEventListener('error', () => addImageFallback(image), { once: true });

  if (image.complete && image.naturalWidth === 0) {
    addImageFallback(image);
  }
});

const projectButton = document.getElementById('projectButton');

if (projectButton) {
  projectButton.addEventListener('click', () => {
    document.getElementById('projects').scrollIntoView({
      behavior: 'smooth'
    });
  });
}

loadGithubProfile();
