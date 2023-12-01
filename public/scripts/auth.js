// loginModule.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
const supabaseUrl = 'https://ooxiuecaotwshyucwybn.supabase.co';
const supabasePublicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veGl1ZWNhb3R3c2h5dWN3eWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzY3MzMsImV4cCI6MjAxMTkxMjczM30.XHxAVR2xvZBj6rqtJEmbG7pzGiN_g6b62EVOtxEgndg';
const supabase = createClient(supabaseUrl, supabasePublicKey);

async function getUsers() {
    let { data, error } = await supabase
        .from('users')
        .select('*')
    return data;
}

// LOGIN
export async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Logging in user
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Login successful');
            window.location.href = "home.html";
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
});

// SIGNUP
export async function handleSignUp() {
    const name = document.getElementById('name-signup').value;
    const surname = document.getElementById('surname-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const instagram_account = document.getElementById('instagram-signup').value;
    const description = document.getElementById('description-signup').value;

    try {
        const users = await getUsers();
        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            alert('Email already in use');
            return
        }
        // Creating a new user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            data: {
                confirmation_sent_at: Date.now(),
            },
        });

        if (error) {
            alert(error.message);
        } else {
            // Inserting user data into the database
            const { data, error: insertError } = await supabase
                .from('users')
                .upsert([
                    {
                        email,
                        name,
                        surname,
                        instagram_account,
                        description
                    },
                ]);

            if (insertError) {
                console.error('Error inserting data:', insertError.message);
            } else {
                alert('SignUp successful');
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                window.location.href = "home.html";
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp-button');
    if (signUpButton) {
        signUpButton.addEventListener('click', handleSignUp);
    }
});

async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return null;
    }
    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email);

    return data[0];
}


function createProfileCard(user) {
    return `
        <div class="profile-card">
            <div class="profile-header">
                <img src="${user.profile_image}" alt="${user.name}" style="height:50px;width:50px;object-fit: cover;">
                <h2>${user.name}</h2>
                <p>${user.instagram_account}</p>
            </div>
            <div class="profile-content">
                <p>${user.description}</p>
            </div>
            <button class="view-profile-btn">VIEW PROFILE</button>
        </div>
    `;
}

async function populateProfileCards() {
    const users = await getUsers();
    const cardsHtml = users.map(createProfileCard).join('');
    document.getElementById('profile-cards-container').innerHTML = cardsHtml;

    const viewProfileButtons = document.querySelectorAll('.view-profile-btn');

    viewProfileButtons.forEach(button => {
        button.addEventListener('click', function () {
            const instagramAccount = this.getAttribute('data-instagram');
            window.location.href = `https://www.instagram.com/${instagramAccount}/`;
        });
    });
}

document.addEventListener('DOMContentLoaded', populateProfileCards);

document.addEventListener('DOMContentLoaded', async function () {
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const descriptionInput = document.getElementById('description');
    const instagramInput = document.getElementById('instagram');
    const userData = await getUser();

    if (userData) {
        console.log(userData);
        nameInput.value = userData.name || '';
        surnameInput.value = userData.surname || '';
        emailInput.value = userData.email || '';
        descriptionInput.value = userData.description || '';
        instagramInput.value = userData.instagram_account || '';
    }
});

async function updateUserData() {
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const descriptionInput = document.getElementById('description');
    const instagramInput = document.getElementById('instagram');

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const updatedUserData = {
            name: nameInput.value,
            surname: surnameInput.value,
            email: emailInput.value,
            description: descriptionInput.value,
            instagram_account: instagramInput.value,
        };

        try {
            const { data, error } = await supabase
                .from('users')
                .update(updatedUserData)
                .eq('email', user.email);

            if (error) {
                console.error('Error updating user data:', error.message);
            } else {
                alert('User data updated successfully');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    if (editButton) {
        editButton.addEventListener('click', updateUserData);
    }
});

async function deleteUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        try {
            // Delete the user from the authentication system
            const { error: authError } = await supabase.auth.signOut();
            if (authError) {
                console.error('Error signing out user:', authError.message);
                return;
            }

            // Delete the user data from the database
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('email', user.email);

            if (deleteError) {
                console.error('Error deleting user data:', deleteError.message);
            } else {
                alert('User deleted successfully');
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('delete-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteUser);
    }
});



