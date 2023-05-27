(async () => {
	console.log(
		JSON.stringify(await import('../_config').then((m) => m.default))
	);
})().catch((e) => {
	console.error(e);
	process.exit(1);
});
