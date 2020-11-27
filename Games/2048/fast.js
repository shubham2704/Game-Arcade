function deltaToDirection(dx, dy) {
	let delta = [dx, dy];

	let minAbsIndex;
	let [dxAbs, dyAbs] = delta.map(Math.abs);
	if (dxAbs < dyAbs) minAbsIndex = 0;
	else minAbsIndex = 1;
	delta[minAbsIndex] = 0;

	delta = delta.map(Math.sign);

	return signDeltaToDirection(...delta);
}
