## Functional programming - Weapon datavis

![alt text](https://github.com/TomasS666/functional-programming/blob/master/wiki/weaponized-world.png "Logo Title Text 1")

## Description
Data visualation demo for the NMVW and cleanup pattern for the NMVW API data.

## Concept
See a complete view on weapons and weaponparts their functions on a worldwide scale. The locations represent the location of heritage or the location where the object was found.

## Installation steps
You can clone this repository by using the command ``` git clone ``` in your CLI.
Or you can just push the green button right on the top of this page and download the repo as a zip file.

## Features
- Datavisualisation in d3
- Functional data fetch and transform pattern
- Cleaning pattern for language column student survey data

## Demo Datavis
[Find it here!](https://tomass666.github.io/functional-programming/)

## Data I'm fetching
```sql

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
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
```

## Variabelen
Ik haal met de bovenstaande query objecten op met de volgende properties:

**title : is vanzelfsprekend de titel van het object**

**typeLabel: is de functie van het wapen, bijv. ceremonieel.**

**Lat en long: coördinaten (niet DMS format)**

**choCount : het aantal van het object (eigenlijk niet nodig)**

**plaats: deeplink naar plaats**

## Credits
Eyob voor alle tips rondom het chainen van mijn functies.
Laurens voor de voorbeelden, vooral de legend in d3 en de runquery die ik als basis heb gebruikt.
Ramon voor alle feedback op mijn wiki, het helpen met d3 en het deployen. 
Robert voor de mental support en de tips voor de cleanup pattern.
Voor het plotten van cirlces op de map: [link](http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6)

[Curran Kelleher](https://www.youtube.com/channel/UCSwd_9jyX4YtDYm9p9MxQqw) voor alle tutorials en een beter begrip van D3 door het wat luchtiger te maken.
