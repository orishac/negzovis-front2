import React ,{useEffect, useState}from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';

const CustomNavBar = (props) => {
	const [chosenSymbol, setChosenSymbol] = useState(props.symbolsToNames[props.centerSymbol]);
	useEffect(() => {
		setChosenSymbol(props.symbolsToNames[props.centerSymbol]);
	  }, [props.centerSymbol]);
	const symbolClicked = (symbolNumer, symbolName)=>{
		setChosenSymbol(symbolName);
		props.newCenterSymbol(symbolNumer);
	}
	const dropDownSymbolsNames = ()=>{
		let dropDownArr = [];
		for(var i=0; i<Object.keys(props.dropDownSymbols).length; i++){
			let symbol = Object.keys(props.dropDownSymbols)[i];
			let symbolName = props.symbolsToNames[symbol];
			let vs = props.dropDownSymbols[symbol];
			dropDownArr.push([symbol, symbolName, vs]);
		}
		var arr = dropDownArr.sort(function(a, b){return (String(a[1])).localeCompare(String(b[1]))});
		return arr;
	}
	return (
		<div className='custom-nav-bar'>
			<div className='w-25'>
				<button
					className='btn btn-arrow-left custom-nav-bar-item'
					onClick={() => props.arrowClicked(true)}
					disabled={props.backDisabled}
				>
					Back
				</button>
			</div>
			<div className='w-25'>
			<CDropdown className="chooseSymbolDrop" style={{width: '100%'}}>
				<CDropdownToggle color='secondary'>
					{chosenSymbol}
				</CDropdownToggle>
				<CDropdownMenu>
					{(dropDownSymbolsNames()).map(([symbolNumber, symbolName, vs])=>{
						return (<CDropdownItem key={symbolNumber} onClick={()=>symbolClicked(symbolNumber, symbolName)}>
									{symbolName + " (VS: " + vs + "%)"}
								</CDropdownItem>
						)
					})}
				</CDropdownMenu>
			</CDropdown>
			</div>
			<div className='w-25'>
				<button
					className='btn btn-arrow-right custom-nav-bar-item'
					onClick={() => props.arrowClicked(false)}
					disabled={props.nextDisabled}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default CustomNavBar;
