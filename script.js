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
    return;
  }

  status.textContent = `Showing ${repos.length} starred repositories.`;

  const items = repos.map((repo) => {
    const li = document.createElement('li');
    li.className = 'repo-card';

    li.innerHTML = `
      <h2><a href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h2>
      <p>${repo.description || 'No description available.'}</p>
      <div class="repo-meta">
        <span>⭐ ${repo.stars.toLocaleString()}</span>
        <span>${repo.language || 'Unknown language'}</span>
        <span>Starred ${formatDate(repo.starred_at)}</span>
      </div>
    `;

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
