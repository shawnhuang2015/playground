import jsonp from 'jsonp';
import test from './extract-gifs'

class RedditApi {
  constructor() {
    this.redidtURL = 'https://www.reddit.com/r/perfectloops/top.json'
  }
  load() {
    return new Promise((resolve, reject) => {
      jsonp(this.redidtURL, {param: 'jsonp'}, (err, data) => {
        err ? reject(err) : resolve(data.data.children);
      })
    })  
        
  }
}

export default new RedditApi();