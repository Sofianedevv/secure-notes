// Vérifier si l'utilisateur est connecté
async function checkAuth() {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='));
            
        if (token) {
            console.log('Token trouvé, vérification...');
            const response = await fetch('/auth/check', {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                console.log('Token valide, redirection...');
                window.location.href = '/notes';
            } else {
                console.log('Token invalide');
            }
        } else {
            console.log('Aucun token trouvé');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
    }
}

document.addEventListener('DOMContentLoaded', checkAuth); 