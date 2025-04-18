import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./components/DataTable";
import { User } from "./types";
import "./App.css";
import Header from "./components/Header";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios.get("https://dummyjson.com/users").then((res) => {
      const formatted: User[] = res.data.users.map((user: any) => ({
        id: user.id,
        name: `${user.firstName} ${user.maidenName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: Math.random() > 0.5 ? "Active" : "Inactive",
      }));
      setUsers(formatted.slice(0, 50));
    });
  }, []);

  return (
    <> 
    <Header />
    <div className="container">
      <DataTable data={users} />
    </div>

    </>
  );
};

export default App;
