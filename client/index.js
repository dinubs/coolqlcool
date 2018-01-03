import { h, render } from 'preact';
import styled from 'styled-components';
import Highlight from 'react-highlight';


const App = styled.div`
  -moz-osx-font-smoothing: grayscale;
  -ms-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-size: 1.6rem;
  margin: 0 auto;
  max-width: 36em;
  padding: 10px;
  width: 100%;
`;

const CodeHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 48px 0 -22px;
  text-transform: uppercase;
`;

const Small = styled.small`
  display: block;
  font-size: .8rem;
  font-style: italic;
  text-align: center;
`;

const EXAMPLE_QUERY = `{
  site(url: "https://news.ycombinator.com") {
    titles: select(elem: "tr.athing") {
      id: attr(name: "id")
      numberOfLinks: count(elem: ".storylink")
      link: select(elem: ".storylink") {
        text
        href
        class
        classList
      }
    }
  }
}`

const Root = () => (
  <App id="you-can-wait-for-this-with-graphql">
    <h1>Cool. CoolQLCool</h1>
    <p>CoolQLCool (CQC) is an open source Graph QL server that allows you to turn websites into a Graph QL api. It's pretty tubular (I'm incredibly biased tho).</p>
    <p>You can play around with it in <a href="./graphiql">graphiql</a>. Or take a gander at the source on <a href="https://github.com/dinubs/coolqlcool">Github</a>.</p>
    <h2>Example</h2>
    <iframe src='./graphiql?query=%7B%0A%20%20hnews%3A%20site(url%3A%20"https%3A%2F%2Fnews.ycombinator.com")%20%7B%0A%20%20%20%20numberOfTitles%3A%20count(elem%3A%20"tr.athing")%0A%20%20%20%20titles%3A%20select(elem%3A%20"tr.athing")%20%7B%0A%20%20%20%20%20%20id%3A%20attr(name%3A%20"id")%0A%20%20%20%20%20%20numberOfLinks%3A%20count(elem%3A%20".storylink")%0A%20%20%20%20%20%20link%3A%20select(elem%3A%20".storylink")%20%7B%0A%20%20%20%20%20%20%20%20text%0A%20%20%20%20%20%20%20%20href%0A%20%20%20%20%20%20%20%20class%0A%20%20%20%20%20%20%20%20classList%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A' width="100%" height="400px"></iframe>
    <h2>Features</h2>
    <p>In order of how radical I think they are.</p>
    <ul>
      <li>Waits for JS to do stuff if you specify.
        <p>By default CQC will load just the HTML like a normal AJAX request, but if you pass the `wait` or `waitForSelector` arguments in your initial `site` search, CQC will wait a designated time, or for a CSS selector on the page to show up.</p>
      </li>
      <li>Allows you to query multiple sites at once
        <p>In past renditions of web scrapers they've only been able to scrape a single site at once (e.g. <a href="https://www.github.com/dinubs/jam-api">Jam API</a>). With CQC you can query multiple sites in a single request by aliasing each `site` call.</p>
      </li>
      <li>Easier to add more fields in the future.
        <p>With past scrapers it was incredibly difficult to add new fields to query elements by or to grab off of elements. With CQC it will be incredibly easy to have contributors add new fields and functionality.</p>
      </li>
    </ul>
    <h2>Possible Features</h2>
    <p>Some possible features that I'd like to see CQC have some day</p>
    <ul>
      <li>Provide steps to do on a page when it loads</li>
      <li>Recursive fields, for example for pagination on Hacker News to go to a certain number of pages and query each one for the same fields.</li>
      <li>Field to return the output of javascript</li>
    </ul>
    <h1>Examples</h1>
    <CodeHeader>Curl</CodeHeader>
    <Highlight className='bash'>
      {`curl -X GET \
-H "Content-Type: application/json" \
-d '{"query": "${EXAMPLE_QUERY.replace(/\n/g, " ").replace(/\"/g, '\\"')}"}' \
https://coolql.cool/graphql`}
    </Highlight>

    <CodeHeader>Javascript</CodeHeader>
    <Highlight className='javascript'>
      {`var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('POST', 'https://coolql.cool/graphql');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Accept', 'application/json');
xhr.onload = function () {
  console.log('data returned:', xhr.response);
}
xhr.send(JSON.stringify({ query: \`${EXAMPLE_QUERY}\` }));`}
    </Highlight>

    <CodeHeader>Ruby</CodeHeader>
    <Highlight className='ruby'>
    {`require 'net/http'
require 'uri'
require 'json'

uri = URI.parse("https://coolql.cool/graphql")

header = {'Content-Type': 'application/json'}
query = { query: '${EXAMPLE_QUERY}' }

http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Post.new(uri.request_uri, header)
request.body = query.to_json

response = http.request(request)`}
    </Highlight>

    <small>Made by Gavin</small>
  </App>
);

const root = render(<Root />, document.getElementById('js--app'));
