import React, { useEffect, useState } from "react";

function App() {
    const [originator, setOriginator] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        const [originator] = params.getAll("originator");
        if (originator) {
            setOriginator(originator);
        }
    }, []);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!email || !password) {
            return alert("Must have both a defined email and password!");
        }

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.token) {
                    // redirect user to original page with their token accessible as a query param
                    window.location.href = `${originator}?token=${data.token}`;
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert((error as any).message);
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="display-1 text-center">Central Auth Portal</h1>

            <div className="row justify-content-center">
                <div className="col-12 col-md-7">
                    <form className="bg-light p-3 shadow rounded rounded-3">
                        <label>Email:</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" type="email" />
                        <label>Password:</label>
                        <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" type="password" />
                        <button onClick={handleLogin} className="my-2 btn btn-dark">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
