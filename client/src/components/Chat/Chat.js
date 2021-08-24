import React,{useState,useEffect,useRef} from 'react'
import TextContainer from '../TextContainer/TextContainer';
import queryString from 'query-string'
import {io, Socket} from 'socket.io-client'
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar.js'
import Input from '../Input/Input.js'
import Messages from'../Messages/Messages.js'
let socket;
 const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ENDPOINT='https://socket-chat-app-mk.herokuapp.com'
     useEffect(()=>{
         const {name,room} =  queryString.parse(location.search)
         socket  = io(ENDPOINT);
         setName(name);
         setRoom(room);
         socket.emit('join',{name,room},()=>{
            
         });
         socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
         return ()=>{
             socket.emit('disconnect');
             socket.off(); 
         }


     },[ENDPOINT,Location.search])
     useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message])
        })
     },[messages])
     const sendMessage=(e)=>{
         e.preventDefault();
         console.log("girdi")
        if(message){
            socket.emit('sendMessage',message,()=>setMessage(''))
        }
     } 
    
    return (
        <div className='outerContainer'>
           <div className='container'>
           <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            {/* <input value={message} onChange={(event)=>setMessage(event.target.value)} onKeyPress={(event)=>event.key === 'Enter' ? sendMessage(event):null}></input> */}
           </div>
           <TextContainer users={users}/>
        </div>
    )
}

export  default Chat;