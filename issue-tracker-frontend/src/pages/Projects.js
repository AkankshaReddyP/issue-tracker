import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const token = localStorage.getItem('token');

  const load = () => {
    fetch('/projects/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProjects)
      .catch(console.error);
  };

  useEffect(load, [token]);

  const createProject = async e => {
    e.preventDefault();
    if (!newName.trim()) return;
    await fetch(`/projects/?name=${encodeURIComponent(newName)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewName('');
    load();
  };

  const startEdit = project => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const saveEdit = async id => {
    if (!editingName.trim()) return;
    await fetch(`/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: editingName })
    });
    setEditingId(null);
    setEditingName('');
    load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const deleteProject = async id => {
    if (!window.confirm("Delete this project?")) return;

    const res = await fetch(`/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 204) {
      load();
    } else if (res.status === 400) {
      const { detail } = await res.json();
      alert(detail);
    } else {
      alert(res.statusText || "Error deleting project");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-2xl px-8 py-10 bg-neutral-900/90 border border-neutral-800 shadow-2xl rounded-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100 font-mono">Projects</h1>
          <button
            onClick={logout}
            className="text-sm px-4 py-1 text-red-500 border border-red-700 rounded hover:bg-red-900/40 transition"
          >
            Logout
          </button>
        </header>

        {/* Create form */}
        <form onSubmit={createProject} className="mb-6 flex gap-2">
          <input
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
            placeholder="New project name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
          >
            Add
          </button>
        </form>

        {/* Project list */}
        <ul className="space-y-3">
          {projects.map(p => (
            <li
              key={p.id}
              className="px-5 py-4 bg-neutral-800/80 border border-neutral-700 rounded flex items-center justify-between shadow hover:border-blue-600 transition"
            >
              <div className="flex-1 font-mono text-neutral-100 text-base">
                {editingId === p.id ? (
                  <input
                    className="bg-neutral-900 px-2 py-1 border-b-2 border-blue-500 text-neutral-100 font-mono text-base w-40 focus:outline-none"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  <span>{p.name}</span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                {editingId === p.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded font-mono text-xs hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded font-mono text-xs hover:bg-neutral-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(p)}
                      className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded font-mono text-xs hover:bg-yellow-500/40 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-mono text-xs hover:bg-red-500/40 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/projects/${p.id}/issues`)}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-xs hover:bg-blue-500/40 transition"
                    >
                      Issues
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
