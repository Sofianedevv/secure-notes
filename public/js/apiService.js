class ApiService {
    static async fetchWithAuth(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                credentials: 'same-origin'
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                if (response.status === 401) {
                    window.location.href = '/auth/login';
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                }
                throw new Error('Réponse invalide du serveur');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    static async createNote(noteData) {
        return await this.fetchWithAuth('/notes', {
            method: 'POST',
            body: JSON.stringify(noteData)
        });
    }

    static async updateNote(id, noteData) {
        return await this.fetchWithAuth(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(noteData)
        });
    }

    static async deleteNote(id) {
        return await this.fetchWithAuth(`/notes/${id}`, {
            method: 'DELETE'
        });
    }

    static async login(credentials) {
        return await this.fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async register(userData) {
        return await this.fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async logout() {
        return await this.fetchWithAuth('/auth/logout', {
            method: 'POST'
        });
    }
} 