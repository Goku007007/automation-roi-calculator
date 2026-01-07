import { useState, useEffect, useCallback } from 'react';
import {
    getProjects,
    saveProjectAPI,
    updateProjectAPI,
    deleteProjectAPI
} from '../utils/api';

const STORAGE_KEY = 'roi-projects';

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [useBackend, setUseBackend] = useState(true);

    // Load projects on mount - try backend first, fall back to localStorage
    useEffect(() => {
        async function loadProjects() {
            setIsLoading(true);

            // Try backend first
            const backendProjects = await getProjects();
            if (backendProjects !== null) {
                setProjects(backendProjects);
                setUseBackend(true);
                setIsLoading(false);
                return;
            }

            // Fall back to localStorage
            setUseBackend(false);
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setProjects(JSON.parse(stored));
                }
            } catch (err) {
                console.error('Failed to load projects from localStorage:', err);
            }
            setIsLoading(false);
        }

        loadProjects();
    }, []);

    // Save to localStorage as backup cache
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            } catch (err) {
                console.error('Failed to cache projects to localStorage:', err);
            }
        }
    }, [projects, isLoading]);

    const saveProject = useCallback(async (project) => {
        const projectData = {
            name: project.inputs.process_name || 'Untitled Project',
            inputs: project.inputs,
            results: project.results,
            scenarios: { base: { inputs: project.inputs, results: project.results } },
        };

        // Try backend first
        if (useBackend) {
            const saved = await saveProjectAPI(projectData);
            if (saved) {
                setProjects(prev => [saved, ...prev]);
                return saved.id;
            }
        }

        // Fall back to local-only save
        const id = crypto.randomUUID();
        const newProject = {
            id,
            ...projectData,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        };
        setProjects(prev => [newProject, ...prev]);
        return id;
    }, [useBackend]);

    const updateProject = useCallback(async (id, updates) => {
        // Find current project to merge updates
        const current = projects.find(p => p.id === id);
        if (!current) return;

        const merged = {
            name: updates.name ?? current.name,
            inputs: updates.inputs ?? current.inputs,
            results: updates.results ?? current.results,
            scenarios: updates.scenarios ?? current.scenarios,
        };

        // Try backend first
        if (useBackend) {
            const updated = await updateProjectAPI(id, merged);
            if (updated) {
                setProjects(prev => prev.map(p => p.id === id ? updated : p));
                return;
            }
        }

        // Fall back to local-only update
        setProjects(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, ...merged, updated: new Date().toISOString() }
                    : p
            )
        );
    }, [useBackend, projects]);

    const deleteProject = useCallback(async (id) => {
        // Try backend first
        if (useBackend) {
            const result = await deleteProjectAPI(id);
            if (result) {
                setProjects(prev => prev.filter(p => p.id !== id));
                return;
            }
        }

        // Fall back to local-only delete
        setProjects(prev => prev.filter(p => p.id !== id));
    }, [useBackend]);

    const duplicateProject = useCallback(async (id) => {
        const original = projects.find(p => p.id === id);
        if (!original) return null;

        const duplicateData = {
            name: `${original.name} (Copy)`,
            inputs: original.inputs,
            results: original.results,
            scenarios: original.scenarios,
        };

        // Try backend first
        if (useBackend) {
            const saved = await saveProjectAPI(duplicateData);
            if (saved) {
                setProjects(prev => [saved, ...prev]);
                return saved.id;
            }
        }

        // Fall back to local-only duplicate
        const newId = crypto.randomUUID();
        const duplicate = {
            id: newId,
            ...duplicateData,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        };
        setProjects(prev => [duplicate, ...prev]);
        return newId;
    }, [useBackend, projects]);

    const getProject = useCallback((id) => {
        return projects.find(p => p.id === id) || null;
    }, [projects]);

    return {
        projects,
        isLoading,
        useBackend,
        saveProject,
        updateProject,
        deleteProject,
        duplicateProject,
        getProject,
    };
}
