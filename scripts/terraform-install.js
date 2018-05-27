const https = require('https');
const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

// File constants
const TOOLS_DIR = path.join('tools');
const ZIP_DIR = path.join(TOOLS_DIR, 'terraform.zip');

// Terraform download source contants
const TF_ROOT_URI = 'https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_';
const TF_PLATFORM_ZIPS = {
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

function notifyIncompatible(platform, arch) {
  console.error(
    `Unfortunately, your platform and architecture (${platform}, ${arch}) ` +
      "isn't currently supported by Terraform. Please uninstall this package."
  );
}

function mapArchToPostfix(platform, arch, isARMcompat = true) {
  switch (arch) {
    case 'x32':
    case 'ia32':
      return '_32';
    case 'x64':
      return '_64';
    case 'arm':
    case 'arm64':
      if (isARMcompat) return '_ARM';
    default:
      notifyIncompatible(platform, arch);
      process.exit(1);
  }
}

function mapPlatformToKey(platform, arch) {
  function archMapper(isARMcompat) {
    mapArchToPostfix(platform, arch, isARMcompat);
  }
  switch (platform) {
    case 'linux':
      return 'LINUX' + archMapper();
    case 'darwin':
      if (arch !== 'x64') {
        notifyIncompatible(platform, arch);
        process.exit(1);
      }
      return 'DARWIN';
    case 'freebsd':
      return 'FREEBSD' + archMapper();
    case 'openbsd':
      return 'OPENBSD' + archMapper(false);
    case 'sunos':
      if (arch !== 'x64') {
        notifyIncompatible(platform, arch);
        process.exit(1);
      }
      return 'SOLARIS';
    case 'win32':
      return 'WINDOWS' + archMapper(false);
    default:
      notifyIncompatible(platform, arch);
      process.exit(1);
  }
}

function mapPlatformToZip(platform, arch) {
  return TF_ROOT_URI + TF_PLATFORM_ZIPS[mapPlatformToKey(platform, arch)];
}

// Ensure desired download directory exists...
fs.access(TOOLS_DIR, fs.constants.F_OK, function(err) {
  if (err) {
    console.log("'tools/' directory does not exist, creating...");
    fs.mkdir(TOOLS_DIR, function(err) {
      if (err) {
        console.error(`Could not create a 'tools/' directory: ${err}`);
        process.exit(2);
      }
      downloadTerraformZip();
    });
  } else downloadTerraformZip();
});

// Download zipped executable...
function downloadTerraformZip() {
  const zip = fs.createWriteStream(ZIP_DIR);
  const { platform, arch } = process;
  const downloadUri = mapPlatformToZip(platform, arch);
  console.log(`Downloading zipped Terraform executable from ${downloadUri}...`);
  https
    .get(downloadUri, function(response) {
      console.log('Download finished.');
      response.pipe(zip);
      zip.on('finish', function() {
        zip.close(function() {
          unzipTerraform();
        });
      });
    })
    .on('error', function(e) {
      console.error(`Failed to download zipped Terraform executable: ${e}`);
      process.exit(3);
    });
}

// Unzip executable...
function unzipTerraform() {
  console.log('Unzipping downloaded archive...');
  const zip = fs.createReadStream(ZIP_DIR);
  zip.pipe(unzip.Extract({ path: TOOLS_DIR }));
  zip.on('close', function() {
    console.log('Finished unzipping, now removing original zip...');
    unlinkZip();
  });
}

// Remove the temporary file...
function unlinkZip() {
  fs.unlink(ZIP_DIR, function(err) {
    if (err) {
      console.error(`An error occurred while deleting the Terraform zip: ${err}`);
      process.exit(5);
    }
    console.log('Removed temporary downloaded artifacts. Installation completed! 🎉');
  });
}
