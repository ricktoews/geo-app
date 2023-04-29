const { borders } = require('./helpers');


export function getGeoPath(origin, destination) {
	var paths = [];

	var currentPath = 0;
	paths.push([]);

	paths[currentPath].push(origin);

	var minPathLength = 14;
	var SAFETY_NET = 1000000;
	var safety = 0;
	function getBorders(currentCountry) {
		safety++;
		if (safety > SAFETY_NET) return;

		let countryData = borders.find(b => b.country === currentCountry);
		if (!countryData) {
			console.log('Error: no countryData for', currentCountry);
			return;
		}
		let borderingCountries = countryData.borders;

		for (let i = 0, j = borderingCountries.length; i < j; i++) {

			// Processing for "Destination included in current path."
			// If the destination is already in the path...
			if (paths[currentPath].indexOf(destination) !== -1) {

				// If this is now the shortest path found, retain it.
				if (paths[currentPath].length < minPathLength) {
					minPathLength = paths[currentPath].length;
					paths[currentPath + 1] = paths[currentPath].slice(0, paths[currentPath].length - 1);
					//console.log(`Right destination and shortest path ${currentPath}. paths so far`, paths);
					return ++currentPath;

					// Else, if this is not the shortest path found, prepare to reuse it.
				} else {
					//console.log('Right destination but not shortest path; prepare to reuse', paths[currentPath]);
					paths[currentPath] = paths[currentPath].slice(0, paths[currentPath].length - 1);
					return currentPath;
				}
			}
			// Done with processing for "Destination included in current path."

			// Processing for "Current path length exceeds length of shortest path found so far."
			// If current path length exceeds shortest path length so far, prepare to reuse it.
			if (paths[currentPath].length > minPathLength) {
				console.log('Path length exceeds length of shortest; prepare to reuse', paths[currentPath]);
				paths[currentPath] = paths[currentPath].slice(0, paths[currentPath].length - 1);
				return currentPath;
			}
			// Done with processing for "Current path length exceeds length of shortest path found so far."

			// Current path is neither longer than the shortest found, nor does it contain the destination.
			// Get the next current country's next bordering country (bc), and check for it in the current path.
			let bc = borderingCountries[i];
			// If the bordering country isn't the destination, don't add it unless the current path is at least 2 shorter than the minimum.
			if (bc === destination || paths[currentPath].length + 1 < minPathLength) {
				// Bordering country not in current path, so add it.
				if (paths[currentPath].indexOf(bc) === -1) {
					paths[currentPath].push(bc);
					// Then, call getBorders to get the borders for the country just added to the path.
					let p = getBorders(bc);
				}
			}
			// If the above condition failed, it means that:
			// a) the current bordering country is already in the path, and
			// b) the current country is not the destination.
		}

		// If we reached here, we've gone through all the bordering countries and haven't reached the destination.
		// This means backing up a country.
		//console.log('End of getPaths function; about to add', paths[currentPath].slice(0, paths[currentPath].length - 1));
		paths[currentPath] = paths[currentPath].slice(0, paths[currentPath].length - 1);
		return currentPath;
	}

	getBorders(origin);

	var shortestPath = { path: [], length: 100 };
	var reachedDest = paths.filter(p => p[p.length - 1] === destination);

	//console.log('Paths', paths);
	for (let i = 0; i < paths.length; i++) {
		let path = paths[i];
		if (path.length > 0 && path.length < shortestPath.length) {
			shortestPath.path = path;
			shortestPath.length = path.length;
		}
	}

	return shortestPath;
}

