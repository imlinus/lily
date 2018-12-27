const compiler = require('lily-compiler')
const { Asset } = require('parcel')

class LilyAsset extends Asset {
	constructor (name, pkg, opts) {
		super(name, pkg, opts)
		this.type = 'js'
	}

	async generate () {
		const { js, css } = compiler(this.basename.slice(0, -4), this.contents, process.env.NODE_ENV === 'development')

		let parts = [{
			type: 'js',
			value: js
		}]

		if (css !== null) {
			parts.unshift({
				type: 'css',
				value: css
			})
		}

		return parts
	}
}

module.exports = LilyAsset
