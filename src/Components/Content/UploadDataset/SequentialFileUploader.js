import React from 'react';
import cookies from 'js-cookie';

import DropzoneComponent from '../../ReactDropZone/ReactDropzone';

const SequentialFileUploader = ({ onUpload, acceptedFiles = '.ascii', title }) => {
	const componentConfig = {
		iconFiletypes: ['.ascii'],
		showFiletypeIcon: true,
		postUrl: `${window.base_url}/new_upload`,
	};

	const djsConfig = {
		chunking: true,
		acceptedFiles: acceptedFiles,
		forceChunking: true,
		maxFiles: 1,
		headers: {
			'x-access-token': cookies.get('auth-token'),
		},
		maxFilesize: 2048,
		init: function () {
			this.on('maxfilesexceeded', function (file) {
				this.removeAllFiles();
				this.addFile(file);
			});
		},
		chunksUploaded: function (file, done) {
			onUpload(file.upload.uuid);
			done();
		},
	};

	return (
		<DropzoneComponent
			config={componentConfig}
			eventHandlers={{}}
			djsConfig={djsConfig}
			title={title}
		/>
	);
};
export default SequentialFileUploader;
