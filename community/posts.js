async function fetchPosts(jsonPath) {
  const response = await fetch(jsonPath);
  const posts = await response.json();
  return posts;
}


async function displayLatestPosts(containerSelector, folderPath, count = 3) {
  const container = document.querySelector(containerSelector);
  const posts = await fetchPosts(folderPath);

  for (let i = 0; i < Math.min(count, posts.length); i++) {
    const post = posts[i];
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-preview');

    const postTitle = document.createElement('h3');
    postTitle.textContent = post.title;
    postDiv.appendChild(postTitle);

    const postExcerpt = document.createElement('p');
    postExcerpt.textContent = post.excerpt;
    postDiv.appendChild(postExcerpt);

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.textContent = 'Read more';
    postDiv.appendChild(postLink);

    container.appendChild(postDiv);
  }
}

async function displayAllPosts(containerSelector, folderPath) {
  const container = document.querySelector(containerSelector);
  const posts = await fetchPosts(folderPath);

  for (const post of posts) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-preview');

    const postTitle = document.createElement('h3');
    postTitle.textContent = post.title;
    postDiv.appendChild(postTitle);

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.textContent = 'Read more';
    postDiv.appendChild(postLink);

    container.appendChild(postDiv);
  }
}
