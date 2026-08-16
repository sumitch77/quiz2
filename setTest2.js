
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

const { router } = require('./routes/index');
const { router2 } = require('./routes/auth');
const {router3} = require('./routes/routeforgot');
const { router4 } = require('./routes/oauth');

const multer = require('multer');
const cors = require('cors');
const passport = require('passport');
const { User } = require('./routes/auth');

const {supabase} = require('./routes/supabase');

const session = require('express-session');
const connectPgSimple  = require('connect-pg-simple');
const pg  = require('pg');
const PgSession = connectPgSimple(session);


dotenv.config();
const allowedOrigins = [process.env.ALLOWED, process.env.THIRDALLOWED, process.env.FOURTHALLOWED];
app.use(cors({
   origin: function (origin, callback) {
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
          callback(null, false);
        }
    }
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 10 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
);



// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 4. Fetch user from Supabase on subsequent requests
passport.deserializeUser(async (id, done) => {
  const { data: user, error } = await supabase
    .from('allusers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  done(error, user);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));



app.use(router);
app.use(router2);
app.use(router3);
app.use(router4);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

 const port = 3069;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });  

module.exports = { session};


//  sendcode.addEventListener('click', async (event) => {

//   event.preventDefault(); 
//   lockButton(sendcode);
//    newemail= email.value;
//   try {
//     const response = await fetch('/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name1: name1.value, phone: phone.value, email: newemail, password: password.value, confirmpass: confirmpass.value })
//     });
//        if(response.status===429){
//         const data = await response.json();
//         message.innerText = data.message;
//         message.classList.remove('hidden');
//         message.classList.replace('text-green-600' , 'text-red-600');



//         setTimeout(()=>{

//           message.innerText="";
//          message.classList.add('hidden');
//         message.classList.replace( 'text-red-600' , 'text-green-600');


//         },5000)
//         return;
//     }
//     if(response.status===400){
//         const data = await response.json();
//         message.innerText = data.message;

//        message.classList.remove('hidden');
//         message.classList.replace('text-green-600' , 'text-red-600');


//          setTimeout(()=>{
//     message.innerText='';

//        message.classList.add('hidden');
//         message.classList.replace( 'text-red-600' , 'text-green-600');


//     },5000);
//         return;
//     }
//     const data = await response.json();
//     message.innerHTML =data.message;

//      message.classList.remove('hidden');
//         // message.classList.replace('text-green-600' , 'bg-red-600');

//         // warn.classList.replace('bg-red-600' , 'bg-green-600');
//      setTimeout(()=>{
//     message.innerText='';


//         message.classList.add('hidden');
//         // warn.classList.replace( 'text-green-500','text-red-500');

//     },5000);
//     if(data.success){
           
//     sendcode.innerText='Resend';
      
//     }
   
//   } catch (err) {
//     message.innerText='Unable to connect to server';

//        message.classList.remove('hidden');
//         message.classList.replace('text-green-600' , 'text-red-600');


//         setTimeout(()=>{
//           message.innerText='';

//           message.classList.add('hidden');
//         message.classList.replace( 'text-red-600' , 'text-green-600');


//         },5000)
//   }
// });

// verbtn.addEventListener('click', async () => {
  
//   lockButton(verbtn);
//    try {
//     const response = await fetch('/verify2', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name1: name1.value, phone: phone.value, code: code.value, email: email.value , password: password.value })
//     });
//        if(response.status===429){
//         const data = await response.json();
//         message2.innerText = data.message;
//        message2.classList.remove('hidden');
//         message2.classList.replace('text-green-600' , 'text-red-600');



//         setTimeout(()=>{

//           message2.innerText="";
//          message2.classList.add('hidden');
//         message2.classList.replace( 'text-red-600' , 'text-green-600');


//         },5000)
//        }
    
//     if(response.status===400){
//         const data = await response.json();
//         message2.innerText = data.message;

//        message2.classList.remove('hidden');
//         message2.classList.replace('text-green-600' , 'text-red-600');


//          setTimeout(()=>{
//     message2.innerText='';

//        message2.classList.add('hidden');
//         message2.classList.replace( 'text-red-600' , 'text-green-600');


//     },5000);
//         return;
//     }
//     const data = await response.json();
//     message2.innerText = data.message;
//     if(!data.success){
//         message2.classList.replace('text-green-600' , 'text-red-600');
//     }
//      message2.classList.remove('hidden');
//      setTimeout(()=>{
//     message2.innerText='';
//         message2.classList.add('hidden');
//     },5000);
    
//     } catch (err) {
//     message2.innerText='Unable to connect to server';

//        message2.classList.remove('hidden');
//         message2.classList.replace('text-green-600' , 'text-red-600');


//         setTimeout(()=>{
//           message2.innerText='';

//           message2.classList.add('hidden');
//         message2.classList.replace( 'text-red-600' , 'text-green-600');


//     },5000);
//   }
// });
