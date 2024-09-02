import React, { useState ,useEffect} from 'react'

const Todo = () => {
    const [title, setTitle] = useState("")
    const [description , setDescription] = useState("")
    const [todos, setTodos] = useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState('')
    const [editID, setEditID] = useState(-1)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription , setEditDescription] = useState("")
    const apiURL = "http://localhost:3001"
    const handleSubmit = () =>{
        setError("")
        if(title.trim !== '' && description.trim !== ''){
            fetch(apiURL+"/new",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title, description})
            }).then((res)=>{
                if(res.ok){
                    setTodos([...todos, {title, description}])
                    setTitle('')
                    setDescription('')
                    setMessage("Item added successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                }else{
                    setError("Unable to create todo item")
                }
            }).catch(()=>{
                setError("Unable to create todo item")
            }) 
        }
        
    }
    useEffect(()=>{
            getItems()
        },[])

    const getItems =()=>{
        fetch(apiURL+'/new').then((res)=> res.json()).then((res)=>{
            setTodos(res)
            // console.log(res)
        })
    }
    const handleEdit = (items) =>{
        setEditID(items._id)
        setEditTitle(items.title)
        setEditDescription(items.description)
    }
    const handleEditCancel = ()=>{
        setEditID(-1)
    }
    const handleUpdate = () =>{
        setError("")
        if(editTitle.trim !== '' && editDescription.trim !== ''){
            fetch(apiURL+"/new/"+editID,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: editTitle, description: editDescription})
            }).then((res)=>{
                if(res.ok){
                    const updatedTodos = todos.map((items)=>{
                        if(items._id === editID){
                            items.title = editTitle
                            items.description = editDescription
                        }
                        return items
                    })
                    setTodos(updatedTodos)
                    setEditTitle('')
                    setEditDescription('')
                    setMessage("Item updated successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                    setEditID(-1)
                }else{
                    setError("Unable to create todo item")
                }
            }).catch(()=>{
                setError("Unable to create todo item")
            }) 
        }
    }
    const handleDelete = (id) =>{
        if(window.confirm("Press confirm button to delete")){
            fetch(apiURL+"/new/"+id,{
                method: "DELETE"
            })
            .then(()=>{
                const updatedTodos = todos.filter((items)=> items._id!==id)
                setTodos(updatedTodos)
            })
        }
    }
  return (
    <div>
        <div className='row p-3 text-light bg-success'>
            <h1>MERN Todo App Project</h1>
        </div>
        <div className='row'>
            <h3>create</h3>
            
            <div className='form-group d-flex gap-3'>
                <input placeholder='Title' onChange={(e)=> setTitle(e.target.value)} value={title} className='form-control' type="text" />
                <input placeholder='Description' onChange={(e)=> setDescription(e.target.value)} value={description} className='form-control' type="text" />
                <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
            </div>
            {message && <p className="text-success">{message}</p>}
            { error && <p className='text-danger'>{error}</p>}
        </div>
        <div>
            <h3 className='row mt-3' >Tasks</h3>
            <ul className='list-group'>
                {todos.map((items)=>
                    <li className='list-group-item d-flex justify-content-between bg-info align-items-center my-2'>
                    <div className='d-flex flex-column me-2'>
                        {editID === -1 || editID !== items._id ? <><span className='fw-bold'> {items.title} </span>
                        <span>{items.description}</span></>
                    :  <> <div className='form-group d-flex gap-3'>
                    <input placeholder='Title' onChange={(e)=> setEditTitle(e.target.value)} value={editTitle} className='form-control' type="text" />
                    <input placeholder='Description' onChange={(e)=> setEditDescription(e.target.value)} value={editDescription} className='form-control' type="text" />
                </div> </>
                    }
                    </div>
                    <div className='d-flex gap-2'>
                    {editID === -1 || editID !== items._id ? <><button className="btn btn-warning" onClick={()=>handleEdit(items)}>Edit</button>
                    <button className='btn btn-danger' onClick={()=>handleDelete(items._id)}>Delete</button> </>:<><button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                        <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button></>}
                    </div>
                    
                </li>
                )}
            </ul>
        </div>
    </div>
  )
}

export default Todo