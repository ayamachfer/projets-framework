// Fonction pour afficher une page spécifique
function showPage(pageId) {
    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Afficher la page sélectionnée
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
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
    
    // SI C'EST LA PAGE DE CONNEXION (page5)
    if (pageId === 'page5') {
        // Si l'utilisateur est DÉJÀ connecté, aller DIRECTEMENT à l'espace membre
        if (currentUser) {
            // Afficher page6 à la place
            const page6Element = document.getElementById('page6');
            if (page6Element) {
                page6Element.classList.add('active');
                loadMemberSpace();
            }
            return; // Ne pas afficher page5
        } else {
            // Utilisateur non connecté, afficher le formulaire de connexion
            showLoginForm();
        }
    }
    
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
let currentProfileImage = null;
let currentImageData = null;

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
    initImageUpload();
});

// Initialisation des événements de connexion/inscription
function initAuth() {
    // Charger l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('espaceVertUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            // Charger la photo de profil
            currentProfileImage = currentUser.profileImage || null;
            updateNavForUser();
        } catch (e) {
            console.error("Erreur de parsing du user:", e);
        }
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
        const input = document.getElementById('loginPassword');
        const icon = this.querySelector('i');
        if (input && icon) {
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
    });
    
    document.getElementById('toggleRegisterPassword')?.addEventListener('click', function() {
        const input = document.getElementById('registerPassword');
        const icon = this.querySelector('i');
        if (input && icon) {
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
    });
    
    // Écouteurs pour basculer entre connexion et inscription
    document.getElementById('showRegisterLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        const currentText = this.textContent;
        if (currentText === 'Créez-en un ici') {
            showRegisterForm();
        } else {
            showLoginForm();
        }
    });
    
    document.getElementById('backToLoginBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}

// Initialiser l'upload d'images
function initImageUpload() {
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', handleImageSelect);
    }
}

// Fonctions pour basculer entre connexion et inscription
function showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegisterLink = document.getElementById('showRegisterLink');
    
    if (loginSection) loginSection.classList.remove('d-none');
    if (registerSection) registerSection.classList.add('d-none');
    if (showRegisterLink) showRegisterLink.textContent = 'Créez-en un ici';
}

function showRegisterForm() {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegisterLink = document.getElementById('showRegisterLink');
    
    if (loginSection) loginSection.classList.add('d-none');
    if (registerSection) registerSection.classList.remove('d-none');
    if (showRegisterLink) showRegisterLink.textContent = 'Retour à la connexion';
}

// Connexion
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const alertDiv = document.getElementById('loginAlert');
    
    if (!email || !password) {
        if (alertDiv) {
            alertDiv.textContent = 'Veuillez remplir tous les champs';
            alertDiv.classList.remove('d-none', 'alert-success');
            alertDiv.classList.add('alert-danger');
        }
        return;
    }
    
    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Connexion réussie
        currentUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            joinDate: user.joinDate || new Date().toISOString(),
            photos: user.photos || [],
            profileImage: user.profileImage || null
        };
        
        // Sauvegarder dans localStorage
        localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
        
        // Mettre à jour la navigation
        updateNavForUser();
        
        // Cacher les alertes
        if (alertDiv) {
            alertDiv.classList.add('d-none');
        }
        
        // Rediriger vers l'espace membre
        showPage('page6');
        
        // Afficher notification
        showNotification(`Bienvenue ${user.firstName} !`, 'success');
        
        // Réinitialiser le formulaire
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        
    } else {
        // Échec de connexion
        if (alertDiv) {
            alertDiv.textContent = 'Email ou mot de passe incorrect';
            alertDiv.classList.remove('d-none', 'alert-success');
            alertDiv.classList.add('alert-danger');
        }
    }
}

// Inscription
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    const alertDiv = document.getElementById('registerAlert');
    const successDiv = document.getElementById('registerSuccess');
    
    // Validation
    if (password !== confirmPassword) {
        if (alertDiv) {
            alertDiv.textContent = 'Les mots de passe ne correspondent pas';
            alertDiv.classList.remove('d-none');
            alertDiv.classList.add('alert-danger');
        }
        return;
    }
    
    if (password.length < 8) {
        if (alertDiv) {
            alertDiv.textContent = 'Le mot de passe doit contenir au moins 8 caractères';
            alertDiv.classList.remove('d-none');
            alertDiv.classList.add('alert-danger');
        }
        return;
    }
    
    // Vérifier si l'utilisateur existe déjà
    let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    if (users.find(u => u.email === email)) {
        if (alertDiv) {
            alertDiv.textContent = 'Un compte existe déjà avec cet email';
            alertDiv.classList.remove('d-none');
            alertDiv.classList.add('alert-danger');
        }
        return;
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        firstName,
        lastName,
        email,
        password,
        joinDate: new Date().toISOString(),
        photos: [],
        profileImage: null
    };
    
    users.push(newUser);
    localStorage.setItem('espaceVertUsers', JSON.stringify(users));
    
    // Afficher succès
    if (alertDiv) alertDiv.classList.add('d-none');
    if (successDiv) {
        successDiv.textContent = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        successDiv.classList.remove('d-none');
        successDiv.classList.add('alert-success');
    }
    
    // Réinitialiser le formulaire
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.reset();
    
    // Basculer vers la connexion après 3 secondes
    setTimeout(() => {
        if (successDiv) successDiv.classList.add('d-none');
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) loginEmail.value = email;
        showLoginForm();
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

// Mettre à jour la navigation selon l'état de connexion
function updateNavForUser() {
    const navLinks = document.querySelector('#navbarNav .navbar-nav');
    if (!navLinks) return;
    
    const loginLink = navLinks.querySelector('li:last-child');
    if (!loginLink) return;
    
    // Vérifier si l'utilisateur a une photo de profil
    const profilePhoto = currentUser?.profileImage ? 
        `<img src="${currentUser.profileImage}" alt="Photo profil" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">` :
        `<i class="fas fa-user-circle me-2"></i>`;
    
    if (currentUser) {
        // Utilisateur connecté
        loginLink.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                    <span class="profile-photo-nav me-2">
                        ${profilePhoto}
                    </span>
                    ${currentUser.firstName}
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="#" onclick="showPage('page6')">
                            <i class="fas fa-home me-2"></i>Mon compte
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
    } else {
        // Utilisateur non connecté
        loginLink.innerHTML = `
            <a class="nav-link" onclick="showPage('page5')">
                <i class="fas fa-user"></i> Connexion
            </a>
        `;
    }
}

// Fonction pour changer la photo de profil
function changeProfilePhoto() {
    // Créer un input file caché
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            showNotification('Veuillez sélectionner une image valide', 'warning');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            showNotification('L\'image est trop grande (max 2MB)', 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentProfileImage = e.target.result;
            
            // Mettre à jour l'image de profil dans le modal
            const profileImage = document.getElementById('profileAvatarImage');
            if (profileImage) {
                profileImage.src = currentProfileImage;
            }
            
            // Mettre à jour l'image dans la navbar
            updateProfilePhotoInNavbar();
            
            // Sauvegarder dans localStorage
            if (currentUser) {
                currentUser.profileImage = currentProfileImage;
                saveUserData();
                showNotification('Photo de profil mise à jour', 'success');
            }
        };
        reader.readAsDataURL(file);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Fonction pour mettre à jour la photo de profil dans la navbar
function updateProfilePhotoInNavbar() {
    const dropdownToggle = document.querySelector('.dropdown-toggle .profile-photo-nav');
    if (dropdownToggle && currentProfileImage) {
        dropdownToggle.innerHTML = `<img src="${currentProfileImage}" alt="Photo profil" class="rounded-circle" style="width: 30px; height: 30px; object-fit: cover;">`;
    }
}

// Fonction pour sauvegarder les données utilisateur
function saveUserData() {
    // Sauvegarder l'utilisateur courant
    localStorage.setItem('espaceVertUser', JSON.stringify(currentUser));
    
    // Mettre à jour dans la liste des utilisateurs
    let users = JSON.parse(localStorage.getItem('espaceVertUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('espaceVertUsers', JSON.stringify(users));
    }
}

// Fonction pour afficher le profil utilisateur
function showMyProfile() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter', 'warning');
        showPage('page5');
        return;
    }
    
    // Charger la photo de profil si elle existe
    const profileImage = currentUser.profileImage || '';
    
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
                                    <div id="profileAvatar" style="position: relative; display: inline-block;">
                                        ${profileImage ? 
                                            `<img id="profileAvatarImage" src="${profileImage}" alt="Photo profil" 
                                                  class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">` :
                                            `<i class="fas fa-user-circle fa-6x text-success"></i>`
                                        }
                                        <button class="btn btn-sm btn-outline-success mt-2" onclick="changeProfilePhoto()">
                                            <i class="fas fa-camera me-1"></i>Changer
                                        </button>
                                    </div>
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
    let modalElement = document.getElementById('profileModal');
    if (!modalElement) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        modalElement = document.getElementById('profileModal');
    } else {
        // Mettre à jour le contenu du modal existant
        modalElement.outerHTML = modalHTML;
        modalElement = document.getElementById('profileModal');
    }
    
    // Afficher le modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Fonction pour mettre à jour le profil
function updateProfile() {
    const newFirstName = document.getElementById('updateFirstName')?.value;
    const newLastName = document.getElementById('updateLastName')?.value;
    const newEmail = document.getElementById('updateEmail')?.value;
    
    if (!newFirstName || !newLastName || !newEmail) {
        showNotification('Veuillez remplir tous les champs', 'warning');
        return;
    }
    
    // Mettre à jour l'utilisateur courant
    currentUser.firstName = newFirstName;
    currentUser.lastName = newLastName;
    currentUser.email = newEmail;
    
    // Mettre à jour le localStorage
    saveUserData();
    
    // Mettre à jour la navigation
    updateNavForUser();
    
    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (modal) modal.hide();
    
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
        const gallery = document.getElementById('userGallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
        showNotification('Voici vos plantes !', 'info');
    }, 500);
}

// Charger l'espace membre
function loadMemberSpace() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour accéder à cette page', 'warning');
        showPage('page5');
        return;
    }
    
    // Mettre à jour le nom
    const userGreeting = document.getElementById('userGreeting');
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    
    if (userGreeting) userGreeting.textContent = currentUser.firstName;
    if (userFullName) userFullName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    if (userEmail) userEmail.textContent = currentUser.email;
    
    // Mettre à jour la photo de profil dans l'espace membre
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon && currentUser.profileImage) {
        profileIcon.innerHTML = `
            <img src="${currentUser.profileImage}" alt="Photo profil" 
                 class="rounded-circle" style="width: 100px; height: 100px; object-fit: cover;">
        `;
    }
    
    // Calculer les jours de membre
    const joinDate = new Date(currentUser.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const memberDays = document.getElementById('memberDays');
    const memberSince = document.getElementById('memberSince');
    if (memberDays) memberDays.textContent = diffDays;
    if (memberSince) memberSince.textContent = joinDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Mettre à jour les photos partagées
    const totalPhotos = currentUser.photos?.length || 0;
    const totalSharedPhotos = document.getElementById('totalSharedPhotos');
    if (totalSharedPhotos) {
        totalSharedPhotos.textContent = `${totalPhotos} photo${totalPhotos > 1 ? 's' : ''}`;
    }
    
    // Déterminer le niveau
    let level = 'Débutant';
    if (totalPhotos >= 10) level = 'Expert';
    else if (totalPhotos >= 5) level = 'Intermédiaire';
    const userLevel = document.getElementById('userLevel');
    if (userLevel) userLevel.textContent = level;
    
    // Charger les photos
    loadUserPhotos();
    
    // Mettre à jour les statistiques
    updateStats();
}

// Fonctions pour l'upload d'images des plantes
function takePhoto() {
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.setAttribute('capture', 'environment');
        photoInput.click();
    }
}

function selectFromGallery() {
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.removeAttribute('capture');
        photoInput.click();
    }
}

// Gérer la sélection d'image
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    if (!file.type.match('image.*')) {
        showNotification('Veuillez sélectionner une image valide', 'warning');
        return;
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('L\'image est trop grande (max 5MB)', 'warning');
        return;
    }
    
    // Lire et afficher l'aperçu
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageData = e.target.result;
        
        // Afficher l'aperçu
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewImage = document.getElementById('imagePreview');
        
        if (previewContainer && previewImage) {
            previewImage.src = currentImageData;
            previewContainer.classList.remove('d-none');
        }
    };
    reader.readAsDataURL(file);
}

// Ajouter une photo
function uploadUserPhoto() {
    if (!currentUser) {
        showNotification('Veuillez vous connecter d\'abord', 'warning');
        showPage('page5');
        return;
    }
    
    const plantName = document.getElementById('plantName')?.value;
    const plantType = document.getElementById('plantType')?.value;
    const plantDescription = document.getElementById('plantDescription')?.value;
    
    if (!plantName) {
        showNotification('Veuillez donner un nom à votre plante', 'warning');
        return;
    }
    
    if (!currentImageData) {
        showNotification('Veuillez sélectionner ou prendre une photo', 'warning');
        return;
    }
    
    // Créer un identifiant unique pour l'image
    const imageId = 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const photoData = {
        id: imageId,
        name: plantName,
        type: plantType || 'Plante d\'intérieur',
        imageData: currentImageData,
        description: plantDescription || '',
        date: new Date().toISOString()
    };
    
    // Ajouter à l'utilisateur courant
    if (!currentUser.photos) currentUser.photos = [];
    currentUser.photos.push(photoData);
    
    // Mettre à jour le localStorage
    saveUserData();
    
    // Réinitialiser le formulaire
    resetUploadForm();
    
    // Recharger les photos et stats
    loadUserPhotos();
    updateStats();
    
    showNotification('Photo ajoutée avec succès !', 'success');
}

// Réinitialiser le formulaire d'upload
function resetUploadForm() {
    const uploadForm = document.getElementById('uploadPhotoForm');
    if (uploadForm) uploadForm.reset();
    
    // Réinitialiser l'aperçu d'image
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    if (previewContainer) previewContainer.classList.add('d-none');
    if (previewImage) previewImage.src = '#';
    
    currentImageData = null;
}

// Charger les photos de l'utilisateur
function loadUserPhotos() {
    const gallery = document.getElementById('userGallery');
    if (!gallery) return;
    
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
            <div class="user-photo-item position-relative">
                <img src="${photo.imageData}" alt="${photo.name}" 
                     class="img-fluid rounded" style="height: 200px; width: 100%; object-fit: cover;">
                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 delete-photo" 
                        onclick="deletePhoto(${index})" title="Supprimer">
                    <i class="fas fa-times"></i>
                </button>
                <div class="photo-info bg-white p-3 rounded-bottom">
                    <h6 class="mb-1">${photo.name}</h6>
                    <p class="text-muted small mb-1">
                        <i class="fas fa-leaf me-1"></i>${photo.type} • 
                        <i class="fas fa-calendar me-1"></i>${new Date(photo.date).toLocaleDateString()}
                    </p>
                    <p class="small mb-0">${photo.description || 'Pas de description'}</p>
                </div>
            </div>
        `;
        gallery.appendChild(col);
    });
}

// Mettre à jour les statistiques
function updateStats() {
    const totalPlants = currentUser.photos?.length || 0;
    const totalPlantsEl = document.getElementById('totalPlants');
    const totalPhotosEl = document.getElementById('totalPhotos');
    const nextWateringEl = document.getElementById('nextWatering');
    
    if (totalPlantsEl) totalPlantsEl.textContent = totalPlants;
    if (totalPhotosEl) totalPhotosEl.textContent = totalPlants;
    if (nextWateringEl) nextWateringEl.textContent = Math.min(3, totalPlants);
}

// Supprimer une photo
function deletePhoto(index) {
    if (confirm('Supprimer cette photo ?')) {
        currentUser.photos.splice(index, 1);
        
        // Mettre à jour le localStorage
        saveUserData();
        
        loadUserPhotos();
        updateStats();
        showNotification('Photo supprimée', 'info');
    }
}

// Fonctions utilitaires
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button?.querySelector('i');
    
    if (!input || !icon) return;
    
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
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function requestPasswordReset() {
    const email = document.getElementById('resetEmail')?.value;
    const messageDiv = document.getElementById('resetMessage');
    
    if (!email) {
        if (messageDiv) {
            messageDiv.textContent = 'Veuillez entrer votre email';
            messageDiv.classList.remove('d-none', 'alert-success');
            messageDiv.classList.add('alert-danger');
        }
        return;
    }
    
    // Simuler l'envoi d'email
    if (messageDiv) {
        messageDiv.textContent = `Un lien de réinitialisation a été envoyé à ${email}`;
        messageDiv.classList.remove('d-none', 'alert-danger');
        messageDiv.classList.add('alert-success');
    }
    
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
        if (modal) {
            modal.hide();
        }
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
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'danger') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon} me-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
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