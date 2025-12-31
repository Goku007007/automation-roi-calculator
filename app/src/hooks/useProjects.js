import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roi-projects';

export function useProjects() {
    const [projects, setProjects] = useState([]);

    // Load projects from LocalStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProjects(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    }, []);

    // Save projects to LocalStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (err) {
            console.error('Failed to save projects:', err);
        }
    }, [projects]);

    const saveProject = (project) => {
        const id = crypto.randomUUID();
        const newProject = {
            id,
            name: project.inputs.process_name || 'Untitled Project',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            inputs: project.inputs,
            results: project.results,
            scenarios: {
                base: { inputs: project.inputs, results: project.results },
            },
        };
        setProjects(prev => [newProject, ...prev]);
        return id;
    };

    const updateProject = (id, updates) => {
        setProjects(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, ...updates, updated: new Date().toISOString() }
                    : p
            )
        );
    };

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const duplicateProject = (id) => {
        const original = projects.find(p => p.id === id);
        if (!original) return null;

        const newId = crypto.randomUUID();
        const duplicate = {
            ...original,
            id: newId,
            name: `${original.name} (Copy)`,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        };
        setProjects(prev => [duplicate, ...prev]);
        return newId;
    };

    const getProject = (id) => {
        return projects.find(p => p.id === id) || null;
    };

    return {
        projects,
        saveProject,
        updateProject,
        deleteProject,
        duplicateProject,
        getProject,
    };
}
