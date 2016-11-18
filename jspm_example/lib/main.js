import RedditApi from './reddit-api'
import ExtractGifs from './extract-gifs'
import DisplayGifs from './display-gifs'
import vis from 'jspm_packages/npm/vis@4.16.1/dist/vis'

let state = 'comiled and loaded';

console.log(`Test for dynamically ${state}!.`);
RedditApi
.load()
.then(ExtractGifs)
.then(url => {
  console.log(url);
  return url;
})
.then(DisplayGifs)

console.log(vis, '123')
// provide data in the DOT language
var DOTstring = 'dinetwork {1 -> 1 -> 2; 2 -> 3; 2 -- 4; 2 -> 1 }';
var parsedData = vis.network.convertDot(DOTstring);

var data = {
  nodes: parsedData.nodes,
  edges: parsedData.edges
}

var options = parsedData.options;

// you can extend the options like a normal JSON variable:
options.nodes = {
  color: 'yellow'
}

var container = viewport;
// create a network
var network = new vis.Network(container, data, options);

export default {}
