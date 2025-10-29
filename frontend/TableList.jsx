import axios from "axios";
import { useEffect,useState } from "react";


export default function TableList({handleOpen, tableData, setTableData, searchTerm}){

  const [error,setError] = useState(null);

  const filteredData = tableData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleToggleStatus = async (id, currentStatus) => {
    try {
        // Find the client
        const clientToUpdate = tableData.find(client => client.id === id);
        
        // Create the full updated client object that backend expects
        const updatedClient = {
            name: clientToUpdate.name,
            email: clientToUpdate.email,
            job: clientToUpdate.job,
            rate: clientToUpdate.rate,
            isactive: !currentStatus  // This is what changes
        };
        
        // Update in backend
        await axios.put(`http://localhost:3000/api/clients/${id}`, updatedClient);
        
        // Update in frontend state - use isActive (camelCase) for UI
        setTableData(prevData => 
            prevData.map(client => 
                client.id === id ? { ...client, isActive: !currentStatus } : client
            )
        );
    } catch (err) {
        setError(err.message);
    }
};

  const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this client?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/clients/${id}`); // API call to delete client
                setTableData((prevData) => prevData.filter(client => client.id !== id)); // Update state
            } catch (err) {
                setError(err.message); // Handle any errors
            }
        }
    };

    return(
        <>

      {error && <div className="alert alert-error">{error}</div>}

        <div className="overflow-x-auto mt-10">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Email</th>
        <th>Job</th>
        <th>Rate</th>
        <th>Active Status</th>
      </tr>
    </thead>
    <tbody className="hover">
      {/* row 1 */}

      {filteredData.map((client, index) => (
        <tr key={client.id}>
        <th>{index+1}</th>
        <td>{client.name}</td>
        <td>{client.email}</td>
        <td>{client.job}</td>
        <td>{client.rate}</td>
        <td>
            <button className={`btn rounded-full w-20 ${client.isActive ? `btn-primary`:`btn-outline btn-primary`}`}
             onClick={() => handleToggleStatus(client.id, client.isActive)}>
                {client.isActive ? 'Active':'Inactive'}
            </button>
        </td>
        <td>
            <button className="btn btn-secondary" onClick={() => handleOpen('edit',client)}>Update</button>
        </td>
                <td>
            <button className="btn btn-accent"  onClick={() => handleDelete(client.id)}>Delete</button>
        </td>
        </tr>
      ))}
        
     
    </tbody>
  </table>
</div>
        </>
    )
}