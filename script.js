const eventsUrl = './events.json';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function renderRepos(repos) {
  const list = document.querySelector('#repoList');
  const status = document.querySelector('#statusMessage');

  if (!Array.isArray(repos) || repos.length === 0) {
    status.textContent = 'No starred repositories found.';
    list.replaceChildren();
    return;
  }

  status.textContent = `Showing ${repos.length} starred repositories.`;

  const items = repos.map((repo) => {
    const li = document.createElement('li');
    li.className = 'repo-card';

    const title = document.createElement('h2');
    const link = document.createElement('a');
    link.href = repo.url || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name || 'Repository';
    title.appendChild(link);

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description available.';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';

    const stars = document.createElement('span');
    stars.textContent = `⭐ ${Number.isFinite(repo.stars) ? repo.stars.toLocaleString() : '0'}`;

    const language = document.createElement('span');
    language.textContent = repo.language || 'Unknown language';

    const starredAt = document.createElement('span');
    starredAt.textContent = `Starred ${repo.starred_at ? formatDate(repo.starred_at) : 'unknown date'}`;

    meta.append(stars, language, starredAt);
    li.append(title, description, meta);

    return li;
  });

  list.replaceChildren(...items);
}

async function loadRepos() {
  const status = document.querySelector('#statusMessage');
  status.textContent = 'Loading starred repositories…';

  try {
    const response = await fetch(eventsUrl);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const data = await response.json();
    renderRepos(data);
  } catch (error) {
    status.textContent = 'Unable to load starred repositories.';
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', loadRepos);
