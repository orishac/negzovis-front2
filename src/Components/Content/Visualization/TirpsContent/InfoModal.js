import React, {useState} from "react"
import { useEffect } from "react"
import SelectedTIRPTable from './SelectedTIRPTable';
import {Button} from 'react-bootstrap';


const InfoModal = (props) => {
    const [modal, setModal] = useState(false)
    const [navbar, setNavBar] = useState([])
    const createNavBar = (Navbar) => {
        const lst = [...Navbar].map((tirp, idx) => (
			<div className=' m-0'>
					{tirp._TIRP__symbols.map((object, i) => {
                        return  (
							<div className='m-0'>
						<button className='btn btn-workflow btn-arrow-right navbar-margin' style={{width:"90%"}} id={'Info'} key={i}>{object}</button>
						</div>)
                    })}
			</div>
		));
        return lst
    }

    useEffect(()=>{
        setNavBar(createNavBar(props.Navbar))
    },[])
    return (
        <>
        <Button onClick={() => setModal(!modal)} style={{height: '50px'}} variant='primary' className='btn-modal'>Info</Button>
        {modal && (
            <div className="Info-modal">nfo-
                <div className="overlay" onClick={() => setModal(!modal)}></div>
                <div className="modal-content">
                    <Button className="close-modal" variant='primary' onClick={() => setModal(!modal)}>X</Button>
                    <table>
                        <tr>
                            <td>
                                {navbar}
                            </td>
                            <td>
                            <SelectedTIRPTable
									table={props.table}
									type_of_comp={props.type_of_comp}
								></SelectedTIRPTable>
                            </td>
                        </tr>
                    </table>
                    
                </div>
            </div>
        )}
        

        </>
    )
}
export default InfoModal