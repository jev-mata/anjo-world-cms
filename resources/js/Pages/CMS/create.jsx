import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateContent() {

    const [newTitle, setNewTitle] = useState("");
 


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/submit-data", formData);
          setMessage(res.data.message);
        } catch (err) {
          console.error(err.response?.data || err);
          setMessage("Error submitting data");
        }
      };
    
    return (
        <div  style={{
 
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.56)',
            height:'100%',
            maxHeight: '90vh'
        }}>
            
        </div>
    );
}
