const fs = require('fs');
const axios = require('axios');

const username = 'evan70';
const readmePath = 'README.md';

async function getRepos() {
  const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
  return res.data;
}

function renderColorBar(count, maxCount, length = 20, color = 'green') {
  const filled = Math.round((count / maxCount) * length);
  const empty = length - filled;
  const filledBlock = `![${color}](https://via.placeholder.com/${filled}x10/${color}?text=)`;
  const emptyBlock = `![empty](https://via.placeholder.com/${empty}x10/eeeeee?text=)`;
  return filledBlock + emptyBlock;
}

async function main() {
  let repos = await getRepos();

  if (!repos.length) return;

  repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

  const maxStars = Math.max(...repos.map(r => r.stargazers_count)) || 1;
  const maxForks = Math.max(...repos.map(r => r.forks_count)) || 1;

  let readme = `# Ivan Paldan – PHP Developer & Open Source Enthusiast\n\n`;
  readme += `[![GitHub followers](https://img.shields.io/github/followers/${username}?label=Follow&style=social)](https://github.com/${username})\n\n`;
  readme += `## 🧩 My Projects (sorted by stars)\n\n`;

  repos.forEach(repo => {
    readme += `### [${repo.name}](${repo.html_url})\n`;
    readme += `${repo.description || 'No description'}\n\n`;

    const starsBar = renderColorBar(repo.stargazers_count, maxStars, 20, 'gold');
    const forksBar = renderColorBar(repo.forks_count, maxForks, 20, 'blue');

    readme += `Stars: ${starsBar} (${repo.stargazers_count})  \n`;
    readme += `Forks: ${forksBar} (${repo.forks_count})  \n`;
    readme += `![Last commit](https://img.shields.io/github/last-commit/${username}/${repo.name})\n\n`;
  });

  fs.writeFileSync(readmePath, readme, 'utf-8');
  console.log('README.md generated successfully!');
}

main();
