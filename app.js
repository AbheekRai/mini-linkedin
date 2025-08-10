// LinkedIn-like Professional Network Platform
class LinkedProApp {
    constructor() {
        // In-memory data storage
        this.users = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                bio: "Software Developer passionate about creating innovative solutions. Currently working on full-stack applications and exploring new technologies.",
                createdAt: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                name: "Sarah Wilson",
                email: "sarah@example.com",
                password: "password123",
                bio: "Product Manager with 5+ years experience in tech startups. Love building products that make a difference in people's lives.",
                createdAt: "2024-01-20T14:20:00Z"
            },
            {
                id: 3,
                name: "Mike Chen",
                email: "mike@example.com",
                password: "password123",
                bio: "UX Designer focused on creating intuitive and accessible user experiences. Always learning and sharing design insights.",
                createdAt: "2024-01-25T09:15:00Z"
            }
        ];

        this.posts = [
            {
                id: 1,
                userId: 1,
                content: "Just finished building a new React component library! Excited to share it with the community. The modular approach really helps with maintainability and reusability across projects.",
                timestamp: "2024-02-01T16:45:00Z",
                likes: 12,
                likedBy: []
            },
            {
                id: 2,
                userId: 2,
                content: "Had an amazing product strategy meeting today. It's incredible how user feedback can completely reshape your roadmap. Always listen to your users - they're the ones who matter most!",
                timestamp: "2024-02-01T14:30:00Z",
                likes: 8,
                likedBy: []
            },
            {
                id: 3,
                userId: 3,
                content: "Working on a new accessibility audit for our platform. It's surprising how many small changes can make a huge difference in user experience for people with disabilities. Design should be inclusive!",
                timestamp: "2024-02-01T11:20:00Z",
                likes: 15,
                likedBy: []
            },
            {
                id: 4,
                userId: 1,
                content: "Learning about microservices architecture and how it can improve scalability. The journey from monolith to microservices is challenging but worth it for long-term maintainability.",
                timestamp: "2024-01-31T20:10:00Z",
                likes: 6,
                likedBy: []
            },
            {
                id: 5,
                userId: 2,
                content: "Celebrating a successful product launch! Six months of hard work, user research, and iteration. The team's dedication made all the difference. Proud of what we've accomplished together.",
                timestamp: "2024-01-31T13:45:00Z",
                likes: 23,
                likedBy: []
            }
        ];

        this.currentUser = null;
        this.currentRoute = 'login';
        this.nextUserId = 4;
        this.nextPostId = 6;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeRouting();
        this.showPage('loginPage');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Authentication forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Navigation
        document.getElementById('showRegisterBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('registerPage');
        });
        
        document.getElementById('showLoginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('loginPage');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Post creation
        document.getElementById('createPostForm').addEventListener('submit', (e) => this.handleCreatePost(e));
        document.getElementById('postContent').addEventListener('input', (e) => this.updateCharacterCount(e));

        // Profile management
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfile());
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));

        // Routing
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-route')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // Real-time validation
        this.setupFormValidation();
    }

    // Form Validation
    setupFormValidation() {
        const forms = ['loginForm', 'registerForm', 'editProfileForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                    input.addEventListener('input', () => this.clearError(input));
                });
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id.replace(/^(login|register|edit)/, '').toLowerCase();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (field.id.includes('register') && this.users.find(u => u.email === value)) {
                    errorMessage = 'Email already exists';
                    isValid = false;
                }
                break;
            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(field, errorMessage, !isValid);
        return isValid;
    }

    showFieldError(field, message, show) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', show);
        }
    }

    clearError(field) {
        this.showFieldError(field, '', false);
    }

    // Authentication
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Validate inputs
        if (!email || !password) {
            this.showMessage('loginMessage', 'Please fill in all fields', 'error');
            return;
        }

        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showMessage('loginMessage', 'Login successful!', 'success');
            setTimeout(() => {
                this.showAuthenticatedView();
                this.navigate('home');
            }, 1000);
        } else {
            this.showMessage('loginMessage', 'Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const bio = document.getElementById('registerBio').value.trim();

        // Validate all fields
        const nameValid = this.validateField(document.getElementById('registerName'));
        const emailValid = this.validateField(document.getElementById('registerEmail'));
        const passwordValid = this.validateField(document.getElementById('registerPassword'));

        if (!nameValid || !emailValid || !passwordValid) {
            return;
        }

        // Create new user
        const newUser = {
            id: this.nextUserId++,
            name,
            email,
            password,
            bio: bio || 'New member of LinkedPro',
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.currentUser = newUser;

        this.showMessage('registerMessage', 'Account created successfully!', 'success');
        setTimeout(() => {
            this.showAuthenticatedView();
            this.navigate('home');
        }, 1000);
    }

    handleLogout() {
        this.currentUser = null;
        this.showUnauthenticatedView();
        this.navigate('login');
    }

    // View Management
    showAuthenticatedView() {
        document.getElementById('navbar').style.display = 'block';
        document.getElementById('navbarUserName').textContent = this.currentUser.name;
        this.updateUserInfo();
    }

    showUnauthenticatedView() {
        document.getElementById('navbar').style.display = 'none';
    }

    updateUserInfo() {
        if (this.currentUser) {
            const initials = this.getInitials(this.currentUser.name);
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('sidebarUserName').textContent = this.currentUser.name;
            document.getElementById('sidebarUserBio').textContent = this.currentUser.bio;
        }
    }

    // Routing
    navigate(route, userId = null) {
        this.currentRoute = route;
        
        // Update active nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            }
        });

        switch (route) {
            case 'home':
                this.showPage('homePage');
                this.loadFeed();
                break;
            case 'create-post':
                this.showPage('createPostPage');
                this.resetCreatePostForm();
                break;
            case 'profile':
                this.showPage('profilePage');
                this.loadProfile(userId || this.currentUser.id);
                break;
            case 'edit-profile':
                this.showPage('editProfilePage');
                this.populateEditProfileForm();
                break;
            case 'login':
                this.showPage('loginPage');
                break;
            default:
                this.navigate('home');
        }
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    // Post Management
    loadFeed() {
        const container = document.getElementById('postsContainer');
        const sortedPosts = [...this.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (sortedPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something with the community!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sortedPosts.map(post => this.renderPost(post)).join('');
        this.attachPostEventListeners();
    }

    renderPost(post) {
        const author = this.users.find(u => u.id === post.userId);
        if (!author) return '';

        const isLiked = post.likedBy.includes(this.currentUser.id);
        const timeAgo = this.getTimeAgo(post.timestamp);
        const initials = this.getInitials(author.name);

        return `
            <div class="card post-card">
                <div class="card__body">
                    <div class="post-header">
                        <div class="post-avatar">${initials}</div>
                        <div class="post-author-info">
                            <h4 data-user-id="${author.id}" class="post-author-name">${author.name}</h4>
                            <p class="post-timestamp">${timeAgo}</p>
                        </div>
                    </div>
                    <div class="post-content">
                        <p>${this.escapeHtml(post.content)}</p>
                    </div>
                    <div class="post-actions">
                        <button class="like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            ${post.likes} ${post.likes === 1 ? 'like' : 'likes'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachPostEventListeners() {
        // Like button handlers
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(e.currentTarget.getAttribute('data-post-id'));
                this.toggleLike(postId);
            });
        });

        // Author name click handlers
        document.querySelectorAll('.post-author-name').forEach(name => {
            name.addEventListener('click', (e) => {
                const userId = parseInt(e.currentTarget.getAttribute('data-user-id'));
                this.navigate('profile', userId);
            });
        });
    }

    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const userIndex = post.likedBy.indexOf(this.currentUser.id);
        if (userIndex === -1) {
            post.likedBy.push(this.currentUser.id);
            post.likes++;
        } else {
            post.likedBy.splice(userIndex, 1);
            post.likes--;
        }

        this.loadFeed(); // Refresh the feed
    }

    handleCreatePost(e) {
        e.preventDefault();
        const content = document.getElementById('postContent').value.trim();

        if (!content) {
            this.showMessage('postMessage', 'Please enter some content', 'error');
            return;
        }

        if (content.length > 500) {
            this.showMessage('postMessage', 'Post content is too long', 'error');
            return;
        }

        const newPost = {
            id: this.nextPostId++,
            userId: this.currentUser.id,
            content,
            timestamp: new Date().toISOString(),
            likes: 0,
            likedBy: []
        };

        this.posts.unshift(newPost);
        this.showMessage('postMessage', 'Post created successfully!', 'success');
        
        setTimeout(() => {
            this.navigate('home');
        }, 1000);
    }

    resetCreatePostForm() {
        document.getElementById('createPostForm').reset();
        document.getElementById('charCount').textContent = '0';
        this.clearFormMessages('postMessage');
    }

    updateCharacterCount(e) {
        const count = e.target.value.length;
        document.getElementById('charCount').textContent = count;
        
        if (count > 500) {
            e.target.style.borderColor = 'var(--color-error)';
        } else {
            e.target.style.borderColor = '';
        }
    }

    // Profile Management
    loadProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.navigate('home');
            return;
        }

        const isOwnProfile = userId === this.currentUser.id;
        const userPosts = this.posts.filter(p => p.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Update profile info
        document.getElementById('profileInitials').textContent = this.getInitials(user.name);
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileBio').textContent = user.bio;
        document.getElementById('profilePostCount').textContent = `${userPosts.length} ${userPosts.length === 1 ? 'post' : 'posts'}`;

        // Show/hide edit button
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.style.display = isOwnProfile ? 'block' : 'none';

        // Load user's posts
        const postsContainer = document.getElementById('profilePostsContainer');
        if (userPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <p>${isOwnProfile ? 'You haven\'t posted anything yet.' : 'No posts to show.'}</p>
                </div>
            `;
        } else {
            postsContainer.innerHTML = userPosts.map(post => this.renderPost(post)).join('');
            this.attachPostEventListeners();
        }
    }

    showEditProfile() {
        this.navigate('edit-profile');
    }

    populateEditProfileForm() {
        if (this.currentUser) {
            document.getElementById('editName').value = this.currentUser.name;
            document.getElementById('editEmail').value = this.currentUser.email;
            document.getElementById('editBio').value = this.currentUser.bio;
        }
    }

    handleEditProfile(e) {
        e.preventDefault();
        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const bio = document.getElementById('editBio').value.trim();

        // Validate fields
        const nameValid = this.validateField(document.getElementById('editName'));
        const emailValid = this.validateField(document.getElementById('editEmail'));

        if (!nameValid || !emailValid) {
            return;
        }

        // Check if email is taken by another user
        const existingUser = this.users.find(u => u.email === email && u.id !== this.currentUser.id);
        if (existingUser) {
            this.showFieldError(document.getElementById('editEmail'), 'Email already exists', true);
            return;
        }

        // Update user
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.bio = bio;

        // Update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser };
        }

        this.showMessage('editProfileMessage', 'Profile updated successfully!', 'success');
        this.updateUserInfo();
        
        setTimeout(() => {
            this.navigate('profile');
        }, 1000);
    }

    // Utility Functions
    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return past.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `form-message ${type} show`;
        }
    }

    clearFormMessages(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = 'form-message';
            element.textContent = '';
        }
    }

    initializeRouting() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            // For demo purposes, just navigate to home if authenticated
            if (this.currentUser) {
                this.navigate('home');
            } else {
                this.navigate('login');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.linkedProApp = new LinkedProApp();
});

// Additional utility functions for enhanced UX
document.addEventListener('keydown', (e) => {
    // ESC key to close modals or navigate back
    if (e.key === 'Escape') {
        const app = window.linkedProApp;
        if (app && app.currentUser) {
            app.navigate('home');
        }
    }
});

// Form submission on Enter key (except for textareas)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-resize textareas
document.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

// Prevent form submission when offline (basic check)
document.addEventListener('submit', (e) => {
    if (!navigator.onLine) {
        e.preventDefault();
        alert('You appear to be offline. Please check your connection and try again.');
    }
});