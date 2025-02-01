// src/Utils/Dictionary.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // NavBar.jsx
            quickMath: "Quick Math",
            home: "Home",
            practice: "Practice",
            statistics: "Statistics",
            profile: "Profile",
            logOut: "Log Out",

            // ProfilePage.jsx
            loadingProfile: "Loading Profile...",
            profileManagement: "Profile Management",
            username: "Username",
            password: "Password",
            email: "Email",
            newUsername: "New Username",
            newPassword: "New Password",
            repeatPassword: "Repeat Password",
            interfaceLanguage: "Interface Language",
            saveProfile: "Save Profile",
            pleaseGenerateQuestion: "Please generate a question",
            profileUpdatedSuccessfully: "Profile updated successfully!",
            updateFailed: "Update failed",
            ProfileEmailHelperText: "Enter a valid email address.",

            // NoteBook.jsx
            solutionSteps:"Solution Steps",
            correctAnswer: "Correct Answer:",
            question: "Question",
            yourAnswer: "Your Answer:",
            submitAnswer: "Submit Answer",
            correct: "Correct",
            yes: "Yes",
            no: "No",
            seeStepsAndAnswer: "See steps and correct answer",
            nextQuestion: "Next Question",
            changeSubject: "Change Subject",
            writeYourAnswerHere: "Write your answer here",
            loadingQuestionData: "Loading question data...",

            // PracticePage.jsx
            timeToPractice: "Time to practice!",

            // QuestionGenerator.jsx
            questionType: "Question Type",
            difficulty: "Difficulty Level",
            selectType: "-- Select Type --",
            selectDifficulty: "-- Select Difficulty --",
            basic: "Basic",
            easy: "Easy",
            medium: "Medium",
            advanced: "Hard",
            generate: "Generate",
            bankOfQuestionTypes: "Bank Of Question Types",

            // AdminDashboardSSE.jsx
            loadingAdminDashboard: "Loading Admin Dashboard...",
            adminDashboard: "Admin Dashboard",
            totalUsersAdmin: "Total Users:",
            totalAttemptsAdmin: "Total Attempts:",
            overallSuccessRateAdmin: "Overall Success Rate:",
            attemptsByTopicAdmin: "Attempts by Topic:",
            successRateByTopicAdmin: "Success Rate by Topic:",

            // UserDashboardSSE.jsx
            loadingUserDashboardPage: "Loading user dashboard...",
            userDashboardTitle: "User Dashboard",

            // ChartSuccessRateByTopic.jsx
            successRateTitle: "Success Rate By Topic",

            // ChartTotalSuccessRate.jsx
            overallSuccessTitle: "Overall Success Rate",
            overallSuccess: "Overall Success",

            // Error404.jsx
            error404: "Error 404",
            notFound: "Not Found",
            goBack: "Go Back",

            // Login.jsx
            login: "Login",
            register: "Register",
            createAccount: "Create Account",
            loginFailed: "Username or password are incorrect",
            loginPageTitle: "Login",
            usernamePlaceholder: "Enter your username",
            passwordPlaceholder: "Enter your password",
            passwordHelperText: "Do not share your password with anyone else",

            // Register.jsx
            registerPageTitle: "Create New Account",
            registerPageButton: "Register",
            registerSuccess: "Registration successful! Redirecting to login page...",
            registrationError: "Please check if all fields are filled correctly",
            alreadyHaveAccount: "Already have an account? Click here 👆",
            usernameHelperText: "8-30 characters, must include: lowercase, uppercase, number, and one special character",
            emailPlaceholder: "Enter your email address",
            emailHelperText: "In the format of xxx@xxx.xxx.",
            repeatPasswordPlaceholder: "Re-enter your password",
            passwordsMustMatch: "Passwords must match.",

            // Home.jsx
            welcomeQuickMath: "Welcome to Quick Math!",
            selfLearningMath: "This is a platform for self-learning and practicing math with a wide variety of topics. We have a detector that identifies what you are struggling with and matches the exercises to your level. This is designed to help you understand how to solve problems and then move on to higher difficulties to improve your math skills. We also offer dynamic question generation and personalized dashboards.",
            homeDescription: "This is a platform for self-learning and practicing math with a wide variety of topics...",
            startPracticing: "Start Practicing",
            goToProfilePage: "Go to Profile Page",
            seeYourStatistics: "See Your Statistics",

            // Dynamic Server Content - Topics and Descriptions
            Arithmetic: "Arithmetic",
            Addition: "Addition",
            Subtraction: "Subtraction",
            Multiplication: "Multiplication",
            Division: "Division",
            Fractions: "Fractions",
            Geometry: "Geometry",
            Rectangle: "Rectangle",
            Triangle: "Triangle",
            Circle: "Circle",
            Polygon: "Polygon",
            AdditionDescription: "Adding numbers together",
            SubtractionDescription: "Subtracting numbers from each other",
            MultiplicationDescription: "Multiplying numbers",
            DivisionDescription: "Dividing numbers",
            FractionsDescription: "Working with fractions",
            GeometryDescription: "Studying shapes and their properties",
            AlgebraDescription: "Solving equations and working with variables",
            RectangleDescription: "Understanding rectangles",
            TriangleDescription: "Understanding triangles",
            CircleDescription: "Understanding circles",
            PolygonDescription: "Understanding generic polygons",

            // Difficulty Levels
            BASIC: "Basic",
            EASY: "Easy",
            MEDIUM: "Medium",
            ADVANCED: "Hard",

            // Translation keys for solution step phrases:
            //General:
            and: "and",
            take: "take",
            from: "from",
            it: "it",
            to: "to",
            make: "make",
            then: "then",
            the: "the",
            remaining: "remaining",
            get: "get",

            //Addition:
            add: "add",

            toAdd: "To add",
            simplyAdd: "simply add",
            step1: "Step 1:",
            step2: "Step 2:",
            step3: "Step 3:",
            divide: "Divide",
            applySign: "Apply the sign",
            multiply: "Multiply",
            area: "Area",
            perimeter: "Perimeter",
            circumference: "Circumference",
            hypotenuse: "Hypotenuse",
            combineParts: "Combine the parts",
            combineOnes: "Combine the ones",
            combineTens: "Combine the tens",
            combineHundreds: "Combine the hundreds",
            simplifiesTo: "which simplifies to"
        }
    },
    he: {
        translation: {
            // NavBar.jsx
            quickMath: "Quick Math",
            home: "בית",
            practice: "תרגול",
            statistics: "סטטיסטיקה",
            profile: "פרופיל",
            logOut: "התנתק",

            // ProfilePage.jsx
            loadingProfile: "טוען פרופיל...",
            profileManagement: "ניהול פרופיל",
            username: "שם משתמש",
            password: "סיסמה",
            email: "דוא\"ל",
            newUsername: "שם משתמש חדש",
            newPassword: "סיסמה חדשה",
            repeatPassword: "חזור על הסיסמה",
            interfaceLanguage: "שפת ממשק",
            saveProfile: "שמור פרופיל",
            pleaseGenerateQuestion: "אנא צור שאלה",
            profileUpdatedSuccessfully: "הפרופיל עודכן בהצלחה!",
            updateFailed: "עדכון נכשל",
            ProfileEmailHelperText: "הזן כתובת דוא\"ל חוקית.",

            // NoteBook.jsx
            solutionSteps:"שלבי פתרון",
            correctAnswer: "תשובה נכונה",
            question: "שאלה",
            yourAnswer: "התשובה שלך:",
            submitAnswer: "שלח תשובה",
            correct: "נכון",
            yes: "כן",
            no: "לא",
            seeStepsAndAnswer: "ראה שלבים ותשובה נכונה",
            nextQuestion: "שאלה הבאה",
            changeSubject: "שנה נושא",
            writeYourAnswerHere: "כתוב את תשובתך כאן",
            loadingQuestionData: "טוען את נתוני השאלה...",

            // PracticePage.jsx
            timeToPractice: "הגיע הזמן לתרגל!",

            // QuestionGenerator.jsx
            questionType: "סוג שאלה",
            difficulty: "רמת קושי",
            selectType: "-- בחר סוג --",
            selectDifficulty: "-- בחר רמת קושי --",
            basic: "בסיסי",
            easy: "קל",
            medium: "בינוני",
            advanced: "קשה",
            generate: "צור",
            bankOfQuestionTypes: "מאגר סוגי השאלות",

            // AdminDashboardSSE.jsx
            loadingAdminDashboard: "טוען לוח מחוונים מנהל...",
            adminDashboard: "לוח מחוונים מנהל",
            totalUsersAdmin: "סה\"כ משתמשים:",
            totalAttemptsAdmin: "סה\"כ ניסיונות:",
            overallSuccessRateAdmin: "שיעור הצלחה כולל:",
            attemptsByTopicAdmin: "ניסיונות לפי נושא:",
            successRateByTopicAdmin: "שיעור הצלחה לפי נושא:",

            // UserDashboardSSE.jsx
            loadingUserDashboardPage: "טוען לוח מחוונים משתמש...",
            userDashboardTitle: "לוח מחוונים משתמש",

            // ChartSuccessRateByTopic.jsx
            successRateTitle: "אחוזי הצלחה לפי נושאים",
            noTopicData: "אין נתוני נושאים זמינים.",

            // ChartTotalSuccessRate.jsx
            overallSuccessTitle: "אחוז הצלחה כללי",
            overallSuccess: "הצלחה כללית",
            noOverallSuccessData: "אין נתוני הצלחה כלליים.",

            // Error404.jsx
            error404: "שגיאה 404",
            notFound: "לא נמצא",
            goBack: "חזור",

            // Login.jsx
            login: "התחבר",
            register: "הרשם",
            createAccount: "צור חשבון",
            loginFailed: "שם משתמש או סיסמה שגויים",
            loginPageTitle: "התחברות",
            usernamePlaceholder: "הזן את שם המשתמש שלך",
            passwordPlaceholder: "הזן את הסיסמה שלך",
            passwordHelperText: "נא לא לשתף את סיסמתך עם כל אדם אחר",

            // Register.jsx
            registerPageTitle: "צור משתמש חדש",
            registerPageButton: "הרשמה",
            registerSuccess: "הרשמה הצליחה! מועבר לדף ההתחברות...",
            registrationError: "אנא בדוק אם כל השדות מולאו כראוי",
            alreadyHaveAccount: "כבר יש לך חשבון? לחץ כאן 👆",
            usernameHelperText: "8-30 תווים, חייב לכלול: אותיות קטנות, רישיות, מספר ותו מיוחד אחד",
            emailPlaceholder: "הזן את כתובת הדוא\"ל שלך",
            emailHelperText: "בפורמט של xxx@xxx.xxx",
            repeatPasswordPlaceholder: "הזן שוב את הסיסמה שלך",
            passwordsMustMatch: "הסיסמאות חייבות להתאים",

            // Home.jsx
            welcomeQuickMath: "ברוכים הבאים ל-Quick Math!",
            selfLearningMath: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים. אנחנו עוזרים לך להבין עם מה אתה מתקשה ונתאים את התרגילים לרמתך. כל זאת כדי שתבין את הדרך לפתור בעיות ולאחר מכן תעבור לרמות קושי גבוהות יותר כדי לשפר את כישורי המתמטיקה שלך. אנו מציעים גם יצירת שאלות דינמית ולוח סטטיסטיקה אישי ונוח",
            homeDescription: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים...",
            startPracticing: "התחל לתרגל",
            goToProfilePage: "גש לדף הפרופיל",
            seeYourStatistics: "ראה את הסטטיסטיקות שלך",

            // Dynamic Server Content - Topics and Descriptions
            Arithmetic: "חשבון",
            Addition: "חיבור",
            Subtraction: "חיסור",
            Multiplication: "כפל",
            Division: "חילוק",
            Fractions: "שברים",
            Geometry: "גאומטריה",
            Rectangle: "מלבן",
            Triangle: "משולש",
            Circle: "מעגל",
            Polygon: "מצולע",
            AdditionDescription: "חיבור מספרים יחד",
            SubtractionDescription: "חיסור מספרים זה מזה",
            MultiplicationDescription: "כפל מספרים",
            DivisionDescription: "חילוק מספרים",
            FractionsDescription: "עבודה עם שברים",
            GeometryDescription: "לימוד צורות ותכונותיהן",
            AlgebraDescription: "פתרון משוואות ועבודה עם משתנים",
            RectangleDescription: "הבנת מלבנים",
            TriangleDescription: "הבנת משולשים",
            CircleDescription: "הבנת מעגלים",
            PolygonDescription: "הבנת מצולעים כלליים",

            // Difficulty Levels
            BASIC: "בסיסי",
            EASY: "קל",
            MEDIUM: "בינוני",
            ADVANCED: "קשה",

            // Translation keys for solution step phrases
            //General:
            and: "ו",
            take: "קח",
            from: "מ",
            it: "זה",
            to: "ל",
            make: "צור",
            then: "אז",
            the: "את",
            remaining: "נותרים",
            get: "קבל",

            //Addition:
            add: "חבר",
            //todo
            toAdd: "כדי להוסיף",
            simplyAdd: "פשוט תוסיף",
            step1: "שלב 1:",
            step2: "שלב 2:",
            step3: "שלב 3:",
            divide: "תחלק",
            applySign: "השתמש בסימן",
            multiply: "תכפול",
            area: "שטח",
            perimeter: "היקף",
            circumference: "היקף",
            hypotenuse: "אלכסון",
            combineParts: "אחד את החלקים",
            combineOnes: "שלב את האחדות",
            combineTens: "שלב את העשרות",
            combineHundreds: "שלב את המאות",
            simplifiesTo: "מה שמתפשט ל"
        }
    }
};

const userLanguage = localStorage.getItem('language') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: userLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        debug: false
    });

export default i18n;





