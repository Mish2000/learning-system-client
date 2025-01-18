import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            //NavBar.jsx
            quickMath: "Quick Math",
            home: "Home",
            practice: "Practice",
            statistics: "Statistics",
            profile: "Profile",
            logOut: "Log Out",
            //ProfilePage.jsx
            loadingProfile: "Loading Profile...",
            profileManagement: "Profile Management",
            username: "Username",
            email: "Email",
            newUsername: "New Username",
            newPassword: "New Password",
            interfaceLanguage: "Interface Language",
            saveProfile: "Save Profile",
            pleaseGenerateQuestion: "Please generate a question",
            //NoteBook.jsx
            question: "Question",
            yourAnswer: "Your Answer:",
            submitAnswer: "Submit Answer",
            correct: "Correct",
            yes: "Yes",
            no: "No",
            seeStepsAndAnswer: "See steps and correct answer",
            nextQuestion: "Next Question",
            changeSubject: "Change Subject",
            writeYourAnswerHere: "writeYourAnswerHere",
            loadingQuestionData: "Loading question data...",

            bankOfQuestionTypes: "Bank of Question Types:",
            totalUsers: "Total Users:",
            totalAttempts: "Total Attempts:",
            overallSuccessRate: "Overall Success Rate:",
            attemptsByTopic: "Attempts by Topic:",
            successRateByTopic: "Success Rate by Topic:",
            userDashboard: "User Dashboard",
            loadingUserDashboard: "Loading user dashboard ...",
            //Home.jsx
            welcomeQuickMath: "Welcome to Quick Math!",
            selfLearningMath: "This is a platform for self-learning and practicing math with a wide variety of topics, we have a detector that will see what you are getting difficult with and match the exercises to your level, this is all for you to understand the way to solve the problem and then move on to a higher difficulty so you can improve your math, we also have dynamic question generation and personalized dashboards.",
            //PracticePage.jsx
            timeToPractice: "Time to practice!",
            //QuestionGenerator.jsx
            questionType: "Question Type",
            difficulty: "Difficulty Level",
            selectType: "-- Select Type --",
            selectDifficulty: "-- Select Difficulty --",
            basic: "Basic",
            easy: "Easy",
            medium: "Medium",
            advanced: "Hard",
            generate: "Generate",
            //AdminDashboardSSE.jsx
            loadingAdminDashboard: "Loading Admin Dashboard...",
            adminDashboard: "Admin Dashboard",
            totalUsersAdmin: "Total Users:",
            totalAttemptsAdmin: "Total Attempts:",
            overallSuccessRateAdmin: "Overall Success Rate:",
            attemptsByTopicAdmin: "Attempts by Topic:",
            successRateByTopicAdmin:"Success Rate by Topic:",
            //UserDashBoardSSE.jsx
            loadingUserDashboardPage: "Loading user dashboard...",
            userDashboardTitle: "User Dashboard",

            //todo
            login: "Login",
            register: "Register",
            createAccount: "Create Account",
            loginFailed: "Username or password are incorrect",
            profileUpdatedSuccessfully: "Profile updated successfully!",
            updateFailed: "Update failed",
            error404: "Error 404",
            notFound: "Not Found",
            goBack: "Go Back",
            loadingProfilePage: "Loading Profile...",


            homeDescription: "This is a platform for self-learning and practicing math with a wide variety of topics...",
            startPracticing: "Start Practicing",
            goToProfilePage: "Go to Profile Page",
            seeYourStatistics: "See Your Statistics",
            loginPageTitle: "Login",
            registerPageTitle: "Create Account",
            registerSuccess: "Registration successful! Redirecting to login page...",
            registrationError: "Please check if all fields are filled correctly",
            alreadyHaveAccount: "Already have an account? Click here 👆",
        }
    },
    he: {
        translation: {
            //NavBar.jsx
            quickMath: "Quick Math",
            home: "בית",
            practice: "תרגול",
            statistics: "סטטיסטיקה",
            profile: "פרופיל",
            logOut: "התנתק",
            //ProfilePage.jsx
            loadingProfile: "טוען פרופיל...",
            profileManagement: "ניהול פרופיל",
            username: "שם משתמש",
            email: "דוא\"ל",
            newUsername: "שם משתמש חדש",
            newPassword: "סיסמה חדשה",
            interfaceLanguage: "שפת ממשק",
            saveProfile: "שמור פרופיל",
            pleaseGenerateQuestion: "אנא צור שאלה",
            //NoteBook.jsx
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

            bankOfQuestionTypes: "בנק סוגי שאלות:",
            totalUsers: "סה\"כ משתמשים:",
            totalAttempts: "סה\"כ ניסיונות:",
            overallSuccessRate: "שיעור הצלחה כולל:",
            attemptsByTopic: "ניסיונות לפי נושא:",
            successRateByTopic: "שיעור הצלחה לפי נושא:",
            userDashboard: "לוח מחוונים משתמש",
            loadingUserDashboard: "טוען לוח מחוונים משתמש...",
            //Home.jsx
            welcomeQuickMath: "ברוכים הבאים ל-Quick Math!",
            selfLearningMath: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים, יש לנו מגלה שיראה עם מה אתה מתקשה ויתאים את התרגילים לרמתך, כל זאת כדי שתבין את הדרך לפתור את הבעיה ולאחר מכן תעבור לרמת קושי גבוהה יותר כדי שתוכל לשפר את המתמטיקה שלך, יש לנו גם יצירת שאלות דינמית ולוחות מחוונים מותאמים אישית.",
            //PracticePage.jsx
            timeToPractice: "הגיע הזמן לתרגל!",
            //QuestionGenerator.jsx
            questionType: "סוג שאלה",
            operatorType: "סוג מפעיל",
            difficulty: "רמת קושי",
            selectType: "-- בחר סוג --",
            selectDifficulty: "-- בחר רמת קושי --",
            basic: "בסיסי",
            easy: "קל",
            medium: "בינוני",
            advanced: "קשה",
            generate: "צור",
            //AdminDashboardSSE.jsx
            loadingAdminDashboard: "טוען לוח מחוונים מנהל...",
            adminDashboard: "לוח מחוונים מנהל",
            totalUsersAdmin: "סה\"כ משתמשים:",
            totalAttemptsAdmin: "סה\"כ ניסיונות:",
            overallSuccessRateAdmin: "שיעור הצלחה כולל:",
            attemptsByTopicAdmin: "ניסיונות לפי נושא:",
            successRateByTopicAdmin: "שיעור הצלחה לפי נושא:",
            //UserDashBoardSSE.jsx
            loadingUserDashboardPage: "טוען לוח מחוונים משתמש...",
            userDashboardTitle: "לוח מחוונים משתמש",

            //todo
            login: "התחבר",
            register: "הרשם",
            createAccount: "צור חשבון",
            loginFailed: "שם משתמש או סיסמה שגויים",
            profileUpdatedSuccessfully: "הפרופיל עודכן בהצלחה!",
            updateFailed: "עדכון נכשל",
            error404: "שגיאה 404",
            notFound: "לא נמצא",
            goBack: "חזור",
            loadingProfilePage: "טוען פרופיל...",
            homeDescription: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים...",
            startPracticing: "התחל לתרגל",
            goToProfilePage: "גש לדף הפרופיל",
            seeYourStatistics: "ראה את הסטטיסטיקות שלך",
            loginPageTitle: "התחברות",
            registerPageTitle: "צור חשבון",
            registerSuccess: "הרשמה הצליחה! מועבר לדף ההתחברות...",
            registrationError: "אנא בדוק אם כל השדות מולאו כראוי",
            alreadyHaveAccount: "כבר יש לך חשבון? לחץ כאן 👆",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;



