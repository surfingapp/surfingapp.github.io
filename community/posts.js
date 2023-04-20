class Blog {
  constructor(jsonPath) {
    this.jsonPath = jsonPath;
  }

  async fetchPosts() {
    const response = await fetch(this.jsonPath);
    const posts = await response.json();
    return posts;
  }

  async fetchPostContent(postLink) {
    const response = await fetch(postLink);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = doc.querySelector('h1').textContent;
    const image = doc.querySelector('img');
    const imageUrl = image ? image.src : null;
    const content = Array.from(doc.querySelectorAll('p')).map((p) => p.textContent);

    return { title, imageUrl, content };
  }

  async displayLatestPosts(containerSelector, count = 3) {
    const container = document.querySelector(containerSelector);
    const posts = await this.fetchPosts();

    for (let i = 0; i < Math.min(count, posts.length); i++) {
      const post = posts[i];
      const { title, imageUrl, content } = await this.fetchPostContent(post.link);
      const postDiv = this.createPostDiv(title, imageUrl, content, post.link, 1);
      container.appendChild(postDiv);
    }
  }

  async displayAllPosts(containerSelector) {
    const container = document.querySelector(containerSelector);
    const posts = await this.fetchPosts();

    for (const post of posts) {
      const { title, imageUrl, content } = await this.fetchPostContent(post.link);
      const postDiv = this.createPostDiv(title, imageUrl, content, post.link, 4);
      container.appendChild(postDiv);
    }
  }

  createPostDiv(title, imageUrl, content, link, contentParagraphs) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-preview');

    const postTitle = document.createElement('h3');
    postTitle.textContent = title;
    postDiv.appendChild(postTitle);

    if (imageUrl) {
      const postImage = document.createElement('img');
      postImage.src = imageUrl;
      postImage.alt = title;
      postDiv.appendChild(postImage);
    }

    for (let i = 0; i < contentParagraphs && i < content.length; i++) {
      const postExcerpt = document.createElement('p');
      postExcerpt.textContent = content[i];
      postDiv.appendChild(postExcerpt);
    }

    const postLink = document.createElement('a');
    postLink.href = link;
    postLink.textContent = 'Read more';
    postDiv.appendChild(postLink);

    return postDiv;
  }
}
