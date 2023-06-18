import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function MyToolTip({ icon, tip }) {
	const renderTooltip = (props) => {
		delete props.show;
		return <Tooltip {...props}>{tip}</Tooltip>;
	};

	return (
		<OverlayTrigger placement='right' overlay={renderTooltip}>
			<i className={`fas ${icon} ml-2`} />
		</OverlayTrigger>
	);
}

export function SimpleOverlayTrigger({ tip, children, placement = 'right', show = true }) {
	const renderTooltip = (props) => {
		delete props.show;
		return <Tooltip {...props}>{tip}</Tooltip>;
	};
	if (!show) {
		return children;
	}
	return (
		<OverlayTrigger placement={placement} overlay={renderTooltip}>
			{children}
		</OverlayTrigger>
	);
}
