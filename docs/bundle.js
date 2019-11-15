(function (d3$1,topojson) {
    'use strict';

    async function getData(url, query){
        const newQuery = createQuery(url, query);
        const fetch = await fetchData(newQuery, 'json');
        const data = await dataResponse(fetch, toJSON);
        
        return data;
    }

    function createQuery( url, query ){
        return url+"?query="+ encodeURIComponent(query); 
    }

    /* 
        Format is json by default if the developer ommits the format argument
    */

    function fetchData( query, format ){
        // Format is JSON by default unless otherwise stated
        return format ? fetch(`${ query }&format=${ format }`) : fetch(`${ query }`);
    }

    // Data response

    async function dataResponse( fetch, fn ){

        // Await the given fetch promise 
        let response = await fetch;
        
        // if callback function is given use it, call it, else just return the response
        return ( fn ? fn(response) : response );
    }

    // Data parsing / converting

    async function toJSON( response ){
        let jsonData = await response;
        let res = await jsonData.json();

        return res;
    }

    const url ="https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";

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
      console.log(data.results.bindings);
      initD3(data.results.bindings);
      console.log(data);
    	return data;
    }); 



    function initD3(places){

    const svg = d3$1.select('svg');
    const projection = d3$1.geoMercator(); 
    const pathGenerator = d3$1.geoPath().projection(projection);
    const g = svg.append('g');
      
      
    // Data
      
    const cats = places.map((entry) => {
      return entry.typeLabel.value;
    });

                         console.log(cats);

      
    const colorscale = d3.scaleOrdinal()
      .domain(cats)
      .range(d3.schemeCategory10);

    g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({type: 'Sphere'}));

    	
    svg.call(d3$1.zoom().on('zoom', () => {
    		g.attr('transform', d3$1.event.transform);
    }));
     
      
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
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


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

            .text(function(d) { return d; });
      
      legendWrapper
      .style("transform", "translate(-200px, 203px)");
      legendWrapper
      	.transition().duration(2000)
      		.style("transform", "translate(10px, 203px)");


    Promise.all([
      d3$1.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      d3$1.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ]).then(([tsvData, topoJSONdata]) => {
      		const countryName = tsvData.reduce((accumulator, row) => {
            
      			accumulator[row.iso_n3] = row.name;

          		return accumulator;
          }, {});
      

      
    			const country = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
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
              .attr("transform", function(d) {


              return "translate(" + projection([
                d.long.value,
                d.lat.value
              ]) + ")";
              })
            .style('fill', function(d){

              return colorscale(d.typeLabel.value)
            })
      			.append('text')
      			.text(d => d.title.value);
      					
    });

    }

}(d3,topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2ZldGNoRGF0YS5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIGdldERhdGEodXJsLCBxdWVyeSl7XG4gICAgY29uc3QgbmV3UXVlcnkgPSBjcmVhdGVRdWVyeSh1cmwsIHF1ZXJ5KTtcbiAgICBjb25zdCBmZXRjaCA9IGF3YWl0IGZldGNoRGF0YShuZXdRdWVyeSwgJ2pzb24nKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZGF0YVJlc3BvbnNlKGZldGNoLCB0b0pTT04pO1xuICAgIFxuICAgIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVRdWVyeSggdXJsLCBxdWVyeSApe1xuICAgIHJldHVybiB1cmwrXCI/cXVlcnk9XCIrIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeSk7IFxufVxuXG4vKiBcbiAgICBGb3JtYXQgaXMganNvbiBieSBkZWZhdWx0IGlmIHRoZSBkZXZlbG9wZXIgb21taXRzIHRoZSBmb3JtYXQgYXJndW1lbnRcbiovXG5cbmZ1bmN0aW9uIGZldGNoRGF0YSggcXVlcnksIGZvcm1hdCApe1xuICAgIC8vIEZvcm1hdCBpcyBKU09OIGJ5IGRlZmF1bHQgdW5sZXNzIG90aGVyd2lzZSBzdGF0ZWRcbiAgICByZXR1cm4gZm9ybWF0ID8gZmV0Y2goYCR7IHF1ZXJ5IH0mZm9ybWF0PSR7IGZvcm1hdCB9YCkgOiBmZXRjaChgJHsgcXVlcnkgfWApO1xufVxuXG4vLyBEYXRhIHJlc3BvbnNlXG5cbmFzeW5jIGZ1bmN0aW9uIGRhdGFSZXNwb25zZSggZmV0Y2gsIGZuICl7XG5cbiAgICAvLyBBd2FpdCB0aGUgZ2l2ZW4gZmV0Y2ggcHJvbWlzZSBcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaDtcbiAgICBcbiAgICAvLyBpZiBjYWxsYmFjayBmdW5jdGlvbiBpcyBnaXZlbiB1c2UgaXQsIGNhbGwgaXQsIGVsc2UganVzdCByZXR1cm4gdGhlIHJlc3BvbnNlXG4gICAgcmV0dXJuICggZm4gPyBmbihyZXNwb25zZSkgOiByZXNwb25zZSApO1xufVxuXG4vLyBEYXRhIHBhcnNpbmcgLyBjb252ZXJ0aW5nXG5cbmFzeW5jIGZ1bmN0aW9uIHRvSlNPTiggcmVzcG9uc2UgKXtcbiAgICBsZXQganNvbkRhdGEgPSBhd2FpdCByZXNwb25zZTtcbiAgICBsZXQgcmVzID0gYXdhaXQganNvbkRhdGEuanNvbigpO1xuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IHsgZ2V0RGF0YSB9XG5cblxuXG4iLCJpbXBvcnQgeyBnZXREYXRhIH0gZnJvbSAnLi9mZXRjaERhdGEuanMnO1xuXG5pbXBvcnQgeyBzZWxlY3QsIGpzb24sIHRzdiwgZ2VvUGF0aCwgZ2VvTWVyY2F0b3IsIHpvb20sIGV2ZW50LCBzY2FsZSB9IGZyb20gXCJkM1wiO1xuaW1wb3J0IHsgZmVhdHVyZSB9IGZyb20gJ3RvcG9qc29uJztcblxuY29uc3QgdXJsID1cImh0dHBzOi8vYXBpLmRhdGEubmV0d2Vya2RpZ2l0YWFsZXJmZ29lZC5ubC9kYXRhc2V0cy9pdm8vTk1WVy9zZXJ2aWNlcy9OTVZXLTM4L3NwYXJxbFwiO1xuXG5jb25zdCBxdWVyeSA9IGBQUkVGSVggcmRmOiA8aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIz5cblBSRUZJWCBkYzogPGh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvPlxuUFJFRklYIGRjdDogPGh0dHA6Ly9wdXJsLm9yZy9kYy90ZXJtcy8+XG5QUkVGSVggc2tvczogPGh0dHA6Ly93d3cudzMub3JnLzIwMDQvMDIvc2tvcy9jb3JlIz5cblBSRUZJWCBlZG06IDxodHRwOi8vd3d3LmV1cm9wZWFuYS5ldS9zY2hlbWFzL2VkbS8+XG5QUkVGSVggZm9hZjogPGh0dHA6Ly94bWxucy5jb20vZm9hZi8wLjEvPlxuUFJFRklYIHdnczg0OiA8aHR0cDovL3d3dy53My5vcmcvMjAwMy8wMS9nZW8vd2dzODRfcG9zIz5cblBSRUZJWCBnbjogPGh0dHA6Ly93d3cuZ2VvbmFtZXMub3JnL29udG9sb2d5Iz5cblxuIyB0ZWwgZGUgbWF0ZXJpYWFsc29vcnRlbiBiaWogd2FwZW5zXG5TRUxFQ1QgP3RpdGxlID90eXBlTGFiZWwgP2xvbmcgP2xhdCA/cGxhYXRzIChTQU1QTEUoP2NobykgYXMgP2ZpbHRlcmVkKSAgKENPVU5UKD9jaG8pIEFTID9jaG9Db3VudCkgV0hFUkUge1xuICAjIHNlbGVjdGVlciBzb29ydGVuIHdhcGVuc1xuICA8aHR0cHM6Ly9oZGwuaGFuZGxlLm5ldC8yMC41MDAuMTE4NDAvdGVybW1hc3RlcjEyNDQ1PiBza29zOm5hcnJvd2VyID90eXBlIC5cbiAgP3R5cGUgc2tvczpwcmVmTGFiZWwgP3R5cGVMYWJlbCAuXG5cbiAgIyBnZWVmIG9iamVjdGVuIHZhbiBlZW4gc29vcnQgd2FwZW5cbiAgP2NobyBkYzp0aXRsZSA/dGl0bGUuXG4gID9jaG8gZWRtOm9iamVjdCA/dHlwZSAuXG5cdFxuICBcbiAgP3BsYWF0cyBza29zOmV4YWN0TWF0Y2gvd2dzODQ6bGF0ID9sYXQgLiAjXG4gID9wbGFhdHMgc2tvczpleGFjdE1hdGNoL3dnczg0OmxvbmcgP2xvbmcgLlxuXG5cbn1cblxuTElNSVQgMTAwMDBgO1xuXG5cbmdldERhdGEodXJsLCBxdWVyeSkudGhlbihkYXRhID0+IHtcbiAgY29uc29sZS5sb2coZGF0YS5yZXN1bHRzLmJpbmRpbmdzKVxuICBpbml0RDMoZGF0YS5yZXN1bHRzLmJpbmRpbmdzKVxuICBjb25zb2xlLmxvZyhkYXRhKVxuXHRyZXR1cm4gZGF0YTtcbn0pIFxuXG5cblxuZnVuY3Rpb24gaW5pdEQzKHBsYWNlcyl7XG5cbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5jb25zdCBwcm9qZWN0aW9uID0gZ2VvTWVyY2F0b3IoKTsgXG5jb25zdCBwYXRoR2VuZXJhdG9yID0gZ2VvUGF0aCgpLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5jb25zdCBnID0gc3ZnLmFwcGVuZCgnZycpO1xuICBcbi8vIENvbmZpZ1xuICBcbmNvbnN0IGxlZ2VuZExpbmVoZWlnaHQgPSAxODtcbiAgXG4gIFxuLy8gRGF0YVxuICBcbmNvbnN0IGNhdHMgPSBwbGFjZXMubWFwKChlbnRyeSkgPT4ge1xuICByZXR1cm4gZW50cnkudHlwZUxhYmVsLnZhbHVlO1xufSk7XG5cbiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhdHMpXG5cbiAgXG5jb25zdCBjb2xvcnNjYWxlID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgLmRvbWFpbihjYXRzKVxuICAucmFuZ2UoZDMuc2NoZW1lQ2F0ZWdvcnkxMCk7XG5cbmcuYXBwZW5kKCdwYXRoJylcbiAgLmF0dHIoJ2NsYXNzJywgJ3NwaGVyZScpXG4gIC5hdHRyKCdkJywgcGF0aEdlbmVyYXRvcih7dHlwZTogJ1NwaGVyZSd9KSlcblxuXHRcbnN2Zy5jYWxsKHpvb20oKS5vbignem9vbScsICgpID0+IHtcblx0XHRnLmF0dHIoJ3RyYW5zZm9ybScsIGV2ZW50LnRyYW5zZm9ybSk7XG59KSk7XG4gXG4gIFxuICBjb25zdCBsZWdlbmRXcmFwcGVyID0gc3ZnLmFwcGVuZCgnZycpXG4gIFx0LmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZC1ncm91cFwiKTtcbiAgXG4gIGxlZ2VuZFdyYXBwZXIuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgNSlcblx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZC13cmFwcGVyXCIpO1xuXG4gIFxuICBjb25zdCBsZWdlbmQgPSBsZWdlbmRXcmFwcGVyLnNlbGVjdEFsbChcIi5sZWdlbmRcIilcbiAgICAgICAgLmRhdGEoY29sb3JzY2FsZS5kb21haW4oKSlcbiAgICAgICAgLmVudGVyKClcbiAgXHRcdFx0LmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZFwiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgaSAqIDIwICsgXCIpXCI7IH0pXG5cblxuICAgICAgICBsZWdlbmQuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgMTg1IC0gMTgpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTgpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDE4KVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGNvbG9yc2NhbGUpO1xuXG4gICAgICAgIGxlZ2VuZC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCAxODUgLSAyNClcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDkpXG4gICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICBcdFx0XHQuYXR0cihcImNsYXNzXCIsIFwibGVnZW5kLXRleHRcIilcblxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbiAgXG4gIGxlZ2VuZFdyYXBwZXJcbiAgLnN0eWxlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKC0yMDBweCwgMjAzcHgpXCIpO1xuICBsZWdlbmRXcmFwcGVyXG4gIFx0LnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDAwKVxuICBcdFx0LnN0eWxlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDEwcHgsIDIwM3B4KVwiKTtcblxuXG5Qcm9taXNlLmFsbChbXG4gIHRzdignaHR0cHM6Ly91bnBrZy5jb20vd29ybGQtYXRsYXNAMS4xLjQvd29ybGQvNTBtLnRzdicpLFxuICBqc29uKCdodHRwczovL3VucGtnLmNvbS93b3JsZC1hdGxhc0AxLjEuNC93b3JsZC81MG0uanNvbicpXG5dKS50aGVuKChbdHN2RGF0YSwgdG9wb0pTT05kYXRhXSkgPT4ge1xuICBcdFx0Y29uc3QgY291bnRyeU5hbWUgPSB0c3ZEYXRhLnJlZHVjZSgoYWNjdW11bGF0b3IsIHJvdykgPT4ge1xuICAgICAgICBcbiAgXHRcdFx0YWNjdW11bGF0b3Jbcm93Lmlzb19uM10gPSByb3cubmFtZTtcblxuICAgICAgXHRcdHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIH0sIHt9KTtcbiAgXG5cbiAgXG5cdFx0XHRjb25zdCBjb3VudHJ5ID0gZmVhdHVyZSh0b3BvSlNPTmRhdGEsIHRvcG9KU09OZGF0YS5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgICAgIGcuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAgICAgICAuZGF0YShjb3VudHJ5LmZlYXR1cmVzKVxuICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvdW50cnknKVxuICAgICAgICAgIC5hdHRyKCdkJywgZCA9PiBwYXRoR2VuZXJhdG9yKGQpKVxuICAgICAgICAuYXBwZW5kKCd0aXRsZScpXG4gICAgICAgIFx0LnRleHQoZCA9PiBjb3VudHJ5TmFtZVtkLmlkXSk7XG4gIFxuICBcdGcuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICBcdFx0LmRhdGEocGxhY2VzKVxuICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgIC5hdHRyKFwiclwiLCAxKVxuICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHtcblxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgcHJvamVjdGlvbihbXG4gICAgICAgICAgICBkLmxvbmcudmFsdWUsXG4gICAgICAgICAgICBkLmxhdC52YWx1ZVxuICAgICAgICAgIF0pICsgXCIpXCI7XG4gICAgICAgICAgfSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCl7XG5cbiAgICAgICAgICByZXR1cm4gY29sb3JzY2FsZShkLnR5cGVMYWJlbC52YWx1ZSlcbiAgICAgICAgfSlcbiAgXHRcdFx0LmFwcGVuZCgndGV4dCcpXG4gIFx0XHRcdC50ZXh0KGQgPT4gZC50aXRsZS52YWx1ZSlcbiAgXHRcdFx0XHRcdFxufSk7XG5cbn1cbiJdLCJuYW1lcyI6WyJzZWxlY3QiLCJnZW9NZXJjYXRvciIsImdlb1BhdGgiLCJ6b29tIiwiZXZlbnQiLCJ0c3YiLCJqc29uIiwiZmVhdHVyZSJdLCJtYXBwaW5ncyI6Ijs7O0lBQUEsZUFBZSxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O1FBRS9DLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7O0lBRUQsU0FBUyxXQUFXLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtRQUM5QixPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkQ7Ozs7OztJQU1ELFNBQVMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7O1FBRS9CLE9BQU8sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEY7Ozs7SUFJRCxlQUFlLFlBQVksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFOzs7UUFHcEMsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUM7OztRQUczQixTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxHQUFHO0tBQzNDOzs7O0lBSUQsZUFBZSxNQUFNLEVBQUUsUUFBUSxFQUFFO1FBQzdCLElBQUksUUFBUSxHQUFHLE1BQU0sUUFBUSxDQUFDO1FBQzlCLElBQUksR0FBRyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDOztRQUVoQyxPQUFPLEdBQUcs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