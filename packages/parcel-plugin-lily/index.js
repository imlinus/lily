module.exports = bundler => {
	bundler.addAssetType('lily', require.resolve('./asset'))
}
