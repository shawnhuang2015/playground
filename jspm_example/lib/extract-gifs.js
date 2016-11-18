export default (posts) => {
  return posts
      .filter(post => !post.data.over_18)
      .map(post => post.data.url)
      .filter(post =>   /gifv?$/.exec(post))
      .map(url => url.replace(/v$/,''))
}
