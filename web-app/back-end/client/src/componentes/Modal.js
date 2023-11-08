import React from 'react';
import styled from 'styled-components';

const Modal =({
    children,
    estado,
    cambiarEstado,
    titulo,
    mostarOverlay
}) => {
    return(
    <>
        {estado && 
            <Overlay mostarOverlay={mostarOverlay}>
                <ContenedorModal>
                    <EncabezadoModal>
                        <h3>{titulo}</h3>
                    </EncabezadoModal>

                    <BotonCerrar onClick={()=>cambiarEstado(false)}> X</BotonCerrar>
                    {children}
                </ContenedorModal>
            </Overlay> 
        }   
        
    </>

    );
}
export default Modal;

const Overlay=styled.div`
width:100vw;
height: 100vh;
position: fixed;
top 0;
left 0;
background: ${props => props.mostarOverlay ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0)'};

padd  ing:40px;
display:flex;
align-items:center;
justify-content:center;
`;
const ContenedorModal=styled.div`
width: 500px;
min-height: 100px;
background: #fff;
position:relative;
border-radius: 5px;
box-shadow:rgba(100,100,111,.2) 0px 7px 29px 0px;
padding: 10px;


`;
const EncabezadoModal= styled.div`

display:flex;
align-items:center;
justify-content: space-between;
margin-botton:20px;
border-bottom:20px;
padding-bottom:20px;
border-bottom:1px solid #E8E9E8;
h3{
    font-weight:500;
    font-size: 16px;
    
}


`;
const BotonCerrar=styled.div`

position :absolute;
top:20px;
right:20px;

width:30px;
height:30px;
border:none;
background:none;
cursor:pointer;
transition=.3s ease all;
corder-radius: 5px;

&:hover{
    background: #f2f2f2;
}

`;