import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import hePractice from './practice.js'

const resources = {
    en: {
        translation: {
            // NavBar.jsx
            quickMath: "Quick Math",
            home: "Home",
            practice: "Practice",
            statistics: "Statistics",
            adminSection: 'Admin Section',
            profile: "Profile",
            logOut: "Log Out",

            // ProfilePage.jsx
            pleaseCheckFields: "Please check that all fields are correct",
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
            subLevel: "Sub-level",
            currentDifficulty: "Current Difficulty",
            UploadNewPhoto: "Upload New Photo",
            RemovePhoto: "Delete Photo",

            // NoteBook.jsx
            solutionSteps: "Solution Steps",
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
            noQuestionLoaded: "No question loaded",
            failedToSubmitAnswer: "Failed to submit answer",
            subtract: "Subtract",
            askAiSolution: "Ask AI for an Alternative Solution",
            loadingAiSolution: "Contacting the AI model, please wait...",
            failedToGetAiSolution: "Failed to retrieve AI solution. Please try again.",
            alternativeSolutionFromAi: "Alternative Solution from AI",

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
            operatorType: "Operator Type",
            shapeType: "Shape Type",
            addTopic: "Add Topic",
            addSubtopic: "Add Subtopic",
            parentTopics: "General Topics",


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
            loading: "Loading...",
            welcomeBack: "Welcome back",
            overallProgress: "Overall Progress",
            overallProgressLevel: "Progress Level",
            overallProgressScore: "Progress Score",
            overallProgressPendingBackend: "No overall progress data yet. Start practicing to unlock it.",
            successRateByTopic: "Success Rate by Topic",
            totalSuccessRate: "Total Success Rate",
            parentTopicDifficulty: "General Topic Difficulty",
            topic: "Topic",
            topicDifficultyPendingBackend: "No topic difficulty data yet. Start practicing to unlock it.",
            subtopicDifficulty: "Subtopic Difficulty",
            subtopic: "Subtopic",
            subtopicDifficultyPendingBackend: "No subtopic difficulty data yet. Start practicing to unlock it.",

            // ChartSuccessRateByTopic.jsx
            successRateTitle: "Success Rate By Topic",
            noTopicData: "No topic data available.",

            // ChartTotalSuccessRate.jsx
            overallSuccessTitle: "Overall Success Rate",
            overallSuccess: "Overall Success",
            noOverallSuccessData: "No overall success data.",

            // Error404.jsx
            error404: "Error 404",
            notFound: "Not Found",
            goBack: "Go Back",

            // Login.jsx
            login: "Login",
            register: "Register",
            createAccount: "Create Account",
            loginFailed: "Email address or password are incorrect",
            loginPageTitle: "Login",
            usernamePlaceholder: "Enter your username",
            passwordPlaceholder: "Enter your password",
            loginPasswordHelperText: "Do not share your password with anyone else",
            loginTitle: "Quick Math",
            slogan: "Think Fast - Solve Faster!",

            // Register.jsx
            registerPageTitle: "Create New Account",
            registerPageButton: "Register",
            registerSuccess: "Registration successful! Redirecting to login page...",
            registrationError: "Please check if all fields are filled correctly",
            alreadyHaveAccount: "Already have an account? Click here 👆",
            usernameHelperText: "At least four characters long, maximum 30",
            RegisterPasswordHelperText: "8-30 characters, must include: lowercase, uppercase, number, and one special character",
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

            // PasswordStrengthIndicator.jsx
            passwordStrength: "Password Strength:",
            Invalid: "Invalid",
            Weak: "Weak",
            Normal: "Normal",
            Strong: "Strong",

            //TopicManagementPage.jsx
            adminTopicManagement: "Admin Topic Management",
            createNewTopic: "Create a New Topic",
            topicName: "Topic Name",
            description: "Description",
            parentTopic: "Parent Topic",
            none: "None",
            createTopic: "Create Topic",
            existingTopics: "Existing Topics",
            noTopicsFound: "No topics found.",
            deleteTopic: "Delete Topic",
            topicCreatedSuccessfully: "Topic created successfully!",
            topicCreationFailed: "Topic creation failed.",
            topicDeleted: "Topic deleted!",
            topicDeletionFailed: "Topic deletion failed.",
            pleaseEnterValidTopicName: "Please enter a valid topic name",
            restoreDeletedTopics: "Restore existing subtopic from server",
            restore: "Restore",
            topicRestored: "Topic restored successfully.",
            topicRestoreFailed: "Topic restore failed.",
            noDeletedTopicsFound: "No deleted topics to restore.",
            loadingDeletedTopics: "Loading deleted topics...",
            restoreParentFirst: "Restore parent topic first.",
            deletedSubtopics: "Deleted subtopics (parent active)",
            unknownParent: "Unknown parent",
            createHiddenUntilDeletion: "Creating new topics is disabled. Delete a topic/subtopic first to enable restore.",


            // Dynamic Server Content - Topics and Descriptions
            Arithmetic: "Arithmetic",
            addition: "Addition",
            simpleMath: "Simple Math",
            Subtraction: "Subtraction",
            Multiplication: "Multiplication",
            Division: "Division",
            Fractions: "Fractions",
            Geometry: "Geometry",
            Rectangle: "Rectangle",
            Triangle: "Triangle",
            Circle: "Circle",
            Polygon: "Polygon",
            ArithmeticDescription: "Basic arithmetic operations",
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


            // Some solution-step phrases (for translateSolutionSteps.js to match)
            and: "and",
            take: "take",
            from: "from",
            it: "it",
            tens: "tens",
            to: "to",
            make: "make",
            then: "then",
            the: "the",
            remaining: "remaining",
            get: "get",

            toAdd: "To add",
            add: "add",
            simplyAdd: "simply add",
            step1: "Step 1:",
            step2: "Step 2:",
            step3: "Step 3:",
            divide: "Divide",
            applySign: "Apply the sign",
            multiply: "Multiply",
            area: "Area",
            write: "write",
            perimeter: "Perimeter",
            circumference: "Circumference",
            hypotenuse: "Hypotenuse",
            combineParts: "Combine the parts",
            combineOnes: "Combine the ones",
            combineTens: "Combine the tens",
            combineHundreds: "Combine the hundreds",
            simplifiesTo: "which simplifies to",
            by: "by",
        }
    },

    he: {
        translation: {
            // NavBar.jsx
            quickMath: "חשבון מהיר",
            home: "בית",
            practice: "תרגול",
            statistics: "סטטיסטיקה",
            adminSection: 'אזור ניהול',
            profile: "פרופיל",
            logOut: "התנתק",

            // ProfilePage.jsx
            pleaseCheckFields: "אנא בדוק שכל השדות תקינים",
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
            subLevel: "תת רמה",
            currentDifficulty: "רמת קושי נוכחית",
            UploadNewPhoto: "העלאת תמונה חדשה",
            RemovePhoto: "מחיקת תמונה",

            // NoteBook.jsx
            solutionSteps: "שלבי פתרון",
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
            noQuestionLoaded: "לא נטענה שאלה",
            failedToSubmitAnswer: "שליחת תשובה נכשלה",
            // In the "he" section:
            askAiSolution: "בינה מלאכותית לפתרון מפורט יותר",
            loadingAiSolution: "הבינה חושבת, התעזר בסבלנות...",
            failedToGetAiSolution: "הבקשה נכשלה, נסה שוב מאוחר יותר.",
            alternativeSolutionFromAi: "פתרון מבוסס בינה מלאכותית",


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
            operatorType: "סוג פעולה",
            shapeType: "סוג צורה",
            addTopic: "הוסף נושא",
            addSubtopic: "הוסף תת-נושא",
            parentTopics: "נושאים כלליים",

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
            loading: "טוען...",
            welcomeBack: "ברוך הבא חזרה",
            overallProgress: "התקדמות כללית",
            overallProgressLevel: "רמת התקדמות",
            overallProgressScore: "ציון התקדמות",
            overallProgressPendingBackend: "עדיין אין נתוני התקדמות כללית. התחילו לתרגל כדי לפתוח אותם.",
            successRateByTopic: "אחוז הצלחה לפי נושא",
            totalSuccessRate: "אחוז הצלחה כולל",
            parentTopicDifficulty: "רמת קושי של נושאים כלליים",
            topic: "נושא",
            topicDifficultyPendingBackend: "עדיין אין נתוני רמת קושי לנושאים. התחילו לתרגל כדי לפתוח אותם.",
            subtopicDifficulty: "רמת קושי של תתי־נושאים",
            subtopic: "תת־נושא",
            subtopicDifficultyPendingBackend: "עדיין אין נתוני רמת קושי לתתי־נושאים. התחילו לתרגל כדי לפתוח אותם.",


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
            loginFailed: "כתובת אימייל או סיסמה שגויים",
            loginPageTitle: "התחברות",
            usernamePlaceholder: "הזן את שם המשתמש שלך",
            passwordPlaceholder: "הזן את הסיסמה שלך",
            loginPasswordHelperText: "נא לא לשתף את סיסמתך עם כל אדם אחר",
            loginTitle: "חשבון מהיר",
            slogan: "לחשוב מהר - לפתור מהר יותר!",

            // Register.jsx
            registerPageTitle: "צור משתמש חדש",
            registerPageButton: "הרשמה",
            registerSuccess: "הרשמה הצליחה! מועבר לדף ההתחברות...",
            registrationError: "אנא בדוק אם כל השדות מולאו כראוי",
            alreadyHaveAccount: "כבר יש לך חשבון? לחץ כאן 👆",
            usernameHelperText: "באורך ארבעה תווים לפחות, שלושים לכל היותר",
            RegisterPasswordHelperText: "בעלת 8 עד 30 תווים, חייבת לכלול לפחות: אות קטנה וגדולה, מספר ותו מיוחד ",
            emailPlaceholder: "הזן את כתובת הדוא\"ל שלך",
            emailHelperText: "בפורמט של xxx@xxx.xxx",
            repeatPasswordPlaceholder: "הזן שוב את הסיסמה שלך",
            passwordsMustMatch: "הסיסמאות חייבות להתאים",

            // Home.jsx
            welcomeQuickMath: "ברוכים הבאים לחשבון מהיר!",
            selfLearningMath: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים. אנחנו עוזרים לך להבין עם מה אתה מתקשה ונתאים את התרגילים לרמתך. כל זאת כדי שתבין את הדרך לפתור בעיות ולאחר מכן תעבור לרמות קושי גבוהות יותר כדי לשפר את כישורי המתמטיקה שלך. אנו מציעים גם יצירת שאלות דינמית ולוח סטטיסטיקה אישי ונוח",
            homeDescription: "זו פלטפורמה ללימוד עצמי ותרגול מתמטיקה עם מגוון רחב של נושאים...",
            startPracticing: "התחל לתרגל",
            goToProfilePage: "גש לדף הפרופיל",
            seeYourStatistics: "ראה את הסטטיסטיקות שלך",

            // PasswordStrengthIndicator.jsx
            passwordStrength: "חוזק סיסמה:",
            Invalid: "לא תקין",
            Weak: "חלש",
            Normal: "רגיל",
            Strong: "חזק",
            by: "ב",


            //TopicManagementPage.jsx
            adminTopicManagement: "ניהול נושאים למנהל",
            createNewTopic: "צור נושא חדש",
            topicName: "שם נושא",
            description: "תיאור",
            parentTopic: "נושא אב",
            none: "ללא",
            createTopic: "צור נושא",
            existingTopics: "נושאים קיימים",
            noTopicsFound: "לא נמצאו נושאים.",
            deleteTopic: "מחק נושא",
            topicCreatedSuccessfully: "הנושא נוצר בהצלחה!",
            topicCreationFailed: "יצירת הנושא נכשלה.",
            topicDeleted: "הנושא נמחק!",
            topicDeletionFailed: "מחיקת הנושא נכשלה.",
            pleaseEnterValidTopicName: "אנא הזן שם נושא תקין",
            restoreDeletedTopics: "שחזור תת-נושא/נושא קיים מהשרת",
            restore: "שחזור",
            topicRestored: "הנושא שוחזר בהצלחה.",
            topicRestoreFailed: "שחזור הנושא נכשל.",
            noDeletedTopicsFound: "אין נושאים שנמחקו לשחזור.",
            loadingDeletedTopics: "טוענת נושאים שנמחקו...",
            restoreParentFirst: "יש לשחזר קודם את נושא האב.",
            deletedSubtopics: "תתי-נושאים שנמחקו (נושא אב פעיל)",
            unknownParent: "נושא אב לא ידוע",
            createHiddenUntilDeletion: "יצירת נושאים חדשים מושבתת. מחק נושא/תת־נושא כדי להפעיל שחזור.",


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
            ArithmeticDescription: "פעולות חשבון בסיסיות",
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

            toAdd: "כדי להוסיף",
            add: "חבר",
            numbers: "המספרים",
            parts: "חלקים",
            allThe: "את כול",
            now: "עכשיו",
            subtract: "חסר",
            simpleMath: "חשבון פשוט",
            result: "תוצאה",
            simplyAdd: "פשוט תוסיף",
            step1: "שלב 1:",
            step2: "שלב 2:",
            step3: "שלב 3:",
            divide: "תחלק",
            applySign: "השתמש בסימן",
            multiply: "תכפול",
            area: "שטח",
            ones: "אחדות",
            tens: "עשרות",
            hundreds: "",
            simply: "בפשטות",
            directly: "באופן ישיר",
            write: "כתוב",
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
resources.he = resources.he || {translation: {}};
resources.he.translation = {
    ...resources.he.translation,
    ...hePractice,
};

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


