export default (posts) => {
  var elem = document.querySelector('#gifs')
  elem.innerHTML = posts.map(url => `<img src=${url}></img>`).join("\n")
}