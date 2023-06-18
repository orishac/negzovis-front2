import React from 'react';
import cookies from 'js-cookie';

import DropzoneComponent from '../../ReactDropZone/ReactDropzone';

const FileUploader = ({ onUpload, acceptedFiles = '.csv', title }) => {
	const componentConfig = {
		iconFiletypes: ['.csv'],
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
		// addRemoveLinks: true,
		// parallelChunkUploads: true,
		// retryChunks: true,
		// previewTemplate: ReactDOMServer.renderToStaticMarkup(
		// 	<div className='dz-preview dz-file-preview'>
		// 		<div className='dz-details'>
		// 			<div className='dz-filename'>
		// 				<span data-dz-name='true'></span>
		// 			</div>
		// 		</div>
		// 		<div className='dz-progress'>
		// 			<span className='dz-upload' data-dz-uploadprogress='true'></span>
		// 		</div>
		// 		<div className='dz-success-mark'>
		// 			<span>✔</span>
		// 		</div>
		// 		<div className='dz-error-mark'>
		// 			<span>✘</span>
		// 		</div>
		// 		<div className='dz-error-message'>
		// 			<span data-dz-errormessage='true'></span>
		// 		</div>
		// 	</div>
		// ),
		// autoProcessQueue: false
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
export default FileUploader;
