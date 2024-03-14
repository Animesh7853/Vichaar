const { validateToken } = require('../services/authentication');


function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); // Move next() inside if block
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Handle token validation error here if needed
            console.error('Error validating token:', error);
        }
        next(); // Call next() here after setting req.user
    };
}

module.exports = {
    checkForAuthenticationCookie,
};

// function checkForAuthenticationCookie(cookieName){
//     return(req,res,next)=>{
//         const tokenCookieValue =req.cookies[cookieName];
//         if(!tokenCookieValue){
//             next();
//         }
//         try {
//             const userPayload = validateToken(tokenCookieValue);
//             req.user=userPayload;
//         } catch (error) {}
//         next();
//     };
// };

// module.exports={
//     checkForAuthenticationCookie,
// };