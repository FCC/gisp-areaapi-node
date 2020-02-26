GISP Area API
======
GISP Area API returns area info such as census block, county, state, and market areas based on latitude/longitude input.

## Example Calls
* https://geo.fcc.gov/api/census/area?format=json&lat=38.26&lon=-77.51
* https://geo.fcc.gov/api/census/area?format=json&lat=38:15:30N&lon=77:30:30W
* https://geo.fcc.gov/api/census/block/find?format=json&latitude=36.084737999999994&longitude=-90.79048499999996&showall=true

## Input Formats for Latitude/Longitude
* Decimal - latitude range is [-90 90] where negative indicates south. Longitude range is [-180 180] where negative indicates west.
* Deg:Min:Sec - example 77:30:30W means 77-degree 30-minute and 30-second West; 38:15:30N means 38-degree 15-minute and 30-second North. The last character indicates North (N) or South (S) latitude, or East (E) or West (W) longitude.

## Output Formats
* output format can be json, jsonp, xml (use lower case)
* For Area API, the default output format is json.
* for Block API, the default output is xml.

## Output Content
* The output content for Area API contains block, county, state, and market info.
* The output content for Block API contains block, county, and state info. It does not contain market info.

## System Requirements
* NodeJS and Postgres. 

## Version
* Version 1.0

## Install
* `git clone https://github.com/FCC/gisp-areaapi-node.git`

## Start App
* npm start

## Unit Test
* npm run test

## Code Coverage
* npm run cover

## Linting
* npm run lint

## Lint with fix
* npm run lint-fix

## Contact
* e-mail: maps@fcc.gov




