import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Issues() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');

  // Fetch project name on mount
  useEffect(() => {
    fetch(`/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjectName(data.name || ''))
      .catch(console.error);
  }, [projectId, token]);

  // Load issues
  const load = () => {
    fetch(`/projects/${projectId}/issues/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setIssues)
      .catch(console.error);
  };

  useEffect(load, [projectId, token]);

  const createIssue = async e => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(
      `/projects/${projectId}/issues/?title=${encodeURIComponent(title)}&status=open`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setTitle('');
    load();
  };

  const toggleStatus = async issue => {
    const newStatus = issue.status === 'open' ? 'closed' : 'open';
    await fetch(
      `/projects/${projectId}/issues/${issue.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      }
    );
    load();
  };

  const deleteIssue = async id => {
    if (!window.confirm('Delete this issue?')) return;
    await fetch(
      `/projects/${projectId}/issues/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    load();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const back = () => navigate('/projects');

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-2xl px-8 py-10 bg-neutral-900/90 border border-neutral-800 shadow-2xl rounded-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100 font-mono">
            Issues for Project{' '}
            <span className="text-blue-400">
              {projectName || <span className="text-neutral-400">...</span>}
            </span>
          </h1>
          <button
            onClick={logout}
            className="text-sm px-4 py-1 text-red-500 border border-red-700 rounded hover:bg-red-900/40 transition"
          >
            Logout
          </button>
        </header>

        <button
          onClick={back}
          className="mb-7 px-4 py-2 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded font-mono text-xs hover:bg-neutral-700 transition"
        >
          ← Back to Projects
        </button>

        <ul className="space-y-3 mb-7">
          {issues.map(i => (
            <li
              key={i.id}
              className="px-5 py-4 bg-neutral-800/80 border border-neutral-700 rounded flex justify-between items-center shadow hover:border-blue-600 transition"
            >
              <span className="font-mono text-neutral-100 text-base">{i.title}</span>
              <div className="flex gap-2 items-center ml-4">
                <button
                  onClick={() => toggleStatus(i)}
                  className={`px-2 py-1 rounded font-mono text-xs ${
                    i.status === 'open'
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'
                  } transition`}
                >
                  Mark {i.status === 'open' ? 'Closed' : 'Open'}
                </button>
                <button
                  onClick={() => deleteIssue(i.id)}
                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-mono text-xs hover:bg-red-500/40 transition"
                >
                  Delete
                </button>
                <span
                  className={
                    i.status === 'closed'
                      ? 'text-red-400 font-semibold ml-2 text-xs'
                      : 'text-green-400 font-semibold ml-2 text-xs'
                  }
                >
                  {i.status}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={createIssue} className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
            placeholder="New issue title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
          >
            Add Issue
          </button>
        </form>
      </div>
    </div>
  );
}
