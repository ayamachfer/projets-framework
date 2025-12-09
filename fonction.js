// Fonction pour afficher une page spécifique
function showPage(pageId) {
    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Afficher la page sélectionnée
    document.getElementById(pageId).classList.add('active');
    
    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Trouver le lien correspondant et l'activer
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.trim() === getPageName(pageId)) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Déclencher les animations au scroll
    triggerScrollAnimations();
    
    // Si c'est l'espace membre et l'utilisateur est connecté, charger les données
    if (pageId === 'page6' && currentUser) {
        loadMemberSpace();
    }
}

// Fonction pour obtenir le nom de la page à partir de l'ID
function getPageName(pageId) {
    const pageNames = {
        'page1': 'Accueil',
        'page2': 'Types de Plantes',
        'page3': 'Entretien',
        'page4': 'Décoration',
        'page5': 'Connexion',
        'page6': 'Mon espace'
    };
    return pageNames[pageId] || '';
}

// Animation des feuilles qui tombent
function createLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf-animation');
    leaf.innerHTML = '🍃';
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.animationDuration = (Math.random() * 5 + 5) + 's';
    leaf.style.fontSize = (Math.random() * 20 + 15) + 'px';
    leaf.style.opacity = Math.random() * 0.3 + 0.1;
    document.body.appendChild(leaf);
    
    // Supprimer la feuille après l'animation
    setTimeout(() => {
        if (leaf.parentNode) {
            leaf.remove();
        }
    }, 10000);
}

// Créer des feuilles périodiquement
function startLeafAnimation() {
    // Créer quelques feuilles au démarrage
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createLeaf(), i * 500);
    }
    
    // Continuer à créer des feuilles
    setInterval(createLeaf, 3000);
}

// Animation au scroll
function triggerScrollAnimations() {
    const elements = document.querySelectorAll('.card, .control-method, .gallery-item');
    elements.forEach(el => {
        const position = el.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// Gestion de la connexion/inscription
let currentUser = null;

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Démarrer l'animation des feuilles
    startLeafAnimation();
    
    // Gérer les animations au scroll
    window.addEventListener('scroll', triggerScrollAnimations);
    
    // Initialiser les animations
    setTimeout(triggerScrollAnimations, 100);
    
    // Gérer le clic sur le logo pour retourner à l'accueil
    document.querySelector('.navbar-brand').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('page1');
    });
    
    // Initialiser l'authentification
    initAuth();
});

// Initialisation des événements de connexion/inscription
function initAuth() {
    // Charger l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('espaceVertUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavForUser();
    }
    
    // Écouteurs pour les formulaires
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    
    // Écouteur pour le formulaire de photo
    document.getElementById('uploadPhotoForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadUserPhoto();
    });
    
    // Toggle visibilité des mots de passe
    document.getElementById('toggleLoginPassword')?.addEventListener('click', function() {
        togglePasswordVisibility('loginPassword', this);
    });
    
    document.getElementById('toggleRegisterPassword')?.addEventListener('click', function() {
        togglePasswordVisibility('registerPassword', this);
    });
}

// Connexion
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const alertDiv = document.getElementById('loginAlert');
    
    // Simuler une vérification
    const users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Connexion réussie
        currentUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            joinDate: user.joinDate || new Date().toISOString(),
            photos: user.photos || []
        };
        
        localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
        updateNavForUser();
        
        alertDiv.classList.add('d-none');
        alertDiv.classList.remove('alert-success');
        alertDiv.textContent = '';
        
        // Rediriger vers l'espace membre
        showPage('page6');
        
        // Afficher notification
        showNotification(`Bienvenue ${user.firstName} ! Accès à votre espace membre.`, 'success');
    } else {
        // Échec de connexion
        alertDiv.textContent = 'Email ou mot de passe incorrect';
        alertDiv.classList.remove('d-none');
        alertDiv.classList.remove('alert-success');
        alertDiv.classList.add('alert-danger');
    }
}

// Inscription
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const alertDiv = document.getElementById('registerAlert');
    const successDiv = document.getElementById('registerSuccess');
    
    // Validation
    if (password !== confirmPassword) {
        alertDiv.textContent = 'Les mots de passe ne correspondent pas';
        alertDiv.classList.remove('d-none');
        return;
    }
    
    if (password.length < 8) {
        alertDiv.textContent = 'Le mot de passe doit contenir au moins 8 caractères';
        alertDiv.classList.remove('d-none');
        return;
    }
    
    // Vérifier si l'utilisateur existe déjà
    let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    if (users.find(u => u.email === email)) {
        alertDiv.textContent = 'Un compte existe déjà avec cet email';
        alertDiv.classList.remove('d-none');
        return;
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        firstName,
        lastName,
        email,
        password,
        joinDate: new Date().toISOString(),
        photos: []
    };
    
    users.push(newUser);
    localStorage.setItem('espaceVertUsers', JSON.stringify(users));
    
    // Afficher succès
    alertDiv.classList.add('d-none');
    successDiv.textContent = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
    successDiv.classList.remove('d-none');
    
    // Réinitialiser le formulaire
    document.getElementById('registerForm').reset();
    
    // Basculer vers la connexion après 3 secondes
    setTimeout(() => {
        successDiv.classList.add('d-none');
        document.getElementById('loginEmail').value = email;
        showNotification('Compte créé avec succès !', 'success');
    }, 3000);
}

// Déconnexion
function logout() {
    currentUser = null;
    localStorage.removeItem('espaceVertUser');
    updateNavForUser();
    showPage('page1');
    showNotification('Vous êtes déconnecté', 'info');
}

// Fonction pour aller à l'espace membre
function goToMemberSpace() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour accéder à votre espace', 'warning');
        showPage('page5');
        return;
    }
    showPage('page6');
    loadMemberSpace();
}

// Mettre à jour la navigation selon l'état de connexion
function updateNavForUser() {
    const navLinks = document.querySelector('#navbarNav .navbar-nav');
    const loginLink = navLinks.querySelector('[onclick*="page5"]');
    
    if (currentUser) {
        // Utilisateur connecté
        if (loginLink) {
            loginLink.innerHTML = `
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle me-1"></i> ${currentUser.firstName}
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="#" onclick="goToMemberSpace()">
                                <i class="fas fa-home me-2"></i>Mon espace
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" onclick="showMyProfile()">
                                <i class="fas fa-user me-2"></i>Mon profil
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" onclick="showMyPlants()">
                                <i class="fas fa-leaf me-2"></i>Mes plantes
                            </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item text-danger" href="#" onclick="logout()">
                                <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                            </a>
                        </li>
                    </ul>
                </div>
            `;
        }
    } else {
        // Utilisateur non connecté
        if (loginLink) {
            loginLink.innerHTML = '<a class="nav-link" onclick="showPage(\'page5\')"><i class="fas fa-user"></i> Connexion</a>';
        }
    }
}

// Charger l'espace membre
function loadMemberSpace() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour accéder à cette page', 'warning');
        showPage('page5');
        return;
    }
    
    // Mettre à jour le nom
    document.getElementById('userGreeting').textContent = currentUser.firstName;
    document.getElementById('userFullName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Calculer les jours de membre
    const joinDate = new Date(currentUser.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('memberDays').textContent = diffDays;
    document.getElementById('memberSince').textContent = joinDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Mettre à jour les photos partagées
    const totalPhotos = currentUser.photos?.length || 0;
    document.getElementById('totalSharedPhotos').textContent = `${totalPhotos} photo${totalPhotos > 1 ? 's' : ''}`;
    
    // Déterminer le niveau
    let level = 'Débutant';
    if (totalPhotos >= 10) level = 'Expert';
    else if (totalPhotos >= 5) level = 'Intermédiaire';
    document.getElementById('userLevel').textContent = level;
    
    // Charger les photos
    loadUserPhotos();
    
    // Mettre à jour les statistiques
    updateStats();
}

// Charger les photos de l'utilisateur
function loadUserPhotos() {
    const gallery = document.getElementById('userGallery');
    
    if (!currentUser.photos || currentUser.photos.length === 0) {
        gallery.innerHTML = `
            <div class="col-12 text-center">
                <div class="p-5 bg-light rounded">
                    <i class="fas fa-camera fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Aucune photo ajoutée</p>
                    <p>Commencez par ajouter une photo de votre plante !</p>
                </div>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = '';
    currentUser.photos.forEach((photo, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-4';
        col.innerHTML = `
            <div class="user-photo-item">
                <img src="${photo.url}" alt="${photo.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'">
                <button class="delete-photo" onclick="deletePhoto(${index})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="photo-info">
                    <h6>${photo.name}</h6>
                    <p class="text-muted small">${photo.type} • ${new Date(photo.date).toLocaleDateString()}</p>
                    <p class="small">${photo.description || 'Pas de description'}</p>
                </div>
            </div>
        `;
        gallery.appendChild(col);
    });
}

// Mettre à jour les statistiques
function updateStats() {
    const totalPlants = currentUser.photos?.length || 0;
    document.getElementById('totalPlants').textContent = totalPlants;
    document.getElementById('totalPhotos').textContent = totalPlants;
    document.getElementById('nextWatering').textContent = Math.min(3, totalPlants);
}

// Ajouter une photo
function uploadUserPhoto() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter d\'abord', 'warning');
        showPage('page5');
        return;
    }
    
    const photoData = {
        name: document.getElementById('plantName').value,
        type: document.getElementById('plantType').value,
        url: document.getElementById('photoUrl').value,
        description: document.getElementById('plantDescription').value,
        date: new Date().toISOString()
    };
    
    // Ajouter à l'utilisateur courant
    if (!currentUser.photos) currentUser.photos = [];
    currentUser.photos.push(photoData);
    
    // Mettre à jour le localStorage
    let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].photos = currentUser.photos;
        localStorage.setItem('espaceVertUsers', JSON.stringify(users));
    }
    
    // Mettre à jour l'utilisateur courant
    localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
    
    // Réinitialiser le formulaire
    document.getElementById('uploadPhotoForm').reset();
    
    // Recharger les photos et stats
    loadUserPhotos();
    updateStats();
    
    showNotification('Photo ajoutée avec succès !', 'success');
}

// Supprimer une photo
function deletePhoto(index) {
    if (confirm('Supprimer cette photo ?')) {
        currentUser.photos.splice(index, 1);
        
        // Mettre à jour le localStorage
        let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].photos = currentUser.photos;
            localStorage.setItem('espaceVertUsers', JSON.stringify(users));
        }
        
        localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
        
        loadUserPhotos();
        updateStats();
        showNotification('Photo supprimée', 'info');
    }
}

// Fonction pour afficher le profil utilisateur
function showMyProfile() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter', 'warning');
        showPage('page5');
        return;
    }
    
    // Créer un modal pour le profil
    const modalHTML = `
        <div class="modal fade" id="profileModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-circle me-2"></i>Mon profil
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <div class="profile-avatar mb-4">
                                    <i class="fas fa-user-circle fa-6x text-success"></i>
                                    <button class="btn btn-sm btn-outline-success mt-2">
                                        <i class="fas fa-camera me-1"></i>Changer
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h4>${currentUser.firstName} ${currentUser.lastName}</h4>
                                <p class="text-muted">
                                    <i class="fas fa-envelope me-2"></i>${currentUser.email}
                                </p>
                                
                                <div class="row mt-4">
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <h6><i class="fas fa-calendar-alt me-2"></i>Date d'inscription</h6>
                                                <p>${new Date(currentUser.joinDate).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <h6><i class="fas fa-leaf me-2"></i>Plantes totales</h6>
                                                <p>${currentUser.photos?.length || 0} plantes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <h5>Modifier les informations</h5>
                                    <form id="updateProfileForm">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Prénom</label>
                                                <input type="text" class="form-control" 
                                                       value="${currentUser.firstName}" id="updateFirstName">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Nom</label>
                                                <input type="text" class="form-control" 
                                                       value="${currentUser.lastName}" id="updateLastName">
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" 
                                                   value="${currentUser.email}" id="updateEmail">
                                        </div>
                                        
                                        <button type="button" class="btn btn-primary" onclick="updateProfile()">
                                            <i class="fas fa-save me-2"></i>Enregistrer les modifications
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le modal au body s'il n'existe pas
    if (!document.getElementById('profileModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
    }
    
    // Afficher le modal
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

// Fonction pour mettre à jour le profil
function updateProfile() {
    const newFirstName = document.getElementById('updateFirstName').value;
    const newLastName = document.getElementById('updateLastName').value;
    const newEmail = document.getElementById('updateEmail').value;
    
    // Mettre à jour l'utilisateur courant
    currentUser.firstName = newFirstName;
    currentUser.lastName = newLastName;
    currentUser.email = newEmail;
    
    // Mettre à jour le localStorage
    let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].firstName = newFirstName;
        users[userIndex].lastName = newLastName;
        users[userIndex].email = newEmail;
        localStorage.setItem('espaceVertUsers', JSON.stringify(users));
    }
    
    localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
    
    // Mettre à jour la navigation
    updateNavForUser();
    
    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();
    
    showNotification('Profil mis à jour avec succès !', 'success');
}

// Fonction pour afficher les plantes de l'utilisateur
function showMyPlants() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter', 'warning');
        showPage('page5');
        return;
    }
    
    // Rediriger vers l'espace membre (page6) qui contient déjà la galerie
    showPage('page6');
    
    // Scroller vers la section des plantes
    setTimeout(() => {
        document.getElementById('userGallery').scrollIntoView({ behavior: 'smooth' });
        showNotification('Voici vos plantes !', 'info');
    }, 500);
}

// Fonctions utilitaires
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

function requestPasswordReset() {
    const email = document.getElementById('resetEmail').value;
    const messageDiv = document.getElementById('resetMessage');
    
    // Simuler l'envoi d'email
    messageDiv.textContent = `Un lien de réinitialisation a été envoyé à ${email}`;
    messageDiv.classList.remove('d-none', 'alert-danger');
    messageDiv.classList.add('alert-success');
    
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
        modal.hide();
        showNotification('Email de réinitialisation envoyé !', 'info');
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showTerms() {
    alert(`Conditions d'utilisation ESPRIT VERT :

1. Votre compte est personnel et ne peut être partagé
2. Nous respectons votre vie privée
3. Le contenu partagé doit respecter la communauté
4. Nous pouvons vous envoyer des conseils et actualités

Pour plus d'informations, contactez-nous à espritvert@gmail.com`);
}