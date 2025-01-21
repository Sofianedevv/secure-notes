class StorageService {
    static PREFIX = 'notes_app_';

    static setLocal(key, value) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erreur lors du stockage local:', error);
            return false;
        }
    }

    static getLocal(key) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération du stockage local:', error);
            return null;
        }
    }

    static setSession(key, value) {
        try {
            sessionStorage.setItem(this.PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erreur lors du stockage de session:', error);
            return false;
        }
    }

    static getSession(key) {
        try {
            const item = sessionStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération du stockage de session:', error);
            return null;
        }
    }

    static saveDraftNote(note) {
        return this.setLocal('draft_note', {
            title: note.title,
            content: note.content,
            timestamp: new Date().toISOString()
        });
    }

    static getDraftNote() {
        return this.getLocal('draft_note');
    }

    static clearDraftNote() {
        localStorage.removeItem(this.PREFIX + 'draft_note');
    }

    static saveUserPreferences(prefs) {
        return this.setLocal('user_preferences', prefs);
    }

    static getUserPreferences() {
        return this.getLocal('user_preferences') || {
            theme: 'light',
            fontSize: 'normal',
            autoSave: true
        };
    }

    static addToSearchHistory(term) {
        const history = this.getSearchHistory();
        const updatedHistory = [term, ...history.filter(t => t !== term)].slice(0, 5);
        return this.setLocal('search_history', updatedHistory);
    }

    static getSearchHistory() {
        return this.getLocal('search_history') || [];
    }

    static clearSearchHistory() {
        localStorage.removeItem(this.PREFIX + 'search_history');
    }
} 