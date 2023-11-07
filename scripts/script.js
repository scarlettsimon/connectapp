import { supa } from "../config/config.js";

const supabaseUrl = '';
const supabasePublicKey = '';

const supabase = supabase.createClient(supabaseUrl, supabasePublicKey);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { user, session, error } = await supabase.auth.signIn({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Login successful');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});
