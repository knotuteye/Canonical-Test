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