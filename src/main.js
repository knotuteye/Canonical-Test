// API Endpoint
const endpoint = "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json";

/**
 * This function accepts a raw post object from the API response and returns a formatted post object with convenient fields.
 * @param rawPost the post object from the API response
 */
function sanitizePostData(rawPost) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const date = new Date(rawPost.date);
  const topicArray = rawPost._embedded["wp:term"].filter(x => x.some(y => y.taxonomy == 'topic'))

  return {
    // Problem: Post #3 has no embedded topic
    // Solution: If an embedded topic is available, use topic else post.topic = 'Miscellaneous''
    topic: topicArray[0] ? topicArray[0][0].name : 'Miscellaneous',
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

/**
 * This function accepts a formatted post object and returns a template literal.
 * @param post The formatted post object.
 */
function generateCard(post) {
  return `
          <div class="p-card--highlighted col-4">
            <header>
              <h3 class="p-muted-heading u-no-margin--bottom">${post.topic}</h3>
            </header>
            <div class="p-card__content body">
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
            <p class="p-card__footer footer">Article</p>
          </div>
      `
}

fetch(endpoint)
  .then((response) => response.json())
  .then((data) => document.querySelector('.row').innerHTML = data.map(sanitizePostData).map(generateCard).join('\n'))
  .catch((err) => console.log(err));