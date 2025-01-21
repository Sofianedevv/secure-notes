class PreferencesService {
    static init() {
        window.addEventListener('load', () => {
            const prefs = StorageService.getUserPreferences();
            this.applyPreferences(prefs);
        });

        const modal = document.getElementById('preferencesModal');
        const closeButtons = modal.querySelectorAll('[data-close-modal]');
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal());
        });

        const form = document.getElementById('preferencesForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePreferences();
        });
    }

    static openModal() {
        const modal = document.getElementById('preferencesModal');
        const prefs = StorageService.getUserPreferences();
        
        document.getElementById('theme').value = prefs.theme;
        document.getElementById('fontSize').value = prefs.fontSize;
        document.getElementById('autoSave').checked = prefs.autoSave;
        
        modal.classList.add('show');
    }

    static closeModal() {
        const modal = document.getElementById('preferencesModal');
        modal.classList.remove('show');
    }

    static savePreferences() {
        const prefs = {
            theme: document.getElementById('theme').value,
            fontSize: document.getElementById('fontSize').value,
            autoSave: document.getElementById('autoSave').checked
        };
        
        StorageService.saveUserPreferences(prefs);
        this.applyPreferences(prefs);
        
        NotificationService.success('Préférences sauvegardées');
        this.closeModal();
    }

    static applyPreferences(prefs) {
        document.body.setAttribute('data-theme', prefs.theme);
        document.body.style.fontSize = this.getFontSize(prefs.fontSize);
    }

    static getFontSize(size) {
        const sizes = {
            small: '14px',
            normal: '16px',
            large: '18px'
        };
        return sizes[size] || sizes.normal;
    }
} 