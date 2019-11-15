import { getData } from './helpers/fetchData.js';

import { select, json, tsv, geoPath, geoMercator, zoom, event } from "d3";
import { feature } from 'topojson';

const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";

const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX gn: <http://www.geonames.org/ontology#>

# tel de materiaalsoorten bij wapens
SELECT ?title ?typeLabel ?long ?lat ?plaats (SAMPLE(?cho) as ?filtered)  (COUNT(?cho) AS ?choCount) WHERE {
  # selecteer soorten wapens
  <https://hdl.handle.net/20.500.11840/termmaster12445> skos:narrower ?type .
  ?type skos:prefLabel ?typeLabel .

  # geef objecten van een soort wapen
  ?cho dc:title ?title.
  ?cho edm:object ?type .
	
  
  ?plaats skos:exactMatch/wgs84:lat ?lat . #
  ?plaats skos:exactMatch/wgs84:long ?long .


}

LIMIT 10000`;


getData(url, query).then(data => {
  console.log(data.results.bindings)
  initD3(data.results.bindings)
  console.log(data)
  return data;
})



function initD3(places) {

// Reference to tutorial I followed https://www.youtube.com/watch?v=Qw6uAg3EO64&t=41s


  const svg = select('svg');
  const projection = geoMercator();
  const pathGenerator = geoPath().projection(projection);
  const g = svg.append('g');

  // Config

  const legendLineheight = 18;


  // Data

  const cats = places.map((entry) => {
    return entry.typeLabel.value;
  });

  console.log(cats)


  const colorscale = d3.scaleOrdinal()
    .domain(cats)
    .range(d3.schemeCategory10);

  g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({
      type: 'Sphere'
    }))


  svg.call(zoom().on('zoom', () => {
    g.attr('transform', event.transform);
  }));


  // Legend: https://vizhub.com/Razpudding/921ee6d44b634067a2649f738b6a3a6e

  const legendWrapper = svg.append('g')
    .attr("class", "legend-group");

  legendWrapper.append("rect")
    .attr("x", 5)
    .attr("class", "legend-wrapper");


  const legend = legendWrapper.selectAll(".legend")
    .data(colorscale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })


  legend.append("rect")
    .attr("x", 185 - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorscale);

  legend.append("text")
    .attr("x", 185 - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("class", "legend-text")

    .text(function (d) {
      return d;
    });

  legendWrapper
    .style("transform", "translate(-200px, 203px)");
  legendWrapper
    .transition().duration(2000)
    .style("transform", "translate(10px, 203px)");


  Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
  ]).then(([tsvData, topoJSONdata]) => {
    const countryName = tsvData.reduce((accumulator, row) => {

      accumulator[row.iso_n3] = row.name;

      return accumulator;
    }, {});



    const country = feature(topoJSONdata, topoJSONdata.objects.countries);
    g.selectAll('path')
      .data(country.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', d => pathGenerator(d))
      .append('title')
      .text(d => countryName[d.id]);

    g.selectAll('circle')
      .data(places)
      .enter().append("circle")
      .attr("r", 1)
      .attr("transform", function (d) {


        return "translate(" + projection([
          d.long.value,
          d.lat.value
        ]) + ")";
      })
      .style('fill', function (d) {

        return colorscale(d.typeLabel.value)
      })
      .append('text')
      .text(d => d.title.value)

  });

}