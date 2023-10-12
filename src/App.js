import logo from './logo.svg';
import './App.css';
import { db } from './firebase';
import { addDoc, collection,doc,getDocs,deleteDoc, updateDoc} from "firebase/firestore"
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [name,setName] = useState("");
  const [record,setRecord] =useState([]);
  const [edit,setEdit] = useState("");

  const tbl = collection(db,"users")
  const getuser = async()=>{
    const data =await getDocs(tbl);
    let ans = data.docs.map((val)=>{
      return ({...val.data(),id:val.id})
    })
    setRecord(ans);
  }

  const handleSubmit =async()=>{
    let insert = await addDoc(tbl,{name:name});
    if(insert){
      alert("record successfully add");
    }else{
      alert("something wrong");
    }
    setName("");
    getuser();
  }

  const deleteData =async(id)=>{
    const userDoc= doc(db,"users",id);
    let res = await deleteDoc(userDoc);

    getuser();
  }

  const editData =(id,name)=>{
    setEdit(id);
    setName(name);
  }

  const handleUpdate =async()=>{
    const userDoc = doc(db,"users",edit);
    const newdata = {name:name};
    await updateDoc(userDoc,newdata);

    setEdit("");
  }

  useEffect(()=>{
    getuser();
  })
  return (
    <center>
    <div className='nav'>
    <h2 className=' text-light p-2 align-items-center w-100'>To Do List</h2>
    </div>
      <div className='container'>
        <div className='row justify-content-center align-items-center'>
        <form class="row g-3 justify-content-center">
        <div class="col-xl-6">
          <input type="text" className="form-control" id="inputPassword2" placeholder="Add to todo... " name='name' onChange={(e)=>setName(e.target.value)} value={name}/>
        </div>
        <div class="col-auto">
          {
            edit ?(<button type="button" class="btn btn-danger mb-3"  onClick={()=>handleUpdate()}>Update</button>)
            :(<button type="button" class="btn btn-danger mb-3"  onClick={()=>handleSubmit()}>Submit</button>)
          }
        </div>
      </form>
        <br></br>
          <div className='col-xl-7 p-4'>
          <table className='table table-dark table-striped tbl'>
            <h2 className='p-3'></h2>
          {
            record.map((v)=>{
              return(
                <tr className='pt-4 pb-5' >
                  <td width="50%" className='text-center table-secondary p-3'>{v.name}</td>
                  <td width="50%" className='text-center table-secondary p-3'><button type="button" className="btn btn-danger mb-3"  onClick={()=>deleteData(v.id)}>Remove</button>---
                  <button type="button" className="btn bg-warning mb-3" onClick={()=>editData(v.id,v.name)}>Update</button></td>
                </tr>
              )
            })
          }
           <h2 className='p-3'></h2>
        </table>
          </div>
        </div>
      </div>
        
    </center>
  );
}

export default App;
