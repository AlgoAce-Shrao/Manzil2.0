const College = require("../models/College");

exports.getNearby = async (req, res) => {
  try {
    const latStr = req.query.lat;
    const lngStr = req.query.lng;
    const radiusStr = req.query.radius || 50000;
    const streamRaw = (req.query.stream || '').trim();
    const onlyGovt = req.query.onlyGovt;

    if (!latStr || !lngStr) return res.status(400).json({ message: "lat/lng required" });

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = parseInt(radiusStr);

    const query = {};
    if (onlyGovt === "true") {
      // Relax: match any case of 'Government'
      query.type = { $regex: /^government$/i };
    }
    if (streamRaw && streamRaw.toLowerCase() !== 'general') {
      query["courses.name"] = { $regex: streamRaw, $options: "i" };
    }

    try {
      const colleges = await College.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distance",
            maxDistance: radius,
            spherical: true,
            query
          }
        }
      ]);
      return res.json(colleges);
    } catch (dbErr) {
      // Fallback to simple mock data if DB not available
      const mocks = [
        {
          name: "Govt. College A",
          city: "Nearby City",
          state: "Local State",
          type: "Government",
          location: { type: "Point", coordinates: [lng + 0.01, lat + 0.01] },
          courses: [{ name: "Computer Science" }, { name: "Mechanical" }]
        },
        {
          name: "Govt. Institute B",
          city: "Nearby City",
          state: "Local State",
          type: "Government",
          location: { type: "Point", coordinates: [lng - 0.015, lat - 0.008] },
          courses: [{ name: "Electrical" }, { name: "Civil" }]
        },
        {
          name: "Private College C",
          city: "Nearby City",
          state: "Local State",
          type: "Private",
          location: { type: "Point", coordinates: [lng + 0.02, lat - 0.005] },
          courses: [{ name: "Computer Science" }]
        }
      ];
      const filtered = mocks.filter(c => {
        if (onlyGovt === "true" && !/^government$/i.test(c.type)) return false;
        if (streamRaw && streamRaw.toLowerCase() !== 'general') {
          if (!(c.courses || []).some(x => new RegExp(streamRaw, 'i').test(x.name))) return false;
        }
        return true;
      });
      return res.json(filtered);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
