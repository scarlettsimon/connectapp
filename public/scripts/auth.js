// loginModule.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
const supabaseUrl = 'https://ooxiuecaotwshyucwybn.supabase.co';
const supabasePublicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veGl1ZWNhb3R3c2h5dWN3eWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzY3MzMsImV4cCI6MjAxMTkxMjczM30.XHxAVR2xvZBj6rqtJEmbG7pzGiN_g6b62EVOtxEgndg';

// LOGIN
export async function handleLogin() {
    const supabase = createClient(supabaseUrl, supabasePublicKey);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
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
    const supabase = createClient(supabaseUrl, supabasePublicKey);
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            data: {
                name,
                surname
            }
        });

        if (error) {
            alert(error.message);
        } else {
            alert('SignUp successful');
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