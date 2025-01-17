import { useEffect, useState } from "react"
import { baseURL } from "../../config";
import axios from "axios";

export default GroupDetails => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${baseURL}/api/leadGroup/getAllLeadGroups`, config);
            setGroups(response.data.groups || []);
            console.log("Group details :::::>>>>>>", response.data.groups[0].group_id)
            console.log("Group details :::::>>>>>>", response.data.groups[0].group_name)
            console.log("Group details :::::>>>>>>", response.data.groups[0].description)
        } catch (error) {
            console.error("error while fetching group details : ", error);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <>
            <h1>Group Details </h1>
            {
                groups.length === 0 ? (
                    <>
                        <h4>No Groups Found</h4>
                    </>
                ) : (
                    <>
                        {
                            groups.map((group) => {
                                <>
                                    <h1>hello</h1>
                                    <li
                                        key={group.group_id}>
                                        <h1>{group.group_name}</h1>
                                        
                                    </li>
                                </>
                            })
                        }
                    </>
                )
            }

        </>
    )

}