function getNameFromURL (url) {
	return url.substring(url.lastIndexOf('/'));
}

module.exports = getNameFromURL;