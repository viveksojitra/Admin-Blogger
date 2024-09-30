// Cookie
// Set a cookie
const setCookie = (req, res, userId) => {
    res.cookie('userId', userId, {
        httpOnly: false,
        secure: false,
        maxAge: 900000,
        path: '/',
    });
    console.log('User cookie has been set:', userId);
    console.log('User Cookie:', req.cookies['userId']);
};

// Get the cookie
const getCookie = (req, res) => {
    let user = req.cookies['userId'];
    if (user) {
        console.log(`User cookie: ${user}`);
    } else {
        console.log('No user cookie found.');
    }
};

// Clear the cookie
const clearCookie = (req, res) => {
    res.clearCookie('user');
    console.log('Cookie has been cleared!');
};

module.exports = {
    setCookie,
    getCookie,
    clearCookie
};