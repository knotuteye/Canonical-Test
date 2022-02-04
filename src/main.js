function sanitizePostData(rawPost) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const date = new Date(rawPost.date);

    return {
        topic: rawPost._embedded["wp:term"].filter(x => x.some(y => y.taxonomy == 'topic'))[0]
            ?
            rawPost._embedded["wp:term"].filter(x => x.some(y => y.taxonomy == 'topic'))[0][0].name
            : 'No Topic',
        postType: 'Article',
        link: rawPost.link,
        imageSource: rawPost.featured_media,
        title: rawPost.title.rendered,
        author: {
            link: rawPost._embedded.author[0].link,
            name: rawPost._embedded.author[0].name,
        },
        date: `${date.getDate()} ${months[date.getUTCMonth()]} ${date.getFullYear()}`

    }

}

function generateCard(post) {
    return `
          <div class="card-box col-4">
            <header class="card-header">
              <h3 class="p-muted-heading u-no-margin--bottom">${post.topic}</h3>
            </header>
            <div class="p-card__content card-body">
              <div class="">
                <a href="${post.link}">
                  <img
                    alt=${post.title}
                    
                    src="${post.imageSource}"
                    
                  />
                </a>
              </div>
              <h3 class="p-heading--4">
                <a href="${post.link}">${post.title}</a>
              </h3>
              <p>
                <em
                  >By
                  <a href="${post.author.link}">${post.author.name}</a>
                  on ${post.date}</em>
              </p>
            </div>
            <p class="p-card__footer card-footer">${post.postType}</p>
          </div>
      `
}

const endpoint = "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json";

fetch(endpoint)
    .then((response) => response.json())
    .then((data) => document.querySelector('.row').innerHTML = data.map(sanitizePost).map(generateCard).join('\n'));