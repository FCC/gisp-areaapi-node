GISP Area API
======
GISP Area API returns area info such as census block, county, state, and market areas based on latitude/longitude input.

## Example Calls
* http://gisp-areaapi-node-dev.us-west-2.elasticbeanstalk.com/area.json?lat=38.26&lon=-77.51
* http://gisp-areaapi-node-dev.us-west-2.elasticbeanstalk.com/area.json?lat=38:15:30N&lon=77:30:30W

## Input Formats for Latituide/Longitude
* Decimal - latitude range is [-90 90] where negative indicates south. Longitude range is [-180 180] where negative indicates west.
* Deg:Min:Sec - example 77:30:30W means 77-degree 30-minute and 30-second West; 38:15:30N means 38-degree 15-minute and 30-second North. The last character indicates North (N) or South (S) latitude, or East (E) or West (W) longitude.

## System Requirements
* NodeJS and Postgres. 

## Version
* Version 1.0

## Contact
* e-mail: maps@fcc.gov




