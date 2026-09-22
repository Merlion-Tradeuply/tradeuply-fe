import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const atlas = require("world-atlas/land-110m.json");
const land = feature(atlas, atlas.objects.land);
const geometry =
  land.type === "FeatureCollection" ? land.features[0]?.geometry : land.geometry;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(scriptDirectory, "..", "data", "world-lines.json");

if (geometry?.type !== "MultiPolygon") {
  throw new Error(`Expected MultiPolygon data, received ${geometry?.type}.`);
}

const rings = geometry.coordinates.flatMap((polygon) => polygon);

await writeFile(outputPath, JSON.stringify({ rings }));
