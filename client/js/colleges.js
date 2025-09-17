function mapPercentageToStream(p){
  if (p >= 80) return 'Computer Science';
  if (p >= 60) return 'Healthcare';
  if (p >= 40) return 'Design';
  return 'General';
}

(function initRecommendedStream(){
  const v = localStorage.getItem('quizPercentage');
  const recSpan = document.getElementById('recommendedStream');
  const input = document.getElementById('streamInput');
  if (!recSpan) return;
  if (v) {
    const p = Number(v);
    const stream = mapPercentageToStream(p);
    recSpan.textContent = `Recommended stream: ${stream} (based on quiz score ${p}%)`;
    if (input && !input.value) input.value = stream;
  } else {
    recSpan.textContent = 'No quiz score found. You can type a stream filter above.';
  }
})();

let mapInstance = null;

async function doSearch(){
  const stream = document.getElementById('streamInput').value.trim();
  const onlyGovt = document.getElementById('onlyGovt').checked;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const params = new URLSearchParams({ lat, lng, onlyGovt: String(onlyGovt) });
      if (stream) params.append('stream', stream);

      const res = await apiRequest(`/colleges/nearby?${params.toString()}`);

      if (!mapInstance) {
        mapInstance = L.map("map").setView([lat, lng], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapInstance);
      } else {
        mapInstance.setView([lat, lng], 12);
        // clear markers by resetting the map layer (simple approach: remove and re-add base layer)
        mapInstance.eachLayer((layer) => {
          if (layer instanceof L.Marker) mapInstance.removeLayer(layer);
        });
      }
      L.marker([lat, lng]).addTo(mapInstance).bindPopup('You are here');

      const list = document.getElementById('collegeList');
      list.innerHTML = '';

      res.forEach(c => {
        const [lngC, latC] = c.location.coordinates;
        const marker = L.marker([latC, lngC]).addTo(mapInstance)
          .bindPopup(`<b>${c.name}</b><br>${c.city}, ${c.state}`);

        const item = document.createElement('div');
        item.style.padding = '8px';
        item.style.borderBottom = '1px solid #333';
        item.innerHTML = `
          <b>${c.name}</b><br>
          ${c.city}, ${c.state} — <i>${c.type}</i><br>
          Courses: ${(c.courses || []).map(x => x.name).join(', ') || 'N/A'}
        `;
        item.addEventListener('click', () => {
          marker.openPopup();
          mapInstance.setView([latC, lngC], 14);
        });
        list.appendChild(item);
      });
      resolve();
    });
  });
}

document.getElementById("findColleges").addEventListener("click", () => {
  doSearch();
});

// Auto-search once using recommended stream if present
window.addEventListener('load', () => {
  const v = localStorage.getItem('quizPercentage');
  if (v) doSearch();
});
