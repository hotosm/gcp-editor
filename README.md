# Ground Control Point Editor

## Project Goals

- Load TIFF imagery, either via COG URL, or uploading a file.
- Load GCP coordinates from a file.
- Pinpoint on the tiff imagery exactly where the GCPs are located.
- Output a GCP `.txt` file for use in ODM and other tools (this file
  links real world coordinates to x/y pixel coordinates on an image).

## Implementation

- The most suitable candidate for this is a Web Component.
- A Web Component can be standalone, easily embedded anywhere on the web.
- Ideally we can use [geotiff.js](https://github.com/geotiffjs/geotiff.js)
  to load the file directly, do a bit of maths, and get what we need.
- If this is complex, we may need to pull in a mapping library:
  - OpenLayers: has native support for COG, plus raster reprojection.
    - Example implementation: https://github.com/geotiffjs/cog-explorer
  - MapLibre: has a new
    [COG protocol extension](https://github.com/geomatico/maplibre-cog-protocol),
    but only supports EPSG:3857.

Related forum post that will influence our decisions here:
https://community.opendronemap.org/t/passing-different-output-projections-to-odm-eg-a-proj-flag/22460

## Final Step

- In the end we have the GCP `.txt` file and all photos in EPSG:4326 projection.
- These files are sent to NodeODM for processing via ODM 'split merge' mode.
- ODM decides on best way to divide up the photos for efficient processing.
- The GCPs are used to georeference the images.
- The images are combined into one large orthomosaic.