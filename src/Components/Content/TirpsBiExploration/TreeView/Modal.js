import React, { useState } from 'react';
import TirpMatrix from './TirpMatrix';
import { Modal, Button } from 'react-bootstrap';

const RelationsMatrixModal = (props) => {
	const [modalShow, setModalShow] = useState(false);

	const handleClose = () => setModalShow(false);
	const handleShow = () => setModalShow(true);

	return (
		<div>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<Button onClick={handleShow} disabled={props.tirp.size === 1}>
					Relations Matrix
				</Button>
			</div>
			<Modal className='my-modal' show={modalShow}>
				<Modal.Body>
					<TirpMatrix tirp={props.tirp} symbolsToNames={props.symbolsToNames} />
				</Modal.Body>
				<Modal.Footer className='my-modal-footer'>
					<Button
						style={{ marginRight: '40%', marginTop: '3%' }}
						variant='secondary'
						onClick={handleClose}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default RelationsMatrixModal;
