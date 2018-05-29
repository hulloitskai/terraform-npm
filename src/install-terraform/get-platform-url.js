// Terraform download source contants
const TF_ROOT_URI = 'https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_';
const TF_ZIP_URIS = {
	DARWIN: 'darwin_amd64.zip',
	FREEBSD_32: 'freebsd_386.zip',
	FREEBSD_64: 'freebsd_amd64.zip',
	FREEBSD_ARM: 'freebsd_arm.zip',
	LINUX_32: 'linux_386.zip',
	LINUX_64: 'linux_amd64.zip',
	LINUX_ARM: 'linux_arm.zip',
	OPENBSD_32: 'openbsd_386.zip',
	OPENBSD_64: 'openbsd_amd64.zip',
	SOLARIS: 'solaris_amd64.zip',
	WINDOWS_32: 'windows_386.zip',
	WINDOWS_64: 'windows_amd64.zip'
};

/**
 * Notify the user that their platform and architecture isn't compatible with
 *   this package.
 * @param {string} platform
 * @param {string} arch
 */
function notifyIncompatible(platform, arch) {
	console.error(
		`Unfortunately, your platform and architecture (${platform}, ${arch}) ` +
			"isn't currently supported by Terraform. Please uninstall this package."
	);
}

/**
 * Matches an arch string to a 'key postfix' for `TF_ZIP_URIS`.
 * @param {string} arch
 * @param {boolean} isARMcompat
 * @see TF_ZIP_URIS
 */
function matchArchToKeyPostfix(arch, isARMcompat = true) {
	// Match with any of 'matchables' that === 'arch'.
	function archMatch(...matchables) {
		for (const matchable in matchables) {
			if (matchable === arch) return true;
		}
		return false;
	}

	if (archMatch('x32', 'ia32')) return '_32';
	if (arch === 'x64') return '_64';
	if (archMatch('arm', 'arm64') && isARMcompat) return '_ARM';
	throw new Error('arch-not-supported');
}

/**
 * Match the platfrom and arch to a key in `TF_ZIP_URIS`.
 * @param {string} platform
 * @param {string} arch
 * @see TF_ZIP_URIS
 */
function matchPlatformToKey(platform, arch) {
	function errorOut() {
		notifyIncompatible(platform, arch);
		process.exit(10);
	}

	function matchArch(isARMcompat) {
		try {
			return matchArchToKeyPostfix(arch, isARMcompat);
		} catch (err) {
			if (err.message === 'arch-not-supported') errorOut();
			else {
				console.error(
					"An unknown error occurred during 'matchArchToKeyPostfix': " + err.message
				);
				process.exit(11);
			}
		}
	}

	// prettier-ignore
	switch (platform) {
		case 'linux': return 'LINUX' + matchArch();
		case 'darwin':
			if (arch !== 'x64') errorOut();
			else return 'DARWIN';
		case 'freebsd': return 'FREEBSD' + matchArch();
		case 'openbsd': return 'OPENBSD' + matchArch(false);
		case 'sunos':
			if (arch !== 'x64') errorOut();
			else return 'SOLARIS';
		case 'win32': return 'WINDOWS' + matchArch(false);
		default: errorOut();
	}
}

/**
 * Matches a platform to a Terraform zip URI, as defined in `TF_ZIP_URIS`.
 * @param {string} platform
 * @param {string} arch
 * @see TF_ZIP_URIS
 */
async function matchPlatformToUrl(platform, arch) {
	const platformKey = await matchPlatformToKey(platform, arch);
	const platformString = TF_ZIP_URIS[platformKey];
	if (platformString === undefined) {
		console.error(
			`Could not find a download path for the platform '${platform}', the ` +
				`arch '${arch}', and the generated key '${platformKey}'.`
		);
		process.exit(12);
	}
	return TF_ROOT_URI + TF_ZIP_URIS[platformKey];
}

module.exports = matchPlatformToUrl;
